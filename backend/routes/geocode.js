import express from "express";
import { getCoordinates } from "../services/geocode.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { location_name } = req.body;

  if (!location_name) {
    return res.status(400).json({ error: "location_name is required" });
  }

  const coords = await getCoordinates(location_name);

  if (!coords) {
    return res.status(404).json({ error: "Location not found" });
  }

  res.json(coords);
});

export default router;
