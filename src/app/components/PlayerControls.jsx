"use client";
import { useState, useRef, useEffect } from "react";
import { PlayPauseButton, PreviousIcon, NextIcon, ShuffleIcon, RepeatIcon } from "./PulseIcons";
import { Volume2, VolumeX, Maximize2, MoreHorizontal, ListMusic, Repeat1 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlayer } from "../context/PlayerContext";

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function PlayerControls({
  isPlaying, onPlayPause, currentTime, duration, onSeek, volume,
  onVolumeChange, onNext, onPrev, trackName, hasTrack, onFullscreen
}) {
  const router = useRouter();
  const { isShuffle, toggleShuffle, repeatMode, toggleRepeat } = usePlayer();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const popupRef = useRef(null);

  const uiVolume = volume * 100;
  const isMuted = uiVolume === 0;

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    onPlayPause();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) setShowVolumePopup(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUiVolumeChange = (e) => {
    e.stopPropagation();
    onVolumeChange(parseInt(e.target.value) / 100);
  };

  const handleProgressChange = (e) => {
    e.stopPropagation();
    onSeek(parseFloat(e.target.value));
  };

  return (
    <div className="h-28 bg-[#121212] border-t border-[#2a2a2a] z-50 flex flex-col justify-center px-6 backdrop-blur-lg bg-opacity-95" onDoubleClick={(e) => e.stopPropagation()}>
      <div className="w-full flex items-center gap-4 mb-2 pt-2 select-none">
        <span className="text-xs font-mono text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
        <div className="relative w-full h-6 flex items-center group cursor-pointer">
          <div className="absolute w-full h-1.5 bg-[#333] rounded-full overflow-hidden"></div>
          <div className="absolute h-1.5 bg-linear-to-r from-red-600 to-red-500 rounded-full" style={{ width: `${(currentTime / duration) * 100 || 0}%` }}></div>
          <div className="absolute h-6 w-6 -ml-3 flex items-center justify-center top-0" style={{ left: `${(currentTime / duration) * 100 || 0}%` }}>
            <div className="bg-white rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-200 ease-out w-4 h-4 group-hover:w-5 group-hover:h-5 group-active:w-5 group-active:h-5">
              <div className="bg-red-600 rounded-full transition-all duration-150 ease-in-out w-0 h-0 group-hover:w-3 group-hover:h-3 group-active:w-2.5 group-active:h-2.5"></div>
            </div>
          </div>
          <input type="range" min="0" max={duration || 0} step="0.1" value={currentTime || 0} onChange={handleProgressChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
        </div>
        <span className="text-xs font-mono text-gray-400 w-10">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between w-full h-full pb-2">
        <div className="flex items-center w-[30%] min-w-45">
          <div className="w-12 h-12 bg-linear-to-br from-gray-800 to-black rounded-md mr-3 flex items-center justify-center border border-gray-700 shadow-lg group cursor-pointer hover:border-red-500/50 transition-colors">
            <span className="text-[10px] text-gray-500 font-bold group-hover:text-red-500">ART</span>
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <h4 className="text-white font-medium text-sm truncate hover:underline cursor-pointer" title={trackName}>
              {hasTrack ? trackName : "Pulse Player Ready"}
            </h4>
            <p className="text-gray-400 text-xs truncate hover:text-white cursor-pointer">
              {hasTrack ? "Unknown Artist" : "Select a track"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 w-[40%]">
          <button onClick={toggleShuffle} className={`transition-colors active:scale-95 ${isShuffle ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
            <ShuffleIcon size={18} />
          </button>
          <button onClick={onPrev} className="hover:text-white text-gray-300 transition-colors active:scale-95"><PreviousIcon size={22} /></button>
          <PlayPauseButton isPlaying={isPlaying} onClick={togglePlay} size={48} />
          <button onClick={onNext} className="hover:text-white text-gray-300 transition-colors active:scale-95"><NextIcon size={22} /></button>
          <button onClick={toggleRepeat} className={`transition-colors active:scale-95 ${repeatMode > 0 ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
            {repeatMode === 2 ? <Repeat1 size={18} /> : <RepeatIcon size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-end w-[30%] min-w-45 gap-4 text-gray-400 relative">
          <button onClick={() => router.push("/playQueue")} className="hover:text-white transition-colors"><ListMusic size={20} /></button>
          <div className="relative flex items-center" ref={popupRef}>
            {showVolumePopup && (
              <div className="absolute bottom-14 -left-3 bg-[#1e1e1e] p-3 rounded-2xl shadow-2xl border border-[#333] flex flex-col items-center gap-3 w-12 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                <span className="text-[10px] font-bold text-white mb-1">{uiVolume.toFixed(0)}</span>
                <div className="relative h-24 w-1.5 bg-[#333] rounded-full group cursor-pointer flex justify-center">
                  <div className="absolute bottom-0 w-full bg-red-600 rounded-full" style={{ height: `${uiVolume}%` }}></div>
                  <div className="absolute w-6 h-6 flex items-center justify-center -mb-2" style={{ bottom: `${uiVolume}%` }}>
                    <div className="bg-white rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-200 ease-out w-4 h-4 group-hover:w-5 group-hover:h-5 group-active:w-5 group-active:h-3.5">
                      <div className="bg-red-600 rounded-full transition-all duration-150 ease-in-out w-0 h-0 group-hover:w-2.5 group-hover:h-2.5 group-active:w-1.5 group-active:h-2"></div>
                    </div>
                  </div>
                  <input type="range" min="0" max="100" value={uiVolume} onChange={handleUiVolumeChange} className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-20" style={{ writingMode: "bt-lr", WebkitAppearance: "slider-vertical" }} />
                </div>
              </div>
            )}
            <button onClick={(e) => { e.stopPropagation(); setShowVolumePopup(!showVolumePopup); }} onDoubleClick={(e) => { e.stopPropagation(); onVolumeChange(isMuted ? 0.8 : 0); }} className="hover:text-white focus:outline-none transition-colors p-2 rounded-full hover:bg-white/5 active:scale-95">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          <Maximize2 size={18} className="hover:text-white ml-2 cursor-pointer transition-colors" onClick={onFullscreen} />
          <div className="relative">
            <MoreHorizontal size={20} className="hover:text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); setShowMoreMenu((v) => !v); }} />
            {showMoreMenu && (
              <div className="absolute bottom-10 right-0 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl py-1 w-24 z-50">
                <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white" onClick={() => setShowMoreMenu(false)}>Coming Soon</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}