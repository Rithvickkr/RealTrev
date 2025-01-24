import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Modal from "./modal";
import { fetchUpdates } from "../lib/actions/fetchupdates";
import { useRecoilState } from "recoil";
import { darkModeState } from "@/recoil/darkmodeatom";
import { Button } from "@/components/ui/button";

import { mapQueryState } from "@/recoil/mapTriggeratom";

interface Update {
  id: number;
  coordinates: { coordinates: [number, number] };
  description: string;
}

// Fix default marker icon issue in Leaflet
L.Icon.Default.prototype.options.iconUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
L.Icon.Default.prototype.options.iconRetinaUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
L.Icon.Default.prototype.options.shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

const LiveMap = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([
    26.8467, 80.9462,
  ]); // Default to Lucknow
  const [updates, setUpdates] = useState<
    { id: number; location: [number, number]; description: string }[]
  >([]);

  // const mapRef = useRef(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [darkMode] = useRecoilState(darkModeState);
  const [mapQuery,setmapQuery] = useRecoilState(mapQueryState);

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
  const fetchUpdatesmain = async (): Promise<void> => {
    const [latitude, longitude] = userLocation;
    const updates = (await fetchUpdates({ latitude, longitude })) as Update[];

    setUpdates(
      updates.map(
        (update: {
          id: any;
          coordinates: { coordinates: any };
          description: any;
        }) => ({
          id: update.id,
          location: update.coordinates.coordinates,
          description: update.description,
        })
      )
    );
  };

  // Initial fetch for updates
  useEffect(() => {
    fetchUpdatesmain();
  }, [userLocation]);

  // Function to pan map to user location
  const panToUserLocation = () => {
    if (mapInstance.current) {
      mapInstance.current.flyTo(userLocation, 14, {
        animate: true,
        duration: 1.5, // Duration of the animation in seconds
      });
      console.log("Panned to user location with animation");
    } else {
      console.log("Map instance not available", mapInstance.current);
    }
  };
  useEffect(() => {
    if (mapQuery.trigger) {
      console.log("Panning to query location:", mapQuery.location);
      panToQuery(mapQuery.location); // Call your `panToQuery` function
      setmapQuery({ trigger: false, location: [0, 0] }); // Reset the trigger
    }
  }, [mapQuery]);

  const panToQuery = (location: [number, number]) => {
    if (mapInstance.current) {
      mapInstance.current.flyTo(location, 14, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-screen transition-colors duration-300  dark:bg-gray-900 text-gray-100 bg-sky-50 text-slate-900"}`}
    >
      <div className="relative z-40 w-full h-[80vh] rounded-lg overflow-hidden border shadow-lg mb-4 mt-4">
        <MapContainer
          center={userLocation}
          zoom={13}
          className="w-full h-full"
          whenReady={(event: any) => {  // eslint-disable-line @typescript-eslint/no-explicit-any
            const map = event.target as L.Map;
            mapInstance.current = map;
          }}
        >
          {/* Tile Layer */}
          <TileLayer
            url={
              darkMode
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* User Marker */}
          {/* <Marker position={userLocation}>
            <Popup>
              <b>{userLocation}</b>
            </Popup>
          </Marker> */}
          {/* Live Updates Markers */}
          {updates.map((update, index) => (
            <Marker
              key={`${update.id}-${index}`}
              position={[
          update.location[1] + index * 0.0001, // Slightly offset each marker
          update.location[0] + index * 0.0001,
              ]}
            >
              <Popup>
          <b>Update {index + 1}:</b> {update.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <Button
        onClick={panToUserLocation}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go to My Location
      </Button>
      <div className="w-full max-w-3xl">
        <Modal />
      </div>
    </div>
  );
};

export default LiveMap;
function setQueryState(arg0: { trigger: boolean; location: number[] }) {
  throw new Error("Function not implemented.");
}
