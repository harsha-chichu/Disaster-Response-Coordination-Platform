// geocode.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;

export const getCoordinates = async (locationName) => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      locationName
    )}.json?access_token=${MAPBOX_API_KEY}`;

    const response = await axios.get(url);
    const [lon, lat] = response.data.features[0]?.center || [];

    if (lat && lon) {
      return { lat, lon };
    } else {
      return null;
    }
  } catch (err) {
    console.error("❌ Geocoding failed:", err.message);
    return null;
  }
};
