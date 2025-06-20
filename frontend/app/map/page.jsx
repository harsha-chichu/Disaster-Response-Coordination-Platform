'use client';
import dynamic from 'next/dynamic';

// Dynamically load Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function MapPage() {
  return (
    <main className="h-screen w-full">
      <Map />
    </main>
  );
}
