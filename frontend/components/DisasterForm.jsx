'use client';
import { useState } from 'react';
import supabase from '@/lib/supabaseClient';

export default function DisasterForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  const { title, description, latitude, longitude } = formData;

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    setMessage({ type: 'error', text: 'Invalid coordinates.' });
    setLoading(false);
    return;
  }

  const { error } = await supabase.from('disasters').insert([
    {
      title,
      description,
      location: `SRID=4326;POINT(${lng} ${lat})`, // WKT format: POINT(longitude latitude)
    },
  ]);

  if (error) {
    setMessage({ type: 'error', text: error.message });
  } else {
    setMessage({ type: 'success', text: 'Disaster added successfully!' });
    setFormData({ title: '', description: '', latitude: '', longitude: '' });
  }

  setLoading(false);
 };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        placeholder="Disaster Title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
      <input
        name="latitude"
        placeholder="Latitude"
        value={formData.latitude}
        onChange={handleChange}
        required
        type="number"
        className="w-full border border-gray-300 p-2 rounded"
      />
      <input
        name="longitude"
        placeholder="Longitude"
        value={formData.longitude}
        onChange={handleChange}
        required
        type="number"
        className="w-full border border-gray-300 p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Submitting...' : 'Submit Disaster'}
      </button>
      {message && (
        <div
          className={`text-sm p-2 rounded ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}
