"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  Home,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import getQuery from "../lib/actions/getquery";
import setResponseQ from "../lib/actions/setresponseq";

type Query = {
  id: string;
  travelerId: string;
  question: string;
  location: string;
  queryLocation: string;
  traveler: { name?: string } | null;
};

export default function LocalGuideDashboard({ session }: { session: any }) {
  const [darkMode, setDarkMode] = useState(false);
  const [queries, setQueries] = useState<Query[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const baseUrl = "https://api.opencagedata.com/geocode/v1/json";
  const ApiKey = process.env.API_KEY || "";

  const router = useRouter();

  // Haversine formula to calculate distance
  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          fetchCityName(latitude, longitude);
        },
        () => {
          setLocationError(
            "Location access denied. Please enable it in browser settings."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      const fetchData = async () => {
        try {
          const fetchedQueries = await getQuery(
            userLocation.latitude,
            userLocation.longitude,
            10
          );

          if (Array.isArray(fetchedQueries)) {
            const mappedQueries: Query[] = fetchedQueries
              .filter(
                (query) =>
                  query &&
                  query.id &&
                  query.location &&
                  query.traveler // Ensure valid data
              )
              .map((query) => ({
                id: query.id,
                travelerId: query.travelerId || "Unknown",
                question: query.queryText || "No question provided",
                location: query.location.name || "Unknown Location",
                queryLocation: `${query.location.latitude || 0}, ${
                  query.location.longitude || 0
                }`,
                traveler: query.traveler,
              }));

            setQueries(mappedQueries);
          } else {
            console.error("Invalid data format from getQuery:", fetchedQueries);
          }
        } catch (error) {
          console.error("Error fetching queries:", error);
        }
      };

      fetchData();
    }
  }, [userLocation]);

  const fetchCityName = async (latitude: number, longitude: number) => {
    const API_KEY = "37da08ae92ea44f386b963337c7b28b0"; // Replace with your OpenCage API key
    try {
      const response = await fetch(
        `${baseUrl}?q=${latitude}+${longitude}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.results?.length > 0) {
        const city =
          data.results[0].components.city ||
          data.results[0].components.town ||
          data.results[0].components.village;
        setCityName(city || "Unknown Location");
      } else {
        setCityName("Unknown Location");
      }
    } catch (error) {
      console.error("Error fetching city name:", error);
      setCityName("Unknown Location");
    }
  };

  const handleAccept = async (id: string) => {
    if (!session) {
      return;
    }

    try {
      const isAccepted = await setResponseQ(session, id);
      if (isAccepted) {
        alert("Query accepted successfully!");
        setQueries((prevQueries) =>
          prevQueries.filter((query) => query.id !== id)
        );
        router.push(`/chatpage/${id}`);
      }
    } catch (error) {
      console.error("Error accepting query:", error);
    }
  };

  const handleReject = (id: string) => {
    setQueries((prevQueries) => prevQueries.filter((query) => query.id !== id));
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="bg-gray-100 dark:bg-gray-800 w-64 hidden md:flex flex-col">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Travel Guide
          </h2>
        </div>
        <nav className="flex-1 px-4 py-4">
          <a
            href="#"
            className="flex items-center py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-900 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome, Local Guide!
            </h1>
          </div>
        </header>

        <main className="flex-1 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Location-Based Queries
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {locationError
                ? locationError
                : cityName
                ? `Your location: ${cityName}`
                : "Fetching your location..."}
            </p>
            <div className="space-y-4">
              {queries.map((query) => (
                <div
                  key={query.id}
                  className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md"
                >
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {query.traveler?.name || "Traveler"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {query.question}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Location: {query.location}
                    </p>
                  </div>
                  <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between">
                    <button
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-500"
                      onClick={() => handleAccept(query.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500"
                      onClick={() => handleReject(query.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
