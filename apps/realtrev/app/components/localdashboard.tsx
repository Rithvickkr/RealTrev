"use client"

import { useState, useEffect } from "react"
import { Bell, ChevronDown, Home, LogOut, Moon, Settings, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Query = {
  id: string
  travelerName: string
  question: string
  location: string
  queryLocation: string
}

export default function LocalGuideDashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [queries, setQueries] = useState<Query[]>([])
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null) // Store user's location
  const [cityName, setCityName] = useState<string | null>(null) // Store city name
  const [locationError, setLocationError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching initial queries
    setQueries([
      { id: "1", travelerName: "Alice", question: "Best local restaurants?", location: "Paris", queryLocation: "Eiffel Tower area" },
      { id: "2", travelerName: "Bob", question: "Hidden gems for sightseeing?", location: "Rome", queryLocation: "Colosseum vicinity" },
      { id: "3", travelerName: "Charlie", question: "Transportation tips?", location: "Tokyo", queryLocation: "Shibuya district" },
    ])

    // Simulate live updates
    const interval = setInterval(() => {
      const newQuery: Query = {
        id: Math.random().toString(36).substr(2, 9),
        travelerName: ["David", "Emma", "Frank", "Grace"][Math.floor(Math.random() * 4)] || "Unknown",
        question: ["Local cuisine recommendations?", "Best time to visit attractions?", "Cultural etiquette tips?"][Math.floor(Math.random() * 3)] || "No question provided",
        location: ["New York", "London", "Sydney", "Barcelona"][Math.floor(Math.random() * 4)] || "Unknown",
        queryLocation: ["Central Park", "Big Ben area", "Opera House vicinity", "La Rambla"][Math.floor(Math.random() * 4)] || "Unknown",
      }
      setQueries((prevQueries) => [...prevQueries, newQuery])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Request location when the component loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })
          fetchCityName(latitude, longitude) // Call function to get city name
        },
        (error) => {
          setLocationError("Location access denied. Please enable it in browser settings.")
        }
      )
    } else {
      setLocationError("Geolocation is not supported by your browser.")
    }
  }, [])

  // Function to fetch city name using OpenCage API
  const fetchCityName = async (latitude: number, longitude: number) => {
    const API_KEY = '37da08ae92ea44f386b963337c7b28b0' // Replace with your OpenCage API key
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`)
    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village
      setCityName(city || "Unknown Location")
    } else {
      setCityName("Unknown Location")
    }
  }

  const handleAccept = (id: string) => {
    setQueries((prevQueries) => prevQueries.filter((query) => query.id !== id))
  }

  const handleReject = (id: string) => {
    setQueries((prevQueries) => prevQueries.filter((query) => query.id !== id))
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="bg-gray-100 dark:bg-gray-800 w-64 hidden md:flex flex-col">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Travel Guide</h2>
        </div>
        <nav className="flex-1 px-4 py-4">
          <a href="#" className="flex items-center py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <User className="mr-3 h-5 w-5" />
            Profile
          </a>
          <a href="#" className="flex items-center py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <Bell className="mr-3 h-5 w-5" />
            My Queries
          </a>
          <a href="#" className="flex items-center py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome, Local Guide!</h1>
            <div className="flex items-center space-x-4">
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-gray-600"
              />
              {darkMode ? <Moon className="h-5 w-5 text-gray-300" /> : <Sun className="h-5 w-5 text-gray-600" />}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <img
                      src="/placeholder.svg?height=32&width=32"
                      alt="User avatar"
                      className="rounded-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Local Guide</p>
                      <p className="text-xs leading-none text-muted-foreground">guide@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Location-Based Queries</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {locationError ? locationError : cityName ? `Your location: ${cityName}` : "Fetching your location..."}
            </p>
            <div className="space-y-4">
              {queries.map((query) => (
                <div key={query.id} className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{query.travelerName}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{query.question}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Location: {query.location}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Query Location: {query.queryLocation}
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
  )
}
