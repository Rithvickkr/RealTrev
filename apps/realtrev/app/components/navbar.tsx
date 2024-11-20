"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"



import changerole from "../lib/actions/changerole"

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [role, setRole] = useState(session?.user.role||"") 
 

  async function changeRole() {
    if (session) {
      const updateduser=await changerole({ user: { email: session.user?.email } })
      
     
      setRole(updateduser.role)
      
      window.location.reload()
      
    } else {
      console.error("Session is null");
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/explore" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-purple-600">RealTrev</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/explore" className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href={session?.user.role=== "TRAVELLER" ? "/querygen" : "/gdash" } className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
             {session?.user.role === "TRAVELLER" ? "Explore" : "Dashboard"}
            </Link>
            <Link href="/trevboard" className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              My queries
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Button type="button" className="bg-purple-600 hover:bg-purple-700 text-white"  onClick={changeRole}>Switch to Guide Role</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full border-black">
                  <Avatar className="h-10 w-10  border-black ">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" />
                    <AvatarFallback>{(session?.user?.name)?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                onClick={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <h1 className="text-2xl font-bold text-blue-600">{(session?.user as { role?: string })?.role}</h1>
            
          </div>
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Main menu" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="text-gray-600 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/explore" className="text-gray-600 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
              Explore
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}