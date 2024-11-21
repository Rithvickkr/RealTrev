"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  Moon,
  Sun,
  Menu,
  X,
  Search,
  MapPin,
  Home,
  Compass,
  MessageCircle,
  User,
  ChevronDown,
  Star,
  Gift,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Globe } from "@/components/ui/globe";

interface LocalExpertCardProps {
  name: string;
  expertise: string;
  rating: number;
  image: string;
}

const LocalExpertCard = ({
  name,
  expertise,
  rating,
  image,
}: LocalExpertCardProps) => (
  <Card className="w-64 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardContent className="p-4">
      <div className="relative w-full h-40 mb-4">
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <h3 className="font-bold text-lg mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-2">{expertise}</p>
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
      <Button className="w-full" variant="outline">
        Chat with {name}
      </Button>
    </CardContent>
  </Card>
);

interface TestimonialCardProps {
  text: string;
  author: string;
}

const TestimonialCard = ({ text, author }: TestimonialCardProps) => (
  <Card className="w-64 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardContent className="p-4">
      <p className="italic text-sm mb-2">"{text}"</p>
      <p className="text-right text-sm font-semibold">- {author}</p>
    </CardContent>
  </Card>
);

export default function Component() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${darkMode ? "from-gray-900 to-gray-800" : "from-sky-100 to-white"} transition-colors duration-300`}
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0">
        <Image src="/placeholder.svg?height=1080&width=1920" alt="Travel destination" layout="fill" objectFit="cover" priority />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-pulse">
            Stay Connected to the Real World, Wherever You Go!
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Real-time travel updates, personalized advice, and tips directly
            from locals.
          </p>
          <Button
            size="lg"
            className="rounded-full text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
          >
            Connect with Locals Now
          </Button>
        </div>
      </section>

      {/* Search Bar and Filters */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search your destination..."
                className="w-full pl-10 pr-4 py-3 rounded-full text-lg shadow-lg focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary animate-pulse" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline">Weather</Button>
              <Button variant="outline">News</Button>
              <Button variant="outline">Safety</Button>
              <Button variant="outline">Travel Tips</Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-700">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How RealTrev Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Search Your Destination", icon: Search },
              { title: "Connect with Local Experts", icon: MessageCircle },
              { title: "Get Real-Time Updates & Tips", icon: Compass },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 inline-block p-4 bg-primary rounded-full text-white">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Local Experts and Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Local Experts
          </h2>
          <div className="flex overflow-x-auto pb-8 space-x-6">
            <LocalExpertCard
              name="John Doe"
              expertise="City Explorer"
              rating={4}
              image="/placeholder.svg?height=200&width=200"
            />
            <LocalExpertCard
              name="Jane Smith"
              expertise="Food Connoisseur"
              rating={5}
              image="/placeholder.svg?height=200&width=200"
            />
            <LocalExpertCard
              name="Mike Johnson"
              expertise="Adventure Guide"
              rating={4}
              image="/placeholder.svg?height=200&width=200"
            />
            <LocalExpertCard
              name="Emily Brown"
              expertise="Cultural Expert"
              rating={5}
              image="/placeholder.svg?height=200&width=200"
            />
          </div>
          <h2 className="text-3xl font-bold text-center my-12">
            Traveler Testimonials
          </h2>
          <div className="flex overflow-x-auto pb-8 space-x-6">
            <TestimonialCard
              text="RealTrev made my trip so much more enjoyable! The local insights were invaluable."
              author="Sarah T."
            />
            <TestimonialCard
              text="I felt like I had a friend in every city thanks to RealTrev's local experts."
              author="Mark R."
            />
            <TestimonialCard
              text="The real-time updates saved me from a potential travel disaster. Highly recommended!"
              author="Lisa M."
            />
          </div>
        </div>
      </section>

      {/* Trev Coins Wallet */}
      <section className="py-16 bg-gray-100 dark:bg-gray-700">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trev Coins Wallet
          </h2>
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-bold">250 Trev Coins</span>
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <p className="mb-4">Track your earned coins and redeem rewards!</p>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Progress to Next Reward</h3>
              <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-primary h-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <p className="text-sm mt-2">
                150 coins to go for your next reward!
              </p>
            </div>
            <Button className="w-full">Browse Rewards</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">RealTrev</h3>
              <p className="text-sm text-gray-400">
                Connecting travelers with local experts for real-time updates
                and personalized advice.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
              <form className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                />
                <Button type="submit" className="w-full">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} RealTrev. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
