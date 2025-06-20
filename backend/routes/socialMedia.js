// routes/socialMedia.js
import express from 'express';
const router = express.Router();

const MOCK_POSTS = [
  { post: "#floodrelief Need food in NYC", user: "citizen1" },
  { post: "Power outage after landslide in Himachal!", user: "himachali_dev" },
  { post: "Trapped near Red Cross Shelter - urgent help needed!", user: "help_me_22" },
];

router.get('/:id/social-media', async (req, res) => {
  const { id } = req.params;

  res.json({
    disaster_id: id,
    posts: MOCK_POSTS,
  });
});

export default router;
