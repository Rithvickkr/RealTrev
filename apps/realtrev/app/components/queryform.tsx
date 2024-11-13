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

export default function EnhancedTravelerQuerySubmission(Session: any) {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  const handleLocationChange = async (e: { target: { value: any; }; }) => {
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

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
    <div className="min-h-screen flex items-center justify-center bg-[#FEF3C7] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl">
          <CardContent className="p-6 sm:p-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-center text-[#1E40AF] mb-2"
            >
              Submit Your Query to Locals
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center text-gray-600 mb-8"
            >
              Get real-time information from locals
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Suggestion Section */}
              <div className="space-y-2">
                <label
                  htmlFor="location-search"
                  className="block text-sm font-medium text-gray-700"
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
                  />
                  <Label>Locations</Label>

                  {showSuggestions && (
                    <ScrollArea ref={suggestionBoxRef}>
                      <div className="border border-gray-200 rounded shadow-sm text-sm">
                        {suggestions.length > 0 ? (
                          suggestions.map((suggestion) => (
                            <div
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSuggestionClick(suggestion)}
                              key={suggestion}
                            >
                              {suggestion}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-gray-500">
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
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Query
                </label>
                <Textarea
                  id="query"
                  placeholder="Type your question here…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                disabled={!location || !query || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting your query...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Query
                  </>
                )}
              </Button>

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-[#0D9488] font-medium"
                >
                  {feedback}
                </motion.div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
