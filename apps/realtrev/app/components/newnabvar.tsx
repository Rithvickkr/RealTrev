"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Moon,
  Sun,
  Menu,
  Home,
  Compass,
  MessageCircle,
  User,
  Gift,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import changerole from "../lib/actions/changerole";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { darkModeState } from "@/recoil/darkmodeatom";
import { changeRoleState } from "@/recoil/changeroleatom";

interface NavbarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  href?: string;
}

const NavbarItem = ({ icon: Icon, text, href = "#" }: NavbarItemProps) => (
  <Link
    href={href}
    className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors"
  >
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </Link>
);

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [isGuide, setIsGuide] = useRecoilState<string>(changeRoleState);
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const router = useRouter();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(userPrefersDark);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const changeRole = async () => {
    if (session) {
      const newRole = isGuide === "GUIDE" ? "TRAVELLER" : "GUIDE";
      setIsGuide(newRole);

      try {
        const updatedUser = await changerole({
          user: { email: session.user?.email },
        });
        setIsGuide(updatedUser.role === "GUIDE" ? "GUIDE" : "TRAVELLER");
      } catch (error) {
        console.error("Failed to change role", error);
        setIsGuide(isGuide === "GUIDE" ? "GUIDE" : "TRAVELLER");
      }
    } else {
      console.error("Session is null");
    }
  };
  if (pathname === "/signin") {
    return null;
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        pathname === "/explore"
          ? scrolled
            ? "bg-background/80 backdrop-blur-md pb-2 dark:bg-background-dark/80"
            : "bg-transparent py-4"
          : "bg-background/80 backdrop-blur-md pb-2 dark:bg-background-dark/80"
      }`}
    >
      <div className="mx-auto px-4 mt-4 flex items-center justify-between text-foreground dark:text-foreground-dark">
        <Link
          href="/"
          className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors dark:text-primary-dark"
        >
          RealTrev
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <NavbarItem icon={Home} text="Home" href="/" />
          <NavbarItem icon={Compass} text="Explore" href="/explore1" />
          <NavbarItem
            icon={MessageCircle}
            text={isGuide !== "GUIDE" ? "Connect" : "Dashboard"}
            href={isGuide !== "GUIDE" ? "/trevboard" : "/gdash"}
          />
          <NavbarItem icon={User} text="Profile" />
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hidden md:inline-block">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="dark:bg-background-dark"
            >
              <DropdownMenuLabel className="dark:text-foreground-dark">
                My Account
              </DropdownMenuLabel>
              <div className="px-5 py-2">
                <p className="text-sm font-semibold">{session?.user.name}</p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                  {session?.user.email}
                </p>
              </div>
              <DropdownMenuSeparator className="dark:bg-border-dark" />
              <DropdownMenuItem className="dark:text-foreground-dark">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="dark:text-foreground-dark">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-border-dark" />
              <DropdownMenuItem className="dark:text-foreground-dark">
                <div className="flex items-center justify-between w-full">
                  <span>Switch to {isGuide !== "GUIDE" ? "Guide" : "Traveler"}</span>
                  <Switch
                    checked={isGuide === "GUIDE"}
                    onCheckedChange={changeRole}
                    className={`ml-2 ${
                      isGuide
                        ? "data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary-dark"
                        : "data-[state=unchecked]:bg-secondary dark:data-[state=unchecked]:bg-secondary-dark"
                    }`}
                  />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-border-dark" />
              <DropdownMenuItem
                className="dark:text-foreground-dark"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-primary dark:text-primary-dark"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle dark mode</span>
          </Button>
          <Button
            variant="outline"
            className="hidden md:flex items-center space-x-1 bg-background hover:bg-accent dark:bg-background-dark dark:hover:bg-accent-dark"
            onClick={() => router.push("/trevwallet")}
          >
            <Gift className="w-4 h-4" />
            <span>Trev Wallet</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden relative w-10 h-10 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-background border-l border-border dark:bg-background-dark dark:border-border-dark"
            >
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>
                      {session?.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{session?.user.name}</p>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                      {session?.user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 bg-secondary rounded-lg dark:bg-secondary-dark">
                    <span className="text-sm font-medium">I am a</span>
                    <div className="space-x-2">
                      <Button
                        variant={isGuide !== "GUIDE" ? "default" : "outline"}
                        size="sm"
                        onClick={changeRole}
                        className="dark:bg-background-dark dark:text-foreground-dark"
                      >
                        Traveler
                      </Button>
                      <Button
                        variant={isGuide === "GUIDE" ? "default" : "outline"}
                        size="sm"
                        onClick={changeRole}
                        className="dark:bg-background-dark dark:text-foreground-dark"
                      >
                        Guide
                      </Button>
                    </div>
                  </div>
                  <nav className="space-y-2">
                    <NavbarItem icon={Home} text="Home" />
                    <NavbarItem icon={Compass} text="Explore" href="/querygen" />
                    <NavbarItem
                      icon={MessageCircle}
                      text={isGuide !== "GUIDE" ? "Connect" : "Dashboard"}
                      href={isGuide !== "GUIDE" ? "/trevboard" : "/gdash"}
                    />
                    <NavbarItem icon={User} text="Profile" />
                    <NavbarItem icon={Settings} text="Settings" />
                  </nav>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 dark:bg-background-dark dark:text-foreground-dark"
                    onClick={() => router.push("/trevwallet")}
                  >
                    <Gift className="w-4 h-4" />
                    <span>Trev Wallet</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center space-x-2 text-destructive dark:text-destructive-dark"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
