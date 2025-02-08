import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

interface FooterProps {
  theme?: "light" | "dark";
}

export default function Footer({ theme = "dark" }: FooterProps) {
  const footerClasses =
    theme === "dark"
      ? "bg-gray-900 text-gray-200"
      : "bg-gray-100 text-gray-800";

  return (
    <footer className={footerClasses}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">RealTrev</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Connecting travelers with local experts for real-time updates and personalized advice.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {["About Us", "How It Works", "FAQs", "Contact Us"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 transition-colors duration-300 text-sm hover:underline underline-offset-4"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 transition-colors duration-300 text-sm hover:underline underline-offset-4"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Stay Connected</h3>
            <form className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className={`w-full ${
                  theme === "dark" ? "bg-white/10 border-none text-white" : ""
                } placeholder:opacity-80 focus:ring-2 focus:ring-blue-300`}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 font-semibold"
              >
                Subscribe
              </Button>
            </form>
            <div className="flex space-x-4 pt-4">
              <Instagram className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer transition-colors" />
              <Facebook className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-center text-sm opacity-80">
            &copy; {new Date().getFullYear()} RealTrev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}