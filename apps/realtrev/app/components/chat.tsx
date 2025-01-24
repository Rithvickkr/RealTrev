"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MapPin,
  Compass,
  Sun,
  Moon,
  Smile,
  ChevronDown,
  Camera,
  Paperclip,
  ImageIcon,
  StarIcon,
  User,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useRouter, useParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import knowTheQuery from "@/app/lib/actions/knowthequery";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { rateAndResolveQuery } from "../lib/actions/queryreview";

import { Textarea } from "@/components/ui/textarea";
import TravelMinimalBackground from "./background";

interface infoQ {
  id: string;
  responder: { name: string };
  traveler: { name: string };
  location: { name: string };
}

export default function TravelChatPage(session: any) {
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [rating, setRating] = useState<number>(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [markResolved, setMarkResolved] = useState(false);
;

  const [infoQ, setInfoQ] = useState<infoQ>();
  const [feedback, setFeedback] = useState("");

  const params = useParams();
  const router = useRouter();
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const [id, setId] = useState<string | undefined>(() =>
    Array.isArray(params?.queryid) ? params.queryid[0] : params?.queryid
  );
  const [messages, setMessages] = useState<
    { message: string; senderId: string; time: Date }[]
  >([]);
  const [input, setInput] = useState("");
  console.error(session.session.user.id);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const aboutquery = async () => {
      if (id) {
        const infoQ = await knowTheQuery(id);
        setInfoQ({
          id: id,
          responder: infoQ?.responder
            ? { name: infoQ.responder.name }
            : { name: "" },
          traveler: infoQ?.traveler
            ? { name: infoQ.traveler.name }
            : { name: "" },
          location: infoQ?.location
            ? { name: infoQ.location.name }
            : { name: "" },
        });
      } else {
        console.error("ID is undefined!");
      }
    };
    aboutquery();
    if (!params?.queryid) {
      console.error("Query ID is missing!");
      router.push("/error");
      return;
    }

    const queryId = Array.isArray(params.queryid)
      ? params.queryid[0]
      : params.queryid;
    setId(queryId);
    console.log("Connecting to socket with Query ID:", queryId);

    // Initialize socket connection
    const socket = io("http://localhost:3002"); // Replace with your backend URL
    socketRef.current = socket;

    socket.emit("joinRoom", { queryid: queryId });
    console.log("Joined room with Query ID:", queryId);

    // Listen for incoming messages
    socket.on(
      "receiveMessage",
      (payload: { message: string; senderId: string }) => {
        console.log("Message received:", payload);
        setMessages((prev) => [
          ...prev,
          { ...payload, id: prev.length + 1, time: new Date() },
        ]);
      }
    );

    // Cleanup on component unmount
    return () => {
      console.log("Disconnecting from socket...");
      socket.disconnect();
    };
  }, [params?.queryid, router]);

  const sendMessage = () => {
    const date = new Date();
    if (input.trim()) {
      const payload = {
        id: messages.length + 1,
        queryid: id,
        senderId: session.session?.user?.id || "anonymous", // Fallback if session is undefined
        message: input,
        time: date,
      };

      console.log("Sending message payload:", payload);

      const socket = socketRef.current;
      if (socket) {
        try {
          socket.emit("sendMessage", payload);
        } catch (err) {
          console.error("Error sending message:", err);
        }
      } else {
        console.error("Socket is not initialized!");
      }

      setInput(""); // Clear input field
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEmojiSelect = (emoji: any) => {
    setInputMessage(inputMessage + emoji.native);
    setShowEmojiPicker(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  return (
    <div>
      <TravelMinimalBackground />
      <div className=" relative flex flex-col h-screen md:flex-row-reverse">
      <div className=" relative flex flex-col w-full h-full bg-transparent transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between transition-colors duration-300 border-b-2 border-gray-200 dark:border-gray-700 mt-16">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 ring-2 ring-blue-500 dark:ring-blue-300">
          <AvatarImage
            src="/placeholder.svg?height=40&width=40"
            alt="Local Guide"
          />
          <AvatarFallback>
            {session.session?.user?.role === "TRAVELLER"
            ? infoQ?.responder?.name?.charAt(0).toUpperCase()
            : infoQ?.traveler?.name?.charAt(0).toUpperCase()}{" "}
          </AvatarFallback>
          </Avatar>
          <div>
          <h1 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            {session.session?.user?.role === "TRAVELLER"
            ? infoQ?.responder?.name
            : infoQ?.traveler?.name}
          </h1>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{infoQ?.location?.name}</span>
          </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
          variant="outline"
          size="sm"
          className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hidden sm:flex"
          >
          <Compass className="w-4 h-4 mr-1" />
          Explore {infoQ?.location?.name}
          </Button>
        </div>
        </header>

        {/* Chat Window */}
        <div
        ref={chatWindowRef}
        className="flex-1 overflow-y-auto  p-4 h-screen space-y-4 bg-white dark:bg-gray-800 dark:bg-opacity-10 bg-repeat bg-opacity-5"
        >
        <AnimatePresence>
          {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
            msg.senderId === session.session?.user?.id
              ? "justify-end"
              : "justify-start"
            }`}
          >
            <div
            className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-3 ${
              msg.senderId === session.session?.user?.id
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            } shadow-md`}
            >
            <p>{msg.message}</p>
            <div className="mt-2 text-xs opacity-70 text-right">
              {formatTime(msg.time)}
            </div>
            </div>
          </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="ml-2">Local guide is typing...</span>
          </div>
        )}
        </div>

        {/* Message Input */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-lg transition-colors duration-300 border-t-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          aria-label="Open emoji picker"
          >
          <Smile className="h-5 w-5" />
          </Button>
          <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          aria-label="Attach image"
          >
          <ImageIcon className="h-5 w-5" />
          </Button>
          <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          aria-label="Attach file"
          >
          <Paperclip className="h-5 w-5" />
          </Button>
          <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask your local guide..."
          className="flex-1 border-gray-200 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <Button
          type="button"
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          >
          <Send className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-16 right-4 z-10">
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme={"light"}
          />
          </div>
        )}
        </div>
      </div>
      {!isSmallScreen ? (
        <motion.div
        className="w-full sm:w-1/3 mt-16 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-4 flex flex-col space-y-16 sm:relative sm:h-full sm:overflow-y-auto"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        >
        {/* User Info */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Chat Options
          </h1>
        </motion.div>

        {/* Chat Actions */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {session?.user?.role === "TRAVELLER" ? (
            <Button
              className={`w-full ${
          markResolved ? "bg-green-500" : "bg-purple-600 hover:bg-purple-700"
              } text-white font-semibold py-2 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg`}
              onClick={() => {
          if (id) {
            rateAndResolveQuery(id, rating);
            setMarkResolved(true);
          }
              }}
            >
              {markResolved ? "Resolved" : "Mark as Resolved"}
            </Button>
          ) : (
            <div className="text-gray-800 dark:text-gray-100">
              <p className="font-semibold">You are guiding this chat.</p>
              <p>Provide the best assistance to the traveler.</p>
            </div>
          )}
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
            Report Issue
          </Button>
        </motion.div>
        {session?.user?.role === "TRAVELLER" && (
          <motion.div
            className="space-y-2 mt-3 mb-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="grid gap-2">
              <Label
          className="text-xl text-gray-800 dark:text-gray-100"
          htmlFor="rating"
              >
          Rating
              </Label>
              <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className={`h-6 w-6 cursor-pointer text-gray-400 transition-colors duration-200 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 ${
                rating >= star
            ? "text-yellow-400 dark:text-yellow-300"
            : ""
              }`}
            >
              <StarIcon size={30} />
            </button>
          ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Notes Section */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-100 truncate">
          Your Notes
          </h4>
          <textarea
          className="w-full h-32 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:outline-none transition-shadow duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Add notes about this chat..."
          ></textarea>
        </motion.div>
        </motion.div>
      ) : (
        <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-2/3 bg-white flex flex-col"
        >
        {isSmallScreen && (
          <Drawer>
          <DrawerTrigger asChild>
            <Button
            variant="outline"
            className="w-full bg-blue-500 text-white hover:bg-blue-600 font-semibold py-2 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
            Chat Options
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Chat Options</DrawerTitle>
            </DrawerHeader>
            <div className="space-y-4 p-4">
              <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 text-white p-4  shadow-md"
              >
              <h2 className="text-xl font-bold mb-2">Chat Partner</h2>
              <div className="flex items-center space-x-2">
          <User size={18} />
          <span>{infoQ?.traveler.name}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
          <MapPin size={18} />
          <span>{infoQ?.location.name}</span>
              </div>
              </motion.div>
              <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              >
              {session?.user?.role === "TRAVELLER" ? (
          <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          onClick={() => {
            if (id) {
              rateAndResolveQuery(id, rating);
              setMarkResolved(true);
            }
          }}
          >
          {markResolved ? "Resolved" : "Mark as Resolved"}
          </Button>
              ) : (
          <div className="text-gray-800 dark:text-gray-100">
            <p className="font-semibold">You are guiding this chat.</p>
            <p>Provide the best assistance to the traveler.</p>
          </div>
              )}
              <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
          Report Issue
              </button>
              </motion.div>
              {session?.user?.role === "TRAVELLER" && (
          <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
          >
          <h3 className="text-lg font-semibold text-gray-800">
            Rate your chat experience
          </h3>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              onClick={() => setRating(star)}
              className={`cursor-pointer transition-colors duration-200 ${
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300"
              }`}
            />
            ))}
          </div>
          </motion.div>
              )}
              <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
              >
              <h3 className="text-lg font-semibold text-gray-800">
          Provide feedback
              </h3>
              <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="Your feedback here..."
          rows={4}
              />
              <Button className="w-full bg-black text-white hover:bg-gray-800">
          <Send size={18} className="mr-2" />
          Send Feedback
              </Button>
              </motion.div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
              <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
            </div>
          </DrawerContent>
          </Drawer>
        )}
        </motion.div>
      )}
      </div>
    </div>
  );
}
