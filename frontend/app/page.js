'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-4xl font-bold text-blue-800">Disaster Response Coordination Platform</h1>
        <p className="text-gray-700 text-lg">
          Report, verify, and visualize disaster events in real-time. Join the community in ensuring timely action and awareness.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <Link
            href="/add"
            className="block bg-blue-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            📝 Report a Disaster
          </Link>

          <Link
            href="/map"
            className="block bg-green-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-700 transition"
          >
            🗺️ View Disaster Map
          </Link>

          <Link
            href="/disasters"
            className="block bg-indigo-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            📋 View All Reports
          </Link>
        </div>

        <footer className="text-sm text-gray-400 pt-8">
          Built by Harsha Vardhan · Powered by Supabase & Gemini AI
        </footer>
      </div>
    </main>
  );
}
