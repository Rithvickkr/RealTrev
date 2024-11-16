"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";


let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const ChatPage = (session:any) => {
  const { queryid: id } = useParams(); // Get query ID from URL params
  const [messages, setMessages] = useState<{ text: string }[]>([]);
  const [input, setInput] = useState("");
  console.log("id", id);  // Check if id is being extracted correctly
  
  useEffect(() => {
    if (!id) {
      console.error("Query ID is missing!");  // Log if the ID is not present
      return;
    }
    console.log("Session", session);  // Debug session
     
    console.log("Connecting to socket...");
    // Initialize socket connection
    socket = io("http://localhost:3002"); // Your backend URL
    socket.emit("joinRoom", { queryid: id }); // Send the queryid as part of an object
    console.log("Connected to socket, emitted joinRoom with id:", id); // Log emission

    // Listen for messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, { text: message }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const sendMessage = () => {
    if (input.trim()) {
      console.log("Sending message:", input);  // Debug message
      if (session.data?.user) {
        socket.emit("sendMessage", { id, senderId: session.user.id, message: input });  // Send the message to the room
      } else {
        console.error("User is not authenticated");
      }
      setInput(""); // Clear input field after sending
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Chat Room: {id}</h1>
      <div className="bg-white p-4 rounded shadow-md max-h-96 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
