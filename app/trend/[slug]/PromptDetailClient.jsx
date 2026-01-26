"use client";

import { useEffect } from "react";
import { trackPageView, trackInstagramClick } from "@/lib/tracking";

export default function PromptDetailClient({ prompt }) {
  useEffect(() => {
    trackPageView(`/trend/${prompt.slug}`);
  }, [prompt.slug]);

  return null; // This component only handles tracking
}

