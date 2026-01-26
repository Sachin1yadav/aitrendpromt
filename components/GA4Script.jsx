"use client";

import { useEffect } from "react";
import { initGA4 } from "@/lib/ga4";

export default function GA4Script() {
  useEffect(() => {
    // Get GA4 Measurement ID from environment variable
    const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    
    if (measurementId) {
      initGA4(measurementId);
    } else {
      console.log('GA4 Measurement ID not found. Set NEXT_PUBLIC_GA4_MEASUREMENT_ID in .env');
    }
  }, []);

  return null; // This component doesn't render anything
}

