"use client";

import { Instagram } from "lucide-react";
import { trackInstagramClick } from "@/lib/tracking";

export default function InstagramLink({ 
  href = "https://www.instagram.com/aitrendpromt/",
  location = "unknown",
  children,
  className = "",
  ...props 
}) {
  const handleClick = () => {
    trackInstagramClick(location);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}

