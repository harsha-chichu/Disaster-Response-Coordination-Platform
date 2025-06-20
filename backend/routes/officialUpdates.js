// routes/officialUpdates.js
import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = express.Router();

// Example: scraping Red Cross news
router.get('/', async (req, res) => {
  try {
    const { data: html } = await axios.get('https://www.redcross.org/about-us/news-and-events/latest-news.html');
    const $ = cheerio.load(html);

    const updates = [];

    $('.m-card__text').slice(0, 5).each((_, el) => {
      const title = $(el).find('a').text().trim();
      const url = 'https://www.redcross.org' + $(el).find('a').attr('href');
      const summary = $(el).find('p').text().trim();

      if (title && url) {
        updates.push({ title, url, summary });
      }
    });

    res.json({ updates });
  } catch (err) {
    console.error('Official updates scraping error:', err.message);
    res.status(500).json({ error: 'Failed to fetch official updates' });
  }
});

export default router;
