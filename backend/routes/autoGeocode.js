import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;

router.post('/', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    
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

    const raw = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const locationName = raw?.split('\n')[0]?.trim();

    if (!locationName) {
      return res.status(500).json({ error: 'No location extracted' });
    }

    // Step 2: Geocode the location using Mapbox
    const mapboxRes = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationName)}.json`,
      {
        params: {
          access_token: MAPBOX_API_KEY,
          limit: 1,
        },
      }
    );

    const [lon, lat] = mapboxRes.data.features[0]?.center || [];

    if (!lat || !lon) {
      return res.status(404).json({ error: 'Location not found during geocoding' });
    }

    res.json({
      description,
      location_name: locationName,
      coordinates: { lat, lon }
    });
  } catch (err) {
    console.error('❌ Auto-geocode error:', err.message);
    res.status(500).json({ error: 'Auto-geocoding failed' });
  }
});

export default router;
