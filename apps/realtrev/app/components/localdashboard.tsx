"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import getQuery from "../lib/actions/getquery";
import setResponseQ from "../lib/actions/setresponseq";
import getUserAcceptedAndResolvedQueries from "../lib/actions/useraccptedquery";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/components/ui/button";
import { LucideMenu } from "lucide-react";
import { ProgressSpinner } from "primereact/progressspinner";
import TravelMinimalBackground from "./background";
import { useRecoilState } from "recoil";
import { mapQueryState } from "@/recoil/mapTriggeratom";
type Query = {
  id: string;
  travelerId: string;
  question: string;
  location: string;
  queryLocation: string;
  traveler: { name?: string } | null;
  status: "Pending" | "Resolved" | "Accepted";
  userId?: string | null;
};

export default function LocalGuideDashboard({ session }: { session: any }) {
  const [darkMode, setDarkMode] = useState(false);
  const [queries, setQueries] = useState<Query[]>([]);
  const [resolvedQueries, setResolvedQueries] = useState<Query[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [view, setView] = useState<"nearby" | "accepted" | "resolved">(
    "nearby"
  );
  const [loading, setLoading] = useState(true); // Add loading state
  const baseUrl = "https://api.opencagedata.com/geocode/v1/json";
  const ApiKey = process.env.API_KEY || "";

  const router = useRouter();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const [mapQuery,setmapQuery] = useRecoilState(mapQueryState);

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
        setLoading(true);
        try {
          const fetchedQueries = await getQuery(
            userLocation.latitude,
            userLocation.longitude,
            10,
            session.user.id
          );
          const fetchedAcceptedQueries =
            await getUserAcceptedAndResolvedQueries(session.user.id);

          if (Array.isArray(fetchedQueries)) {
            const mappedQueries: Query[] = fetchedQueries
              .filter(
                (query) => query && query.id && query.location && query.traveler
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
                status:
                  query.status === "PENDING"
                    ? "Pending"
                    : query.status === "ACCEPTED"
                      ? "Accepted"
                      : "Resolved",
                userId: query.responderId,
              }));

            setQueries(mappedQueries);
            const mappedAcceptedQueries: Query[] = fetchedAcceptedQueries.map(
              (query:any) => ({   
                id: query.id,
                travelerId: query.travelerId || "Unknown",
                question: query.queryText || "No question provided",
                location: query.location.name || "Unknown Location",
                queryLocation: `${query.location.latitude || 0}, ${
                  query.location.longitude || 0
                }`,
                traveler: query.traveler,
                status:
                  query.status === "PENDING"  
                    ? "Pending"  
                    : query.status === "ACCEPTED"
                      ? "Accepted"
                      : "Resolved",
                userId: query.responderId,
              })
            );
            setResolvedQueries(mappedAcceptedQueries);
            console.log(mappedAcceptedQueries);
            console.log(mappedQueries);
          } else {
            console.error("Invalid data format from getQuery:", fetchedQueries);
          }
        } catch (error) {
          console.error("Error fetching queries:", error);
        } finally {
          setLoading(false);
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
          prevQueries.map((query) =>
            query.id === id
              ? { ...query, status: "Accepted", userId: session.user.id }
              : query
          )
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

  const filteredQueries =
    view === "nearby"
      ? queries.filter((query) => query.status === "Pending")
      : view === "accepted"
        ? resolvedQueries.filter((query) => query.status === "Accepted")
        : resolvedQueries.filter((query) => query.status === "Resolved");

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${darkMode ? "dark: dark:bg-gray-900 dark:text-gray-100" : ""}`}
    >
      {!isSmallScreen && (
        <motion.aside
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-full md:w-64 bg-gray-800 text-white dark:bg-gray-900 dark:text-gray-100"
        >
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <nav className="mt-10">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setView("nearby")}
                    className={`block py-2 px-4 rounded-md w-full text-left ${
                      view === "nearby" ? "bg-gray-700" : "hover:bg-gray-700"
                    }`}
                  >
                    Nearby Queries
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setView("accepted")}
                    className={`block py-2 px-4 rounded-md w-full text-left ${
                      view === "accepted" ? "bg-gray-700" : "hover:bg-gray-700"
                    }`}
                  >
                    Accepted Queries
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setView("resolved")}
                    className={`block py-2 px-4 rounded-md w-full text-left ${
                      view === "resolved" ? "bg-gray-700" : "hover:bg-gray-700"
                    }`}
                  >
                    Resolved Queries
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </motion.aside>
      )}
      <div className="  flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-900 shadow-sm  mt-10">
          <TravelMinimalBackground />
        </header>
        <div className=" relative max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-center items-center space-x-5">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mt-10">
            Welcome,{session.user.name}!
          </h1>
          {isSmallScreen && (
            <Sheet>
              <SheetTrigger>
                <Button
                  className={`bg-gray-800 text-white mt-10 ${isSmallScreen ? "text-sm py-2 px-4" : "text-lg py-3 px-6"}`}
                >
                  <LucideMenu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={"left"}>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
                  <nav className="mt-10">
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => setView("nearby")}
                          className={`block py-2 px-4 rounded-md w-full text-left ${
                            view === "nearby"
                              ? "bg-gray-700"
                              : "hover:bg-gray-700"
                          }`}
                        >
                          Nearby Queries
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setView("accepted")}
                          className={`block py-2 px-4 rounded-md w-full text-left ${
                            view === "accepted"
                              ? "bg-gray-700"
                              : "hover:bg-gray-700"
                          }`}
                        >
                          Accepted Queries
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setView("resolved")}
                          className={`block py-2 px-4 rounded-md w-full text-left ${
                            view === "resolved"
                              ? "bg-gray-700"
                              : "hover:bg-gray-700"
                          }`}
                        >
                          Resolved Queries
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        <main className="  flex-1 bg-gray-100 dark:bg-gray-900">
          <div className="   relative max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
            {loading ? (
              <div className="flex justify-center items-center size-auto ">
                <ProgressSpinner />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQueries.length === 0 ? (
                  <p className="text-gray-700 dark:text-gray-300">
                    No queries available right now.
                  </p>
                ) : (
                  filteredQueries.map((query) => (
                    <motion.div
                      key={query.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md transition-transform transform hover:scale-105"
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
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Status: {query.status}
                        </p>
                        {query.status === "Resolved" && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            RESOLVED
                          </span>
                        )}
                      </div>
                      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between">
                        {query.status === "Pending" && (
                          <>
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
                          </>
                        )}
                        {query.status === "Accepted" && (
                          <button
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-500"
                            onClick={() => router.push(`/chatpage/${query.id}`)}
                          >
                            Open Chat
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
