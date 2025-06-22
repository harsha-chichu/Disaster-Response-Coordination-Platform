'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabaseClient';

export default function DisasterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { title, description, latitude, longitude } = form;

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon)) {
      setMessage({ type: 'error', text: '❌ Invalid latitude or longitude.' });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('disasters').insert({
      title,
      description,
      location_name: `Lat ${lat}, Lng ${lon}`,
      location: `SRID=4326;POINT(${lon} ${lat})`,
    });

    setLoading(false);

    if (error) {
      console.error('Insert error:', error);
      setMessage({ type: 'error', text: `❌ Submission failed: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: '✅ Disaster reported successfully!' });
      router.push('/map');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          📍 Report a Disaster
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Flood in Chennai"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 w-full rounded-lg border-gray-300 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide details about the disaster"
            />
          </div>

          {/* Coordinates */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                required
                className="mt-1 w-full text-gray-700 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                required
                className="mt-1 w-full text-gray-700 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
          >
            {loading ? 'Submitting...' : 'Submit Disaster'}
          </button>

          {/* Feedback Message */}
          {message && (
            <div
              className={`text-sm p-3 mt-2 rounded-md text-center ${
                message.type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
