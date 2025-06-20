// routes/verifyImageForReport.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/:reportId', async (req, res) => {
  const { reportId } = req.params;

  const { data: report, error: fetchError } = await supabase
    .from('reports')
    .select('id, image_url')
    .eq('id', reportId)
    .single();

  if (fetchError || !report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const prompt = `Analyze this image for signs of manipulation or disaster context: ${report.image_url}`;

  try {
    const geminiRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
      }
    );

    const text = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      return res.status(500).json({ error: 'No analysis result from Gemini' });
    }

    let verdict = 'inconclusive';
    if (/flood|disaster|emergency/i.test(text)) verdict = 'likely-real';
    if (/fake|manipulat|edited/i.test(text)) verdict = 'possibly-fake';

    const { error: updateError } = await supabase
      .from('reports')
      .update({ verification_status: verdict })
      .eq('id', reportId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update report status' });
    }

    res.json({ report_id: reportId, verdict, analysis: text });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: 'Gemini verification failed' });
  }
});

export default router;
