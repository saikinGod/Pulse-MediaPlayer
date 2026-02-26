"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "./components/SideBar";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import PlayerControls from "./components/PlayerControls";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

function MasterPlayer() {
  const {
    currentTrack, isPlaying, togglePlay, currentTime, duration,
    volume, changeVolume, nextTrack, prevTrack, seek, videoRef, clearQueue
  } = usePlayer();
  const pathname = usePathname();

  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef(null);

  const isVideo = currentTrack?.fileType === 'video';

  useEffect(() => {
    const handleInteraction = () => {
      setShowControls(true);
      clearTimeout(timeoutRef.current);
      if (isVideo && isPlaying) {
        timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
      }
    };

    const container = document.getElementById("video-wrapper");
    if (isVideo && container) {
      container.addEventListener("mousemove", handleInteraction);
      container.addEventListener("click", handleInteraction);
      container.addEventListener("mouseleave", () => {
        if (isPlaying) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setShowControls(false), 1000);
        }
      });
    }

    if (!isPlaying || !isVideo) {
      setShowControls(true);
      clearTimeout(timeoutRef.current);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [isVideo, isPlaying]);

  const handleFullscreen = () => {
    const elem = document.getElementById("video-wrapper");
    if (!document.fullscreenElement) {
      elem?.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  if (pathname === '/login' || pathname === '/signup') return null;

  return (
    <>
      {isVideo && (
        <div id="video-wrapper" className="absolute inset-0 z-100 bg-black flex flex-col overflow-hidden group">

          <div className="flex-1 relative w-full h-full cursor-pointer flex items-center justify-center bg-black" onClick={togglePlay}>
            <video ref={videoRef} className="w-full h-full object-contain" playsInline />

            <button
              onClick={(e) => { e.stopPropagation(); clearQueue(); }}
              className={`absolute top-6 right-6 z-200 text-white/70 hover:text-red-500 bg-black/40 hover:bg-black/80 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              title="Close Video"
            >
              <X size={20} />
            </button>
          </div>

          <div className={`absolute bottom-0 left-0 w-full z-200 transition-all duration-500 ease-in-out ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <PlayerControls
              isPlaying={isPlaying} onPlayPause={togglePlay} currentTime={currentTime} duration={duration} onSeek={seek}
              volume={volume} onVolumeChange={changeVolume} onNext={nextTrack} onPrev={prevTrack} trackName={currentTrack?.name} hasTrack={!!currentTrack}
              onFullscreen={handleFullscreen}
            />
          </div>
        </div>
      )}

      {!isVideo && (
        <div className="fixed bottom-0 left-0 w-full z-9999">
          <PlayerControls
            isPlaying={isPlaying} onPlayPause={togglePlay} currentTime={currentTime} duration={duration} onSeek={seek}
            volume={volume} onVolumeChange={changeVolume} onNext={nextTrack} onPrev={prevTrack} trackName={currentTrack?.name} hasTrack={!!currentTrack}
            onFullscreen={() => { }}
          />
          <video ref={videoRef} className="hidden" preload="metadata" playsInline />
        </div>
      )}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121212] text-white h-screen w-screen overflow-hidden flex`}>
        <PlayerProvider>

          <SideBar />

          <main className="flex-1 h-full overflow-hidden relative">
            <div className="h-full w-full overflow-y-auto pb-28">
              {children}
            </div>

            <MasterPlayer />
          </main>

          <ToastContainer
            position="bottom-center" autoClose={2000} hideProgressBar newestOnTop={false}
            closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover
            theme="dark" transition={Slide} style={{ marginBottom: '110px', zIndex: 10000 }}
          />
        </PlayerProvider>
      </body>
    </html>
  );
}