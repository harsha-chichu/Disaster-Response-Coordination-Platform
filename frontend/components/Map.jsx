'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import supabase from '@/lib/supabaseClient';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

export default function Map() {
  const [disasters, setDisasters] = useState([]);

  useEffect(() => {
    const fetchDisasters = async () => {
      const { data, error } = await supabase.rpc('get_disasters_with_coords');
      if (error) {
        console.error('Error fetching disasters:', error);
      } else {
        console.log("Fetched disasters:", data);
        setDisasters(data);
      }
    };

    fetchDisasters();
  }, []);

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {disasters.map((disaster) => {
        if (!disaster.lat || !disaster.lng) return null;

        return (
          <Marker key={disaster.id} position={[disaster.lat, disaster.lng]}>
            <Popup>
              <strong>{disaster.title}</strong>
              <br />
              {disaster.description}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
