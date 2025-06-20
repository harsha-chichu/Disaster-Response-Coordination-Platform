// routes/resources.js
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

router.get('/nearby', async (req, res) => {
  const { lat, lon, radius = 10000 } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon are required' });
  }

  try {
    const { data, error } = await supabase.rpc('get_nearby_resources', {
      lat_input: parseFloat(lat),
      lon_input: parseFloat(lon),
      radius_input: parseInt(radius),
    });

    if (error) {
      console.error('Supabase RPC error:', error.message);
      return res.status(500).json({ error: 'Failed to fetch nearby resources' });
    }

    res.json({ resources: data });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
