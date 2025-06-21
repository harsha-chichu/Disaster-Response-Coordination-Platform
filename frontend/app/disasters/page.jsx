"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DisasterListPage() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-disasters`)
      .then((res) => res.json())
      .then((data) => {
        setDisasters(data.disasters || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Disaster Reports</h1>

      {loading && <p>Loading...</p>}
      {!loading && disasters.length === 0 && <p>No disasters reported yet.</p>}

      <ul className="space-y-4">
        {disasters.map((disaster) => (
          <li
            key={disaster.id}
            className="p-4 border rounded shadow hover:bg-gray-100 transition"
          >
            <h2 className="text-xl font-semibold">{disaster.title}</h2>
            <p className="text-sm text-gray-600">{disaster.location_name}</p>
            <p className="text-gray-800 mt-1">{disaster.description}</p>
            <Link
              href={`/disasters/${disaster.id}`}
              className="text-blue-600 hover:underline mt-2 block"
            >
              View Details →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
