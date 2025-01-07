import { useState, useEffect } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    // Check localStorage on initial load and set the theme
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme); // If there's a saved theme, use it
      } else {
        // Default theme check (use system preference if no theme saved)
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    }
  }, []);

  useEffect(() => {
    // Apply the theme to the body without reloading the page
    document.body.classList.toggle("dark", theme === "dark");
    
    // Optionally save the theme to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
};

export default useTheme;
