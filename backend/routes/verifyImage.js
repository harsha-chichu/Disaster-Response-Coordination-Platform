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

  // 1. Fetch image_url for the report
  const { data: report, error: fetchError } = await supabase
    .from('reports')
    .select('id, image_url')
    .eq('id', reportId)
    .single();

  if (fetchError || !report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  // 2. Send explicit classification prompt to Gemini
  const prompt = `
You are an expert in verifying authenticity of images.
Given the image URL below, classify the image strictly as one of the following categories:
- real
- possibly-fake
- ai-generated
- unclear

Only respond with a single word: real, possibly-fake, ai-generated, or unclear.
Image URL: ${report.image_url}
`;

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

    const raw = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase().trim();
    console.log("🔍 Gemini raw response:", raw);

    const allowed = ['real', 'possibly-fake', 'ai-generated', 'unclear'];
    const verdict = allowed.includes(raw) ? raw : 'unclear';

    // 3. Update Supabase
    const { error: updateError } = await supabase
      .from('reports')
      .update({ verification_status: verdict })
      .eq('id', reportId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update verification status' });
    }

    res.json({
      report_id: reportId,
      verdict,
      analysis: raw,
    });
  } catch (err) {
    console.error('❌ Gemini verification error:', err.message);
    res.status(500).json({ error: 'Image verification failed' });
  }
});

export default router;
