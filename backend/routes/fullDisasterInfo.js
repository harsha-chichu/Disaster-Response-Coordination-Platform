// routes/fullDisasterInfo.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const router = express.Router();

// Setup Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// API Keys
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;

// POST /disasters/full - Create new disaster
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    // 1. Extract location using Gemini
    const geminiRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [
          {
            parts: [{ text: `Extract the location from this disaster description: "${description}"` }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
      }
    );

    const location_name =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text?.split('\n')[0]?.trim();

    if (!location_name) {
      return res.status(500).json({ error: 'Location extraction failed' });
    }

    // 2. Geocode location using Mapbox
    const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location_name
    )}.json?access_token=${MAPBOX_API_KEY}&limit=1`;

    const geoRes = await axios.get(mapboxUrl);
    const [lon, lat] = geoRes.data?.features?.[0]?.center || [];

    if (!lat || !lon) {
      return res.status(500).json({ error: 'Geocoding failed' });
    }

    // 3. Insert into Supabase
    const { data, error: insertError } = await supabase.from('disasters').insert({
      title,
      description,
      location_name,
      location: `POINT(${lon} ${lat})`,
    }).select().single();

    if (insertError) {
      console.error('Supabase insert error:', insertError.message);
      return res.status(500).json({ error: 'Failed to insert disaster' });
    }

    res.json({
      message: '✅ Disaster inserted successfully',
      title,
      description,
      location_name,
      coordinates: { lat, lon },
      id: data.id
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal error occurred' });
  }
});

// GET /disasters/full/:id - Fetch full disaster details
router.get('/full/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('disasters')
    .select(`
      *,
      resources(*),
      reports(*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('❌ Disaster fetch error:', error?.message);
    return res.status(404).json({ error: 'Disaster not found' });
  }

  res.json(data);
});


export default router;
