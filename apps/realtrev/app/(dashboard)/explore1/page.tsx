"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { animated, config, useSpring } from "@react-spring/web";
import React, { useEffect, useRef, useState } from "react";

import TravelMinimalBackground from "@/app/components/background";
import LiveMap from "@/app/components/map";
import handleReaction from "@/app/lib/actions/addlikeordislike";
import { fetchUpdates } from "@/app/lib/actions/fetchupdates";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { darkModeState } from "@/recoil/darkmodeatom";
import { Severity } from "@prisma/client";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  MapPin,
  Search,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRecoilState } from "recoil";

export default function ExplorePage() {
  const [activeUpdate, setActiveUpdate] = useState<Update | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isMapView, setIsMapView] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isDarkMode, setIsDarkMode] = useRecoilState(darkModeState);
  const { data: session } = useSession();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const mapInstance = useRef<any>(null);

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

  useEffect(() => {
    const fetchAndSetUpdates = async () => {
      setLoading(true);
      const [latitude, longitude] = userLocation;
      const updates = await fetchUpdates({ latitude, longitude });
      setUpdates(updates as Update[]);
      if (Array.isArray(updates)) {
        setLikes(
          updates.reduce((acc, update) => acc + Number(update.likes), Number(0))
        );
        setDislikes(
          updates.reduce(
            (acc, update) => acc + Number(update.dislikes),
            Number(0)
          )
        );
      }
      setLoading(false);
      console.log(updates);
    };
    fetchAndSetUpdates();
  }, [userLocation]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const mapAnimation = useSpring({
    width: isSmallScreen
      ? isMapView
        ? "100%"
        : "0%"
      : isMapOpen
      ? "60%"
      : "0%",
    opacity: isSmallScreen ? (isMapView ? 1 : 0) : isMapOpen ? 1 : 0,
    config: config.gentle,
  });

  const feedAnimation = useSpring({
    width: isSmallScreen
      ? isMapView
        ? "0%"
        : "100%"
      : isMapOpen
      ? "40%"
      : "100%",
    opacity: isSmallScreen ? (isMapView ? 0 : 1) : 1,
    config: config.gentle,
  });

  const filteredUpdates = updates.filter(
    (update) =>
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeFilter === "all" || update.type === activeFilter)
  );

  const toggleView = () => {
    if (isSmallScreen) {
      setIsMapView(!isMapView);
    } else {
      setIsMapOpen(!isMapOpen);
    }
  };
   
  const panToQuery = (query: string): void => {
    if (mapInstance.current) {
      mapInstance.current.flyTo([26.8467, 80.9462], 14, {
        animate: true,
        duration: 1.5, // Duration of the animation in seconds
      });
      console.log("Panned to user location with animation");
    } else {
      console.log("Map instance not available", mapInstance.current);
    }
  };
  return (
    <div>
      <TravelMinimalBackground />
      <div className={` relative flex flex-col h-screen `}>
        <div className="flex justify-end p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
        <div className="flex-1 flex overflow-hidden border-rounded-lg">
          <animated.div
            style={mapAnimation}
            className="bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
          >
            <LiveMap />
          </animated.div>

          <animated.div
            style={feedAnimation}
            className="bg-white dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-20 overflow-hidden flex flex-col border-l border-gray-200 dark:border-gray-700"
          >
            <div className=" flex-grow overflow-y-auto">
              <div className="h-full flex flex-col p-4">
                <Card className="mb-4 dark:bg-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Search className="text-gray-400 dark:text-gray-300 flex-shrink-0" />
                      <Input
                        type="text"
                        placeholder="Search locations or updates"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow dark:bg-gray-600 dark:text-gray-300"
                      />

                      <div className="flex justify-between items-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="dark:bg-gray-600 dark:text-gray-300"
                            >
                              <Filter className="mr-2 h-4 w-4" /> Filters
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="dark:bg-gray-700 dark:text-gray-300">
                            <DropdownMenuItem
                              onSelect={() => setActiveFilter("all")}
                            >
                              All
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => setActiveFilter("alert")}
                            >
                              Alerts
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => setActiveFilter("recommendation")}
                            >
                              Recommendations
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsLive(!isLive)}
                              className={`${
                                isLive
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              <Zap
                                className={`h-4 w-4 ${
                                  isLive
                                    ? "text-white"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="dark:bg-gray-700 dark:text-gray-300">
                            <p>
                              {isLive
                                ? "Live updates on"
                                : "Live updates off"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleView}
                        className="dark:bg-gray-600 dark:text-gray-300"
                      >
                        {isSmallScreen ? (
                          isMapView ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )
                        ) : isMapOpen ? (
                          <ChevronLeft className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {loading ? (
                  <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-900">
                    <ProgressSpinner className="h-12 w-12 text-gray-500 dark:text-gray-300" />
                    <p className="text-gray-500 dark:text-gray-300 mt-4">
                      Loading updates...
                    </p>
                  </div>
                ) : (
                  <Tabs defaultValue="recent" className="flex-grow flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mb-4 dark:bg-gray-700">
                      <TabsTrigger value="recent" className="dark:text-gray-300">
                        <Clock className="mr-2 h-4 w-4" />
                        Recent
                      </TabsTrigger>
                      <TabsTrigger
                        value="trending"
                        className="dark:text-gray-300"
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Trending
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value="recent"
                      className="flex-grow overflow-y-auto"
                    >
                      {filteredUpdates ? (
                        filteredUpdates.map((update) => (
                          <UpdateCard
                            key={update.id}
                            update={update}
                            setActiveUpdate={setActiveUpdate}
                            sessionId={session?.user.id}
                            likes={Number(likes)}
                            dislikes={Number(dislikes)}
                            setLikes={setLikes}
                            setDislikes={setDislikes}
                          />
                        ))
                      ) : (
                        <p>No updates found</p>
                      )}
                    </TabsContent>
                    <TabsContent
                      value="trending"
                      className="flex-grow overflow-y-auto"
                    >
                      {[...filteredUpdates].map((update) => (
                        <UpdateCard
                          key={update.id}
                          update={update}
                          setActiveUpdate={setActiveUpdate}
                          sessionId={session?.user.id}
                          likes={Number(likes)}
                          dislikes={Number(dislikes)}
                          setLikes={setLikes}
                          setDislikes={setDislikes}
                        />
                      ))}
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          </animated.div>
        </div>
        <div className="flex justify-between items-center">
          {isMapView ? (
            <Button
              className="fixed top-24 right-5 rounded-full shadow-lg z-50 dark:bg-gray-600 dark:text-gray-300"
              variant="outline"
              size="icon"
              onClick={toggleView}
            >
              {isSmallScreen ? (
                isMapView ? (
                  <X className="h-4 w-4" />
                ) : null
              ) : isMapOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface Update {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: Severity;
  likes: number;
  dislikes: number;
}

function UpdateCard({
  update,
  setActiveUpdate,
  sessionId,
  likes,
  dislikes,
  setLikes,
  setDislikes,
}: {
  update: Update;
  setActiveUpdate: React.Dispatch<React.SetStateAction<Update | null>>;
  sessionId: any;
  likes: Number;
  dislikes: Number;
  setLikes: any;
  setDislikes: any;
}) {
  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-300 dark:bg-gray-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold dark:text-gray-300">{update.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {update.timestamp.toString()}
            </p>
          </div>
          <Badge
            variant={update.type === "HIGH" ? "destructive" : "secondary"}
            className="dark:bg-gray-600 dark:text-gray-300"
          >
            {update.type === "HIGH" ? (
              <AlertTriangle className="mr-1 h-3 w-3" />
            ) : (
              <MapPin className="mr-1 h-3 w-3" />
            )}
            {update.type}
          </Badge>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="dark:text-gray-300"
              onClick={() => {
                handleReaction({
                  updateId: update.id,
                  userId: sessionId,
                  type: "like",
                });
                setLikes(Number(likes) + 1);
              }}
            >
              <ThumbsUp className="mr-1 h-4 w-4" />
              {likes.toString()}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="dark:text-gray-300"
              onClick={() => {
                handleReaction({
                  updateId: update.id,
                  userId: sessionId,
                  type: "dislike",
                });
                setDislikes(Number(dislikes) + 1);
              }}
            >
              <ThumbsDown className="mr-1 h-4 w-4" />
              {dislikes.toString()}
            </Button>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveUpdate(update)}
                  className="dark:bg-gray-600 dark:text-gray-300"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View on Map
                </Button>
              </TooltipTrigger>
              <TooltipContent className="dark:bg-gray-700 dark:text-gray-300">
                <p>Show this update on the map</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
