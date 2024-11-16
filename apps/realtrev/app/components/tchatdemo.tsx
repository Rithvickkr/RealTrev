"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Moon, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getTrevQuery from "../lib/actions/gettrevquery";

interface Chat {
  id: string;
  localName: string;
  location: string;
  status: string;
  lastMessage: string;
}

interface TravelerDashboardProps {
  session: any;
}

const TravelerDashboard: React.FC<TravelerDashboardProps> = ({ session }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();
     
  useEffect(() => {
    // Simulate fetching chats, replace this with your API call
   const fetchChats = async () => {
      const res = await getTrevQuery(session);
      if (Array.isArray(res)) {
        setChats(res.map(chat => ({
          id: chat.id,
          localName: chat.travelerId, // Adjust this field based on your actual data
          location: chat.locationId.toString(), // Adjust this field based on your actual data
          status: chat.status,
          lastMessage: chat.queryText // Adjust this field based on your actual data
        })));
        console.log(res);
      } else {
        setChats([]);
      }
    };
    fetchChats();
  }, []);

  const redirectToChat = (chatId: string): void => {
    router.push(`/chatpage/${chatId}`); // Redirects to chat page
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Traveler Dashboard
          </h1>
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
                  <User />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Your Chats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {chats.map((chat) => (
            <Card key={chat.id} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>{chat.localName}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Location: {chat.location}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {chat.lastMessage}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => redirectToChat(chat.id)}
                >
                  Open Chat
                  <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TravelerDashboard;
