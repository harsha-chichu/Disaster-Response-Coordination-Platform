'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function DisasterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const { title, description, latitude, longitude } = form;

  const { error } = await supabase.from('disasters').insert({
    title,
    description,
    location_name: `Lat ${latitude}, Lng ${longitude}`,
    location: `SRID=4326;POINT(${parseFloat(longitude)} ${parseFloat(latitude)})`,
  });

  setLoading(false);

  if (error) {
    console.error('Insert error:', error);
    alert(`❌ Submission failed: ${error.message}`);
  } else {
    router.push('/map');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Report a Disaster
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g. Flood in Chennai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Provide details about the disaster"
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            {loading ? 'Submitting...' : 'Submit Disaster'}
          </button>
        </form>
      </div>
    </div>
  );
}
