'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MapPin, Search, Smile, Paperclip, Send, Bell } from 'lucide-react'

// Mock data for demonstration
const mockMessages = [
  { id: 1, sender: 'Local', name: 'Emma', message: 'Welcome to Paris! How can I help you today?', avatar: '/placeholder.svg?height=40&width=40' },
  { id: 2, sender: 'Traveler', name: 'Alex', message: 'Hi Emma! Im looking for some local food recommendations', avatar: '/placeholder.svg?height=40&width=40' },
  { id: 3, sender: 'Local', name: 'Emma', message: 'Of course! I know some great places. What kind of cuisine are you interested in?', avatar: '/placeholder.svg?height=40&width=40' },
]

export default function Component() {
  const [messages, setMessages] = useState(mockMessages)
  const [inputMessage, setInputMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'Traveler',
        name: 'Alex',
        message: inputMessage,
        avatar: '/placeholder.svg?height=40&width=40'
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 md:p-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-4 bg-blue-500 rounded-full p-2 animate-pulse">
              <MapPin className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Local Connect Chat</h1>
          </div>
          <div className="relative w-full md:w-96">
            <Input
              type="text"
              placeholder="Search for locals..."
              className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-grow overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto max-w-4xl">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'Local' ? 'justify-start' : 'justify-end'} mb-4 animate-fadeIn`}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={msg.avatar} alt={msg.name} />
                      <AvatarFallback>{msg.name[0]}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{msg.name}</p>
                    <p className="text-xs text-gray-500">{msg.sender === 'Local' ? 'Local Guide' : 'Traveler'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div
                className={`ml-2 p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg ${
                  msg.sender === 'Local'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-green-100 text-green-900'
                }`}
              >
                <p className="font-semibold">{msg.name}</p>
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Message Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto max-w-4xl flex items-center">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-500">
            <Smile className="h-6 w-6" />
            <span className="sr-only">Add emoji</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-500">
            <Paperclip className="h-6 w-6" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-grow mx-2"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Send className="h-5 w-5 mr-2" />
            Send
          </Button>
        </div>
      </footer>

      {/* Notification Area */}
      <div className="fixed top-4 right-4 bg-white rounded-full shadow-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
        <Bell className="text-blue-500" size={24} />
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          3
        </span>
      </div>
    </div>
  )
}