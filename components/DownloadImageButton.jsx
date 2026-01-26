"use client";

import { useState } from "react";
import { trackDownloadImage } from "@/lib/tracking";

export default function DownloadImageButton({ imageUrl, filename, variant = "default", size = "md", imageType = "unknown", promptSlug = null }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    setIsDownloading(true);
    setIsSuccess(false);

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Track download
      trackDownloadImage(imageType, promptSlug);
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to download image:", error);
      // Fallback: open in new tab
      window.open(imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  // Icon sizes
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  // Variant styles
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg",
    overlay: "bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white shadow-lg hover:shadow-xl border border-gray-200",
    ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-green-500 text-white",
  };

  // Size styles
  const sizes = {
    sm: "px-2 py-1.5 text-xs gap-1.5",
    md: "px-3 py-2 text-sm gap-2",
    lg: "px-4 py-2.5 text-base gap-2.5",
  };

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]}`;

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={baseClasses}
      title="Download image"
    >
      {isDownloading ? (
        <>
          <svg className={`animate-spin ${iconSizes[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Downloading...</span>
        </>
      ) : isSuccess ? (
        <>
          <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download</span>
        </>
      )}
    </button>
  );
}

