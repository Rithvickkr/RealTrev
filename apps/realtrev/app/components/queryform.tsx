"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Send, Loader2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {Button } from "@/components/ui/button";

import { AutoComplete } from 'primereact/autocomplete';
        
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";


export default function EnhancedTravelerQuerySubmission(Session: any) {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const handlocationchange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    console.log(location);
  
        if (location) {
            // Call Photon API for location suggestions
            const response = await fetch(
              `https://photon.komoot.io/api/?q=${location}&limit=5`
            );
            const data = await response.json();
            console.log(data);
      
            // Set suggestions from the API response
            setSuggestions(
              data.features.map((feature: { properties: { name: any; city: any; state: any } }) => {
                return `${feature.properties.name}, ${feature.properties.state}`;
              })
            );
            console.log(suggestions);
          }
          else
            {
                setSuggestions([]);
            }
        
  
    
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback("");

    try {
      // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(location);
        console.log(query);
        console.log(suggestions);
      

      // Simulating success (you'd replace this with actual API call)
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

  const isFormValid = location && query;

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
              <div className="space-y-2">
                <label
                  htmlFor="location-search"
                  className="block text-sm font-medium text-gray-700"
                >
                  Search for a location
                </label>
                <div className="relative">
                  {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="location-search"
                    placeholder="Enter a location..."
                    value={location}
                    onValueChange={setLocation}
                    className="pl-10"
                    required
                  /> */}
                  
                   <Input id="location-search" placeholder="Enter a location..." value={location} onChange={handlocationchange} />
                   
                    
                      {suggestions.length !== 0 ? (
                        <ScrollArea>
                            <Label>Locations</Label>
                            <li>
                          {suggestions.map((suggestion) => (
                            <ul    key={suggestion}>{suggestion} </ul>
                          ))}</li>
                        </ScrollArea>
                      ) : (
                        <h3>No suggestions</h3>
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
                  placeholder="Type your question here… e.g., What's the best local restaurant in the area?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                disabled={!isFormValid || isSubmitting}
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

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 opacity-10"
        >
          <MapPin className="absolute top-1/4 left-1/4 text-[#1E40AF] w-24 h-24" />
          <MapPin className="absolute top-3/4 right-1/4 text-[#F97316] w-16 h-16" />
          <MapPin className="absolute bottom-1/4 left-1/3 text-[#0D9488] w-20 h-20" />
        </motion.div>
      </div>
    </div>
  );
}
