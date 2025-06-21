export default async function DisasterDetailPage({ params }) {
  const { id } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disasters/full/${id}`, {
      cache: "no-store", 
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch disaster: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Disaster detail fetched:", data);

    if (!data) {
      return <p className="p-4 text-red-500">Disaster not found.</p>;
    }

    const { title, description, location_name, coordinates, social_media, resources, official_updates } = data;

    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-gray-600">{location_name}</p>
          <p className="mt-2">{description}</p>
        </div>

        {coordinates && (
          <div>
            <h2 className="text-xl font-semibold">Coordinates</h2>
            <p>
              Latitude: {coordinates.lat}, Longitude: {coordinates.lon}
            </p>
          </div>
        )}

        {social_media?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">Social Media Posts</h2>
            <ul className="list-disc ml-6 space-y-1">
              {social_media.map((post, idx) => (
                <li key={idx}>
                  <strong>@{post.user}</strong>: {post.post}
                </li>
              ))}
            </ul>
          </div>
        )}

        {resources?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">Nearby Resources</h2>
            <ul className="list-disc ml-6 space-y-1">
              {resources.map((res, idx) => (
                <li key={idx}>
                  {res.name} ({res.type}) - {res.location_name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {official_updates?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold">Official Updates</h2>
            <ul className="list-disc ml-6 space-y-1">
              {official_updates.map((update, idx) => (
                <li key={idx}>{update}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error("❌ Error loading disaster details:", err.message);
    return <p className="p-4 text-red-500">Error loading disaster details.</p>;
  }
}
