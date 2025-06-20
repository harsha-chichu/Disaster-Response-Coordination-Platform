// routes/extractLocation.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const response = await axios.post(
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

    console.log("Gemini raw response:", response.data);

    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const locationName = raw?.split('\n')[0]?.trim();

    if (!locationName) {
      return res.status(500).json({ error: 'No location extracted' });
    }

    res.json({ location_name: locationName });
  } catch (err) {
    console.error('Gemini location extraction error:', err.message);
    res.status(500).json({ error: 'Location extraction failed' });
  }
});

export default router;
