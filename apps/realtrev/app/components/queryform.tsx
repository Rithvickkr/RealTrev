"use client";

import { useState, useEffect, useRef, SetStateAction } from "react";
import { motion } from "framer-motion";
import { MapPin, Send, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import axios from "axios";
import submitQuery from "../lib/actions/querysubmit";
import { useSession } from "next-auth/react";
import TravelMinimalBackground from "./background";
import { Toast } from "primereact/toast";

export default function EnhancedTravelerQuerySubmission() {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);
  const baseUrl = "https://api.opencagedata.com/geocode/v1/json";
  const Apikey = "37da08ae92ea44f386b963337c7b28b0";
  const Session = useSession();

  const handleLocationChange = async (e: { target: { value: any } }) => {
    const newLocation = e.target.value;
    setLocation(newLocation);

    if (newLocation) {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${newLocation}&limit=5`
      );
      const data = await response.json();
      setSuggestions(
        data.features.map(
          (feature: { properties: { name: any; state: any } }) =>
            `${feature.properties.name}, ${feature.properties.state}`
        )
      );
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SetStateAction<string>) => {
    setLocation(suggestion);
    setShowSuggestions(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionBoxRef.current &&
      !suggestionBoxRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function getLocationCoordinates(
    locationName: string
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const response = await axios.get(baseUrl, {
        params: {
          q: locationName,
          key: Apikey,
          no_annotations: 1,
          language: "en",
        },
      });

      const results = response.data.results;

      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location coordinates:", error);
      throw error;
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback("");
    const res = await getLocationCoordinates(location);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await submitQuery(
        (Session.data?.user as { id: string }).id,
        location,
        query,
        res.latitude,
        res.longitude
      );
      setFeedback("Query submitted successfully! A local will respond soon.");
    } catch (error) {
      console.error("Error submitting query:", error);
      setFeedback(
        "An error occurred while submitting your query. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative dark:bg-gray-900">
      <TravelMinimalBackground />

      <div className="min-h-screen flex items-center justify-center bg-[#FEF3C7] dark:bg-gray-800 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-700 shadow-xl">
            <CardContent className="p-6 sm:p-10">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl sm:text-4xl font-bold text-center text-black dark:text-white mb-2"
              >
                Submit Your Query to Locals
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-center text-gray-600 dark:text-gray-300 mb-8"
              >
                Get real-time information from locals
              </motion.p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="location-search"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Search for a location
                  </label>
                  <div className="relative">
                    <Input
                      id="location-search"
                      placeholder="Enter a location..."
                      value={location}
                      onChange={handleLocationChange}
                      onFocus={() => location && setShowSuggestions(true)}
                      className="dark:bg-gray-800 dark:text-white"
                    />
                    <Label className="dark:text-gray-300">Locations</Label>

                    {showSuggestions && (
                      <ScrollArea ref={suggestionBoxRef}>
                        <div className="border border-gray-200 dark:border-gray-600 rounded shadow-sm text-sm dark:bg-gray-800 dark:text-white">
                          {suggestions.length > 0 ? (
                            suggestions.map((suggestion) => (
                              <div
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                                key={suggestion}
                              >
                                {suggestion}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500 dark:text-gray-400">
                              No suggestions found
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="query"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Your Query
                  </label>
                  <Textarea
                    id="query"
                    placeholder="Type your question here…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-[100px] dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-black text-white transition-all duration-200 ease-in-out transform hover:scale-105 dark:bg-gray-700 dark:hover:bg-gray-600"
                  disabled={!location || !query || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting your query...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4 " />
                      Submit Query
                    </>
                  )}
                </Button>

                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-[#0D9488] font-medium dark:text-[#0D9488]"
                  >
                    {feedback}
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
