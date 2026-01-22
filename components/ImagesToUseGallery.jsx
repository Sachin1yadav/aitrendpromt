"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DownloadImageButton from "./DownloadImageButton";
import { X } from "lucide-react";

export default function ImagesToUseGallery({ images, title }) {
  const [selectedImage, setSelectedImage] = useState(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <section className="mb-10">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">
            Download and use these images as input when generating with this prompt for best results
          </p>
        </div>
        
        {/* Horizontal Scrollable Container */}
        <div className="relative">
          <div className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-4 -mx-4 px-4">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {images.map((imageUrl, index) => (
                <div key={index} className="group relative flex-shrink-0">
                  <div className="relative w-48 sm:w-56 md:w-64 aspect-square overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-100 shadow-sm transition-all hover:border-blue-500 hover:shadow-xl hover:scale-105">
                    <button
                      onClick={() => setSelectedImage(imageUrl)}
                      className="relative w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
                    >
                      <Image
                        src={imageUrl}
                        alt={`Image to use ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Top left badge */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                          #{index + 1}
                        </div>
                      </div>

                      {/* Download button overlay */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <DownloadImageButton 
                          imageUrl={imageUrl} 
                          filename={`use-image-${index + 1}.jpg`}
                          variant="overlay"
                          size="sm"
                        />
                      </div>

                      {/* Bottom hint */}
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="rounded-md bg-white/95 backdrop-blur-sm px-2 py-1 text-xs font-semibold text-gray-700 text-center shadow-lg">
                          Click to view
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll indicator gradient */}
          <div className="absolute right-0 top-0 bottom-4 w-20 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
        </div>

        <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-green-800 text-center">
            <span className="font-semibold">📥 Download these images</span> and upload them to your AI tool along with the prompt for best results!
          </p>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-14 right-0 flex items-center gap-3">
              <DownloadImageButton 
                imageUrl={selectedImage} 
                filename="use-image.jpg"
                variant="overlay"
                size="lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white text-base font-semibold px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200"
              >
                <X className="w-5 h-5" />
                <span>Close (ESC)</span>
              </button>
            </div>
            <div className="relative w-full h-[85vh] overflow-hidden rounded-2xl bg-gray-900">
              <Image
                src={selectedImage}
                alt="Full size image"
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

