// routes/reports.js
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/', async (req, res) => {
  const { content, user_id, image_url, disaster_id } = req.body;

  if (!content || !user_id || !disaster_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data: insertData, error: insertError } = await supabase
    .from('reports')
    .insert([{ content, user_id, image_url, disaster_id }])
    .select()
    .single();

  if (insertError) {
    return res.status(500).json({ error: insertError.message });
  }

  const prompt = `Analyze this image for signs of manipulation or disaster context: ${image_url}`;

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

    const resultText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let verdict = 'inconclusive';
    if (/flood|disaster|emergency/i.test(resultText)) verdict = 'likely-real';
    if (/fake|manipulat|edited/i.test(resultText)) verdict = 'possibly-fake';

    await supabase
      .from('reports')
      .update({ verification_status: verdict })
      .eq('id', insertData.id);

    res.json({
      message: 'Report submitted and verified',
      report_id: insertData.id,
      verification: verdict,
    });
  } catch (err) {
    console.error('Gemini Error:', err.message);
    res.status(500).json({ error: 'Image verification failed' });
  }
});

export default router;
