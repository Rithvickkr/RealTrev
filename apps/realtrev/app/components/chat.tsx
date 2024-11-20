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

  const [infoQ,setInfoQ]=useState<infoQ>()

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
    const aboutquery = async () => {  
      if (id) {
        const infoQ = await knowTheQuery(id);
        setInfoQ({
          id: id,
          responder: infoQ?.responder ? { name: infoQ.responder.name } : { name: "" },
          traveler: infoQ?.traveler ? { name: infoQ.traveler.name } : { name: "" },
          location: infoQ?.location ? { name: infoQ.location.name } : { name: "" },
        });
        
      } else {
        console.error("ID is undefined!");
      }
    }
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

  return (
    <div className="flex flex-col sm:flex-row h-screen md:flex-row  ">
       <motion.div
      className="w-full sm:w-1/3  bg-gray-50 border-l border-gray-200 p-4 flex flex-col space-y-6 sm:relative  sm:h-full sm:overflow-y-auto"
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
        <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-110">
          <img src="/placeholder-avatar.jpg" alt="User Avatar" className="object-cover w-full h-full" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 truncate">John Doe</h3>
          <p className="text-sm text-gray-500 truncate">Guide</p>
        </div>
      </motion.div>

      {/* Chat Actions */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          Mark as Resolved
        </button>
        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          Report Issue
        </button>
      </motion.div>

      {/* Notes Section */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h4 className="text-sm font-semibold text-gray-700 truncate">Your Notes</h4>
        <textarea
          className="w-full h-32 border border-gray-300 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-purple-600 focus:outline-none transition-shadow duration-300"
          placeholder="Add notes about this chat..."
        ></textarea>
      </motion.div>
      <motion.div
        className="space-y-2 mt-3 mb-3 "
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h4 className="text-sm font-semibold text-gray-700 truncate">Rate the chat</h4>
        <div>
          <StarIcon/>
        </div>
       
      </motion.div>

      {/* History Section */}
      <motion.div
        className="space-y-2 overflow-auto max-h-40 sm:max-h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h4 className="text-sm font-semibold text-gray-700 truncate ">Chat History</h4>
        <div className="space-y-2">
          <h3>NO history to show</h3>
        </div>
      </motion.div>

      {/* Help/Info */}
      
    </motion.div>
    <div className="flex flex-col h-full bg-green-50 w-full sm:w-3/4 dark:bg-green-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-green-800 shadow-sm p-4 flex items-center justify-between transition-colors duration-300 border-b-2 border-green-200 dark:border-green-700">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 ring-2 ring-green-500 dark:ring-green-300">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt="Local Guide"
            />
            <AvatarFallback>{session.session?.user?.role === "TRAVELLER"? (infoQ?.responder?.name)?.charAt(0).toUpperCase() : (infoQ?.traveler?.name)?.charAt(0).toUpperCase()} </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg text-green-800 dark:text-green-100">
              {session.session?.user?.role === "TRAVELLER"? infoQ?.responder?.name : infoQ?.traveler?.name} 
            </h1>
            <div className="flex items-center text-sm text-green-600 dark:text-green-300">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{infoQ?.location?.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 dark:text-green-300 border-green-300 dark:border-green-600 hidden sm:flex"
          >
            <Compass className="w-4 h-4 mr-1" />
            Explore {infoQ?.location?.name}
          </Button>
        </div>
      </header>

      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/placeholder.svg?height=400&width=400')] bg-repeat bg-opacity-5"
      >
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.senderId === session.session?.user?.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-3 ${
                  msg.senderId === session.session?.user?.id
                    ? "bg-green-500 text-white"
                    : "bg-white dark:bg-green-700 text-green-900 dark:text-green-100"
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
          <div className="flex items-center text-green-600 dark:text-green-300">
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
      <div className="bg-white dark:bg-green-800 p-4 shadow-lg transition-colors duration-300 border-t-2 border-green-200 dark:border-green-700">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
            aria-label="Open emoji picker"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
            aria-label="Attach image"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage}
            placeholder="Ask your local guide..."
            className="flex-1 border-green-200 dark:border-green-600 focus:ring-green-500 dark:focus:ring-green-400"
          />
          <Button
            type="button"
            onClick={sendMessage}
            className="bg-green-500 hover:bg-green-600 text-white"
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

      {/* Floating Action Button for Mobile */}
      <Button
        className="fixed bottom-4 right-4 rounded-full p-3 bg-green-500 hover:bg-green-600 text-white shadow-lg md:hidden"
        onClick={() =>
          chatWindowRef.current?.scrollTo(0, chatWindowRef.current.scrollHeight)
        }
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="h-6 w-6" />
      </Button>

      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: currentColor;
          border-radius: 50%;
          display: inline-block;
          margin-right: 4px;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
    </div>
  );
}
