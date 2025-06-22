'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReportForm from '@/components/DisasterForm'; 
import Image from 'next/image';

export default function DisasterDetailPage() {
  const { id } = useParams();
  const [disaster, setDisaster] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disasters/full/${id}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch disaster: ${res.status}`);
        }

        const data = await res.json();
        setDisaster(data);
      } catch (err) {
        console.error('❌ Error loading disaster details:', err.message);
        setError('Error loading disaster details.');
      }
    };

    fetchData();
  }, [id]);

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!disaster) return <p className="p-4">Loading disaster details...</p>;

  const {
    title,
    description,
    location_name,
    coordinates,
    social_media,
    resources,
    official_updates,
    reports,
  } = disaster;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Title & Description */}
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600">{location_name}</p>
        <p className="mt-2">{description}</p>
      </div>

      {/* Coordinates */}
      {coordinates && (
        <div>
          <h2 className="text-xl font-semibold">Coordinates</h2>
          <p>Latitude: {coordinates.lat}, Longitude: {coordinates.lon}</p>
        </div>
      )}

      {/* Social Media Posts */}
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

      {/* Resources */}
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

      {/* Official Updates */}
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

      {/* Community Reports */}
      {reports?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold">Community Reports</h2>
          <ul className="space-y-4">
            {reports.map((report) => (
              <li key={report.id} className="border rounded p-4 shadow-sm">
                <p className="mb-2">{report.content}</p>
                <p className="text-sm text-gray-600">
                  <span>User: {report.user_id}</span>
                  <span className="ml-4">
                    Verification:{' '}
                    <span
                      className={`font-semibold ${
                        report.verification_status === 'possibly-fake'
                          ? 'text-red-500'
                          : report.verification_status === 'likely-real'
                          ? 'text-green-600'
                          : 'text-yellow-500'
                      }`}
                    >
                      {report.verification_status || 'unknown'}
                    </span>
                  </span>
                </p>
                {report.image_url && (
                  <div className="mt-3">
                    {/* Using <img> to support external URLs without Next.js config */}
                    <img
                      src={report.image_url}
                      alt="Report"
                      width={500}
                      height={300}
                      className="rounded border"
                      loading="lazy"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Report Form */}
      <div className="pt-10 border-t">
        <h2 className="text-xl font-bold mb-2">Submit a Report</h2>
        <ReportForm disasterId={id} />
      </div>
    </div>
  );
}
