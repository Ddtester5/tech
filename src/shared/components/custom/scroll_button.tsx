"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-5 right-5   text-purple-500 transition-all  duration-300  rounded-full shadow-lg  hover:scale-110",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <ArrowUp size={30} />
    </button>
  );
}
