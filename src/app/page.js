"use client";
import { useState } from "react";
import PlayerControls from "./components/PlayerControls";
import UploadButton from "./components/UploadButton";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDoubleClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="flex flex-col h-full justify-between select-none"
      onDoubleClick={handleDoubleClick}
    >

      {/* Hero Section */}
      <div className="flex justify-center items-center h-full gap-8 pointer-events-none">
        <svg
          width="200"
          height="200"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-8 drop-shadow-[0_0_15px_rgba(255,0,0,0.4)]"
        >
          <defs>
            <linearGradient id="red-black-combo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF1F1F" />
              <stop offset="60%" stopColor="#800000" />
              <stop offset="100%" stopColor="#0F0000" />
            </linearGradient>
            <filter id="neon-glow-dark" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g style={{ filter: "url(#neon-glow-dark)" }}>
            <path
              d="M9 18V5l12-3v13"
              stroke="url(#red-black-combo)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="6" cy="18" r="3" fill="none" stroke="url(#red-black-combo)" strokeWidth="2" />
            <circle cx="18" cy="16" r="3" fill="none" stroke="url(#red-black-combo)" strokeWidth="2" />
          </g>
        </svg>
        <div>
          <h2 className="text-3xl font-bold mb-4">Welcome to Pulse</h2>
          <p className="text-gray-400">Select a song from the library to start listening.</p>
        </div>
      </div>

      {/* Player Wrapper */}
      <div onDoubleClick={(e) => e.stopPropagation()}>
        <PlayerControls
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      </div>
    </div>
  );
}