import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
L.Icon.Default.prototype.options.iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
L.Icon.Default.prototype.options.iconRetinaUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
L.Icon.Default.prototype.options.shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

const LiveMap = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [updates, setUpdates] = useState<{ id: number; location: [number, number]; message: string }[]>([]);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  // Function to fetch updates (replace with Prisma integration)
  const fetchUpdates = async () => {
    try {
      // Replace this mock data with your Prisma fetch logic
      const prismaUpdates: { id: number; location: [number, number]; message: string }[] = [
        { id: 1, location: [51.505, -0.09], message: "Road closed due to flooding" },
        { id: 2, location: [51.51, -0.1], message: "Traffic congestion reported" },
        { id: 3, location: [51.503, -0.08], message: "Accident near this area" },
      ];
      setUpdates(prismaUpdates);
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  // Initial fetch for updates
  useEffect(() => {
    fetchUpdates();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen  bg-gray-100">
      <div className="  relative  z-50 w-full h-[80vh] rounded-lg overflow-hidden border shadow-lg mb-16 ">
        <MapContainer
          center={userLocation}
          zoom={13}
          className="w-full h-full"
        >
          {/* Tile Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* User Marker */}
          <Marker position={userLocation}>
            <Popup>
              <b>Your Location</b>
            </Popup>
          </Marker>

          {/* Live Updates Markers */}
          {updates.map((update) => (
            <Marker key={update.id} position={update.location}>
              <Popup>
                <b>Update:</b> {update.message}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* <button
        onClick={fetchUpdates}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        Refresh Updates
      </button> */}
      
    </div>
  );
};

export default LiveMap;
