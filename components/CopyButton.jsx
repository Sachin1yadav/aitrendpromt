"use client";

import { useState } from "react";

export default function CopyButton({ text, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 ${className}`}
    >
      {copied ? "✓ Copied!" : "📋 Copy Prompt"}
    </button>
  );
}
