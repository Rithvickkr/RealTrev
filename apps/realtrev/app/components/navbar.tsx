"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import changerole from "../lib/actions/changerole";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState(session?.user.role || "");

  async function changeRole() {
    if (session) {
      const updatedUser = await changerole({ user: { email: session.user?.email } });
      setRole(updatedUser.role);
      window.location.reload();
    } else {
      console.error("Session is null");
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/explore" className="text-2xl font-bold text-purple-600">
            RealTrev
          </Link>

          {/* Desktop Links */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link
              href="/explore"
              className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href={session?.user.role === "TRAVELLER" ? "/querygen" : "/gdash"}
              className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
            >
              {session?.user.role === "TRAVELLER" ? "Explore" : "Dashboard"}
            </Link>
            <Link
              href="/trevboard"
              className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
            >
              My Queries
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-purple-600 transition-colors duration-300"
            >
              Contact
            </Link>
          </div>

          {/* User Role Button + Avatar */}
          <div className="hidden sm:flex items-center space-x-4">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white transition-transform duration-300 hover:scale-105"
              onClick={changeRole}
            >
              Switch to Guide Role
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src="/placeholder.svg" alt="User Avatar" />
                  <AvatarFallback>
                    {(session?.user?.name)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                  <p className="text-xs text-gray-500">{session?.user?.role}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden text-gray-600 hover:text-purple-600"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-2 p-4">
            <Link href="/explore" className="block text-gray-600 hover:text-purple-600">
              Home
            </Link>
            <Link
              href={session?.user.role === "TRAVELLER" ? "/querygen" : "/gdash"}
              className="block text-gray-600 hover:text-purple-600"
            >
              {session?.user.role === "TRAVELLER" ? "Explore" : "Dashboard"}
            </Link>
            <Link href="/trevboard" className="block text-gray-600 hover:text-purple-600">
              My Queries
            </Link>
            <Link href="/contact" className="block text-gray-600 hover:text-purple-600">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
