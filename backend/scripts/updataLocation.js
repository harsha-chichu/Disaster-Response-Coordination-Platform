
import supabase from '../db/supabaseClient.js';
import { getCoordinates } from '../services/geocode.js';

const updateDisasterLocations = async () => {
  const { data: disasters, error } = await supabase.from("disasters").select("*");

  if (error) {
    console.error("❌ Failed to fetch disasters:", error);
    return;
  }

  for (const disaster of disasters) {
    if (disaster.location === null && disaster.location_name) {
      const coords = await getCoordinates(disaster.location_name);

      if (coords) {
        const point = `SRID=4326;POINT(${coords.lon} ${coords.lat})`;

        const { error: updateError } = await supabase.rpc("update_disaster_location", {
          disaster_id_input: disaster.id,
          geom_input: point,
        });

        if (updateError) {
          console.error(`❌ Failed to update ${disaster.title}:`, updateError.message);
        } else {
          console.log(`✅ Updated location for: ${disaster.title}`);
        }
      }
    }
  }
};

updateDisasterLocations();
