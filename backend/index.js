import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { createServer } from "http";
import { Server } from "socket.io";
import geocodeRoute from "./routes/geocode.js";
import extractLocationRoute from './routes/extractLocation.js';
import autoGeocode from './routes/autoGeocode.js';
import fullDisasterInfo from './routes/fullDisasterInfo.js';
import socialMediaRoutes from './routes/socialMedia.js';
import resourceRoutes from './routes/resources.js';
import officialUpdatesRoute from './routes/officialUpdates.js';
import verifyImageRoute from './routes/verifyImage.js';
import disastersRoute from './routes/disasters.js';
import reportRoutes from './routes/reports.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

app.use("/geocode", geocodeRoute);

app.use('/extract-location', extractLocationRoute);
app.use('/auto-geocode', autoGeocode);
app.use('/disasters', fullDisasterInfo);
app.use('/disasters', socialMediaRoutes);
app.use('/resources', resourceRoutes);
app.use('/official-updates', officialUpdatesRoute);
app.use('/verify-image', verifyImageRoute);
app.use('/all-disasters', disastersRoute);
app.use('/reports', reportRoutes);




// Test route
app.get("/", (req, res) => {
  res.send("Disaster Response Platform API");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
