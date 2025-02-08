"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import TravelMinimalBackground from "@/app/components/background";
import {
  Compass,
  Gift,
  MapPin,
  MessageCircle,
  Search,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  <Card className="w-64 shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 rounded-xl overflow-hidden dark:bg-gray-800 dark:text-gray-100">
    <CardContent className="p-4">
      <div className="relative w-full h-40 mb-4">
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl"
        />
      </div>
      <h3 className="font-bold text-lg mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-2 dark:text-gray-400">
        {expertise}
      </p>
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
            }`}
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
  <Card className="w-64 shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 rounded-xl overflow-hidden dark:bg-gray-800 dark:text-gray-100">
    <CardContent className="p-4 bg-gradient-to-br from-white to-blue-50 dark:from-gray-700 dark:to-gray-800">
      <p className="italic text-sm mb-2">"{text}"</p>
      <p className="text-right text-sm font-semibold">- {author}</p>
    </CardContent>
  </Card>
);

export default function Component() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-b ${
        darkMode ? "from-gray-900 to-gray-950" : "from-blue-50 to-white"
      } transition-colors duration-300`}
    >
      <TravelMinimalBackground />
      {/* Hero Section */}
      <section className="relative z-10 h-screen flex items-center justify-center overflow-hidden bg-fixed">
        <div className="absolute inset-0">
          <Image
            src="https://plus.unsplash.com/premium_photo-1673697239981-389164b7b87f?q=80&w=2044&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Travel destination"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-pulse drop-shadow-lg dark:text-white">
            Stay Connected to the Real World, Wherever You Go!
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto dark:text-gray-300">
            Real-time travel updates, personalized advice, and tips directly
            from locals.
          </p>
          <Button
            size="lg"
            onClick={() => Router.push("/querygen")}
            className="rounded-full text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-xl dark:bg-primary-dark dark:hover:bg-primary-dark/90"
          >
            Connect with Locals Now
          </Button>
        </div>
      </section>

      {/* Search Bar and Filters */}
      <section className="relative z-10 py-16 bg-blue-100 bg-opacity-70 dark:bg-gray-700 dark:bg-opacity-70">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search your destination..."
                className="w-full pl-10 pr-4 py-3 rounded-full text-lg shadow-lg focus:ring-2 focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary animate-bounce" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Button variant="outline">Weather</Button>
              <Button variant="outline">News</Button>
              <Button variant="outline">Safety</Button>
              <Button variant="outline">Travel Tips</Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-16 bg-blue-200 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-gray-100">
            How RealTrev Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Search Your Destination", icon: Search },
              { title: "Connect with Local Experts", icon: MessageCircle },
              { title: "Get Real-Time Updates & Tips", icon: Compass },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center p-4 bg-white/70 dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-lg transition transform hover:scale-105"
              >
                <div className="mb-4 inline-block p-4 bg-primary rounded-full text-white dark:bg-black dark:text-slate-100">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-black dark:text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Local Experts and Testimonials */}
      <section className="relative z-10 py-16 bg-blue-50 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-80">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center my-12 dark:text-gray-100">
            Traveler Testimonials
          </h2>
          <div className="flex overflow-x-auto pb-8 space-x-6 px-4">
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
            <TestimonialCard
              text="Exploring new places was a breeze with RealTrev's guidance."
              author="John D."
            />
            <TestimonialCard
              text="The local tips were spot on and made my trip unforgettable."
              author="Emily K."
            />
            <TestimonialCard
              text="I discovered hidden gems thanks to the local experts on RealTrev."
              author="Michael B."
            />
          </div>
        </div>
      </section>

      {/* Trev Coins Wallet */}
      <section className="relative py-16 bg-neutral-800 bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-90">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Trev Coins Wallet
          </h2>
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-bold dark:text-gray-100">
                250 Trev Coins
              </span>
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <p className="mb-4 dark:text-gray-300">
              Track your earned coins and redeem rewards!
            </p>
            <div className="mb-6">
              <h3 className="font-semibold mb-2 dark:text-gray-200">
                Progress to Next Reward
              </h3>
              <div className="bg-gray-200 dark:bg-gray-500 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: "60%" }}
                />
              </div>
              <p className="text-sm mt-2 dark:text-gray-400">
                150 coins to go for your next reward!
              </p>
            </div>
            <Button className="w-full hover:scale-105 transition dark:bg-primary-dark dark:text-white">
              Browse Rewards
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
