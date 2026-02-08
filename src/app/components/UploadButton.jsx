"use client";
import Link from "next/link";
import { Upload } from "lucide-react";

export default function UploadButton() {
  return (
    <Link
      href="/upload"
      className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 bg-linear-to-r from-red-600 via-red-500 to-red-600 opacity-100 group-hover:opacity-0 transition-opacity duration-300"
        style={{
          backgroundSize: "200% 100%",
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />

      {/* Hover state gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-red-700 via-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow:
            "0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3)",
        }}
      />

      {/* Content */}
      <Upload
        size={18}
        className="relative z-10 text-white transition-transform duration-300 group-hover:rotate-12"
      />
      <span className="relative z-10 text-white">Upload</span>

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </Link>
  );
}
