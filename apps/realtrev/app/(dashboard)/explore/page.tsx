"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Camera,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// Leaflet CSS import (you'll need to add this to your project)
import "leaflet/dist/leaflet.css";

export default function ExplorePage() {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [currentSpotlight, setCurrentSpotlight] = useState(0);

  const locations: {
    name: string;
    position: [number, number];
    fact: string;
  }[] = [
    {
      name: "Manali",
      position: [32.2432, 77.1892],
      fact: "Known for adventure sports and scenic beauty",
    },
    {
      name: "Goa",
      position: [15.2993, 74.124],
      fact: "Famous for its beaches and vibrant nightlife",
    },
    {
      name: "Jaipur",
      position: [26.9124, 75.7873],
      fact: "The Pink City with rich history and culture",
    },
  ];

  const localInsights = [
    {
      title: "Hidden Waterfall Trek",
      image: "https://picsum.photos/seed/{1}picsum/400/300",
      description: "Discover a secret waterfall just outside Manali!",
    },
    {
      title: "Beachside Yoga Retreat",
      image: "https://picsum.photos/seed/{2}picsum/400/300",
      description: "Join locals for sunrise yoga on Goa's beautiful beaches.",
    },
    {
      title: "Royal Palace Tour",
      image: "https://picsum.photos/seed/{3}picsum/400/300",
      description: "Explore Jaipur's majestic palaces with a local historian.",
    },
  ];

  const communitySpotlights = [
    {
      name: "Priya",
      location: "Manali",
      avatar: "https://picsum.photos/seed/{seed}picsum/100",
      bio: "Adventure enthusiast and nature lover",
      story: "I love showing visitors the hidden gems of Manali's mountains!",
    },
    {
      name: "Rahul",
      location: "Goa",
      avatar: "https://picsum.photos/seed/{seed}picsum/100",
      bio: "Surf instructor and beach cleanup organizer",
      story:
        "Let me teach you to ride the waves and protect our beautiful coastline!",
    },
    {
      name: "Anita",
      location: "Jaipur",
      avatar: "https://picsum.photos/seed/{seed}picsum/100",
      bio: "Local food expert and cooking class host",
      story:
        "Experience the flavors of Rajasthan in my traditional cooking classes!",
    },
  ];

  const userContent = [
    {
      image:
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
      location: "Manali",
    },
    { image: "https://picsum.photos/seed/picsum/200", location: "Goa" },
    { image: "https://picsum.photos/seed/picsum/200", location: "Jaipur" },
    { image: "https://picsum.photos/seed/picsum/200", location: "Manali" },
    { image: "https://picsum.photos/seed/picsum/200", location: "Goa" },
    { image: "https://picsum.photos/seed/picsum/200", location: "Jaipur" },
  ];

  // Custom icon for map markers
  const customIcon = new L.Icon({
    iconUrl: "https://picsum.photos/seed/{seed}picsum/400/300",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  useEffect(() => {
    // This effect is needed to properly load Leaflet in Next.js
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/placeholder.svg?height=82&width=50",
      iconUrl: "/placeholder.svg?height=41&width=25",
      shadowUrl: "/placeholder.svg?height=41&width=41",
    });
  }, []);

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
         
          {/* <motion.img
            src="/placeholder.svg?height=100&width=300"
            alt="RealTrev Logo"
            className="mx-auto mb-8 w-48 sm:w-64 md:w-80"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          /> */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            REALTREV
            <br></br>
            Connect with Locals for Real-Time Adventures!
          </motion.h1>
          <motion.div
            className="max-w-md mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Search for a destination"
                className="flex-grow bg-white text-gray-800"
              />
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-teal-700">
            Explore Destinations
          </h2>
          <div className="h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={location.position}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{location.name}</h3>
                      <p>{location.fact}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* Featured Local Insights */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-orange-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-teal-700">
            Featured Local Insights
          </h2>
          <div className="relative">
            <motion.div
              key={currentInsight}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-xl p-4 sm:p-6"
            >
              <div className="flex flex-col md:flex-row items-center">
                <img
                  src={localInsights[currentInsight]?.image}
                  alt={localInsights[currentInsight]?.title}
                  className="w-full md:w-1/2 h-48 sm:h-64 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-orange-600">
                    {localInsights[currentInsight]?.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {localInsights[currentInsight]?.description}
                  </p>
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                    Learn More
                  </Button>
                </div>
              </div>
            </motion.div>
            <button
              onClick={() =>
                setCurrentInsight(
                  (prev) =>
                    (prev - 1 + localInsights.length) % localInsights.length
                )
              }
              className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-orange-500 hover:text-orange-700 transition-colors duration-300"
            >
              <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={() =>
                setCurrentInsight((prev) => (prev + 1) % localInsights.length)
              }
              className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-orange-500 hover:text-orange-700 transition-colors duration-300"
            >
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Community Spotlights */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-teal-700">
            Community Spotlights
          </h2>
          <div className="relative">
            <motion.div
              key={currentSpotlight}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-xl p-4 sm:p-6"
            >
              <div className="flex flex-col md:flex-row items-center">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mb-4 md:mb-0 md:mr-6">
                  <AvatarImage
                    src={communitySpotlights[currentSpotlight]?.avatar}
                    alt={communitySpotlights[currentSpotlight]?.name}
                  />
                  <AvatarFallback>
                    {communitySpotlights[currentSpotlight]?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-orange-600">
                    {communitySpotlights[currentSpotlight]?.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {communitySpotlights[currentSpotlight]?.location} |{" "}
                    {communitySpotlights[currentSpotlight]?.bio}
                  </p>
                  <p className="text-gray-800 mb-4">
                    "{communitySpotlights[currentSpotlight]?.story}"
                  </p>
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                    Connect
                  </Button>
                </div>
              </div>
            </motion.div>
            <button
              onClick={() =>
                setCurrentSpotlight(
                  (prev) =>
                    (prev - 1 + communitySpotlights.length) %
                    communitySpotlights.length
                )
              }
              className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-orange-500 hover:text-orange-700 transition-colors duration-300"
            >
              <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={() =>
                setCurrentSpotlight(
                  (prev) => (prev + 1) % communitySpotlights.length
                )
              }
              className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-orange-500 hover:text-orange-700 transition-colors duration-300"
            >
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* User-Generated Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-yellow-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-teal-700">
            Traveler Moments
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {userContent.map((content, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={content.image}
                      alt={`User content from ${content.location}`}
                      className="w-full h-32 sm:h-40 object-cover"
                    />
                    <div className="p-2 bg-white">
                      <p className="text-xs sm:text-sm text-gray-600">
                        {content.location}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Share your adventures with #RealTrevMoments for a chance to be
              featured!
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Camera className="h-4 w-4 mr-2" />
              Share Your Moment
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-lg sm:text-xl mb-8">
            Sign up now and get your first chat with a local guide for free!
          </p>
          <Button
            size="lg"
            className="bg-yellow-400 hover:bg-yellow-500 text-teal-800 text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3"
          >
            Start Exploring Now
          </Button>
          <p className="mt-4 text-xs sm:text-sm">
            Download our app for exclusive local tips and real-time updates.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About RealTrev</h3>
            <p className="text-gray-300 text-sm">
              Connecting travelers with locals for authentic experiences and
              real-time insights.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Explore
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Safety Tips
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Travel Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Community Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for travel tips and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-grow bg-gray-700 text-white border-gray-600"
              />
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Subscribe
              </Button>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300 text-sm">
            &copy; 2024 RealTrev. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
