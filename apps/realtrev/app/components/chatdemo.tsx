"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

const ChatPage = ({ session }: { session: any }) => {
  const params = useParams();
  const router = useRouter();
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [id, setId] = useState<string | undefined>(
    () => (Array.isArray(params?.queryid) ? params.queryid[0] : params?.queryid)
  );
  const [messages, setMessages] = useState<{ message: string; senderId: string }[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!params?.queryid) {
      console.error("Query ID is missing!");
      router.push("/error");
      return;
    }

    const queryId = Array.isArray(params.queryid) ? params.queryid[0] : params.queryid;
    setId(queryId);
    console.log("Connecting to socket with Query ID:", queryId);

    // Initialize socket connection
    const socket = io("http://localhost:3002"); // Replace with your backend URL
    socketRef.current = socket;

    socket.emit("joinRoom", { queryid: queryId });
    console.log("Joined room with Query ID:", queryId);

    // Listen for incoming messages
    socket.on("receiveMessage", (payload: { message: string; senderId: string }) => {
      console.log("Message received:", payload);
      setMessages((prev) => [...prev, payload]);
    });

    // Cleanup on component unmount
    return () => {
      console.log("Disconnecting from socket...");
      socket.disconnect();
    };
  }, [params?.queryid, router]);

  const sendMessage = () => {
    if (input.trim()) {
      const payload = {
        queryid: id,
        senderId: session?.user?.id || "anonymous", // Fallback if session is undefined
        message: input,
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white py-4 px-6 shadow-lg">
        <h1 className="text-xl font-bold">Chat Room: {id || "Loading..."}</h1>
        <p className="text-sm">Chat with locals and get your queries resolved!</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.senderId === session?.user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    msg.senderId === session?.user?.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  } px-4 py-2 rounded-lg max-w-xs`}
                >
                  <span className="text-sm font-semibold block">
                    {msg.senderId === session?.user?.id ? "You" : msg.senderId}
                  </span>
                  <span>{msg.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex items-center bg-white shadow-lg px-4 py-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="ml-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
