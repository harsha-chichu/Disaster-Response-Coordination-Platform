// scripts/seedDisasters.js
import supabase from './db/supabaseClient.js';

const seedDisasters = async () => {
  // Check if there are already disasters in the table
  const { data: existing, error: fetchError } = await supabase
    .from("disasters")
    .select("id");

  if (fetchError) {
    console.error("❌ Failed to check existing data:", fetchError.message);
    return;
  }

  if (existing.length > 0) {
    console.log("⚠️ Disasters already exist. Skipping seeding.");
    return;
  }

  // Seed only if the table is empty
  const { data, error } = await supabase
    .from("disasters")
    .insert([
      {
        title: "NYC Flood",
        location_name: "Manhattan, NYC",
        description: "Heavy flooding in Manhattan after torrential rain.",
        tags: ["flood", "urgent"],
        owner_id: "netrunnerX",
        created_at: new Date().toISOString(),
        audit_trail: [
          {
            action: "create",
            user_id: "netrunnerX",
            timestamp: new Date().toISOString(),
          },
        ],
      },
      {
        title: "California Wildfire",
        location_name: "Los Angeles, CA",
        description: "Wildfires have engulfed the northern edge of LA.",
        tags: ["fire", "evacuation"],
        owner_id: "reliefAdmin",
        created_at: new Date().toISOString(),
        audit_trail: [
          {
            action: "create",
            user_id: "reliefAdmin",
            timestamp: new Date().toISOString(),
          },
        ],
      },
    ])
    .select(); // Get inserted rows back

  if (error) {
    console.error("❌ Error inserting seed data:", error.message);
  } else {
    console.log("✅ Seed data inserted:", data);
  }
};

seedDisasters();
