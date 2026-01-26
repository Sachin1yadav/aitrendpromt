"use client";

import { useEffect } from "react";
import { clearExpiredCache } from "@/lib/api-utils";
import { clearPerformanceMarks } from "@/lib/performance";

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Clear expired cache on mount
    clearExpiredCache();
    
    // Clear performance marks periodically
    const interval = setInterval(() => {
      clearPerformanceMarks();
    }, 300000); // Every 5 minutes
    
    // Handle unhandled errors
    const handleError = (event) => {
      console.error("Unhandled error:", event.error);
      
      // Track in GA4 if available
      if (window.gtag) {
        window.gtag("event", "exception", {
          description: event.error?.toString() || "Unhandled error",
          fatal: false,
        });
      }
      
      // Prevent default error handling (we handle it ourselves)
      event.preventDefault();
    };
    
    // Handle unhandled promise rejections
    const handleRejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      
      // Track in GA4 if available
      if (window.gtag) {
        window.gtag("event", "exception", {
          description: event.reason?.toString() || "Unhandled promise rejection",
          fatal: false,
        });
      }
      
      // Prevent default error handling
      event.preventDefault();
    };
    
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);
  
  return null; // This component doesn't render anything
}

