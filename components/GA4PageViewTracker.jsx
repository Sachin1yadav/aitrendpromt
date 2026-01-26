"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageViewGA4 } from "@/lib/ga4";

export default function GA4PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef(null);
  const hasTrackedInitial = useRef(false);

  useEffect(() => {
    // Wait for GA4 to be ready
    if (typeof window === 'undefined' || !window.gtag) {
      return;
    }

    const currentPath = pathname;

    // Skip initial page load - GA4 config already sends it automatically
    if (!hasTrackedInitial.current) {
      hasTrackedInitial.current = true;
      previousPath.current = currentPath;
      return; // Don't track initial load, GA4 config handles it
    }

    // Only track if pathname actually changed (route navigation)
    if (currentPath && currentPath !== previousPath.current) {
      const fullPath = searchParams.toString() 
        ? `${currentPath}?${searchParams.toString()}` 
        : currentPath;
      
      trackPageViewGA4(fullPath, document.title);
      previousPath.current = currentPath;
    }
  }, [pathname, searchParams]);

  return null;
}
