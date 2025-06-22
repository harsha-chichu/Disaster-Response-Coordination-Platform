'use client';
import { useState } from 'react';

export default function DisasterForm({ disasterId }) {
  const [formData, setFormData] = useState({
    user_id: '',
    content: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, disaster_id: disasterId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to submit report');

      // Auto-trigger image verification
      if (formData.image_url) {
        const verifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/verify-image/${data.id}`,
          { method: 'POST' }
        );
        const verifyData = await verifyRes.json();
        console.log('✅ Verification Result:', verifyData);
      }

      setMessage({ type: 'success', text: 'Report submitted and verification triggered!' });
      setFormData({ user_id: '', content: '', image_url: '' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <input
        name="user_id"
        placeholder="Your Username"
        value={formData.user_id}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="content"
        placeholder="Report content"
        value={formData.content}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="image_url"
        placeholder="Image URL (optional)"
        value={formData.image_url}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
      {message && (
        <p
          className={`text-sm p-2 rounded ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
