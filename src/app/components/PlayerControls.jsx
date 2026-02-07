"use client";
import { useState, useRef, useEffect } from "react";
import { PlayPauseButton, PreviousIcon, NextIcon, ShuffleIcon, RepeatIcon } from "./PulseIcons";
import { Volume2, VolumeX, Maximize2, MoreHorizontal, ListMusic } from "lucide-react"; 

// Time formatter
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function PlayerControls({ isPlaying: propIsPlaying, setIsPlaying: propSetIsPlaying }) {
  
  // Hybrid State for Double Tap Fix
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const isControlled = propIsPlaying !== undefined;
  const isPlaying = isControlled ? propIsPlaying : internalIsPlaying;

  const togglePlay = (e) => {
    if (e) e.stopPropagation(); 
    if (isControlled) {
      propSetIsPlaying(!isPlaying); 
    } else {
      setInternalIsPlaying(!internalIsPlaying); 
    }
  };

  // Playback Data
  const duration = 245; 
  const [currentTime, setCurrentTime] = useState(90);
  
  // Volume Data
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [prevVolume, setPrevVolume] = useState(80);

  const popupRef = useRef(null);

  // Close popup on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowVolumePopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mute toggle
  const handleVolumeDoubleClick = (e) => {
    e.stopPropagation(); 
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-28 bg-[#121212] border-t border-[#2a2a2a] z-50 flex flex-col justify-center px-6 backdrop-blur-lg bg-opacity-95"
      onDoubleClick={(e) => e.stopPropagation()} 
    >
      
      {/* Top Row: Progress Slider */}
      <div className="w-full flex items-center gap-4 mb-2 pt-2 select-none">
        <span className="text-xs font-mono text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>

        {/* Custom Slider */}
        <div className="relative w-full h-6 flex items-center group cursor-pointer">
          <div className="absolute w-full h-1.5 bg-[#333] rounded-full overflow-hidden"></div>
          <div className="absolute h-1.5 bg-linear-to-r from-red-600 to-red-500 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
          
          {/* Thumb of Slider */}
          <div className="absolute h-6 w-6 -ml-3 flex items-center justify-center top-0" style={{ left: `${(currentTime / duration) * 100}%` }}>
             <div className="bg-white rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-200 ease-out
                w-4 h-4
                group-hover:w-5 group-hover:h-5
                group-active:w-5 group-active:h-5
             ">
                <div className="bg-red-600 rounded-full transition-all duration-150 ease-in-out
                  w-0 h-0
                  group-hover:w-3 group-hover:h-3
                  group-active:w-2.5 group-active:h-2.5
                "></div>
             </div>
          </div> 
          
          <input type="range" min="0" max={duration} value={currentTime} onChange={(e) => setCurrentTime(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
        </div>

        <span className="text-xs font-mono text-gray-400 w-10">{formatTime(duration)}</span>
      </div>


      {/* Bottom Row: Controls */}
      <div className="flex items-center justify-between w-full h-full pb-2">
        
        {/* Song Info */}
        <div className="flex items-center w-[30%] min-w-45">
          <div className="w-12 h-12 bg-linear-to-br from-gray-800 to-black rounded-md mr-3 flex items-center justify-center border border-gray-700 shadow-lg group cursor-pointer hover:border-red-500/50 transition-colors">
            <span className="text-[10px] text-gray-500 font-bold group-hover:text-red-500">ART</span>
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-white font-medium text-sm truncate hover:underline cursor-pointer">London View</h4>
            <p className="text-gray-400 text-xs truncate hover:text-white cursor-pointer">Pressplay Media</p>
          </div>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center justify-center gap-6 w-[40%]">
            <ShuffleIcon size={18} className="text-gray-400 hover:text-white" />
            <PreviousIcon size={22} />
            <PlayPauseButton isPlaying={isPlaying} onClick={togglePlay} size={48} />
            <NextIcon size={22} />
            <RepeatIcon size={18} className="text-gray-400 hover:text-white" />
        </div>

        {/* Volume & Tools */}
        <div className="flex items-center justify-end w-[30%] min-w-45 gap-4 text-gray-400 relative">
          <ListMusic size={20} className="hover:text-white cursor-pointer" />
          
          <div className="relative flex items-center" ref={popupRef}>
            
            {/* Volume Popup */}
            {showVolumePopup && (
              <div className="absolute bottom-14 -left-3 bg-[#1e1e1e] p-3 rounded-2xl shadow-2xl border border-[#333] flex flex-col items-center gap-3 w-12 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                 <span className="text-[10px] font-bold text-white mb-1">{volume}</span>
                 
                 <div className="relative h-24 w-1.5 bg-[#333] rounded-full group cursor-pointer flex justify-center">
                    <div className="absolute bottom-0 w-full bg-red-600 rounded-full" style={{ height: `${volume}%` }}></div>
                    
                    {/* Vertical Thumb of Sound */}
                    <div className="absolute w-6 h-6 flex items-center justify-center -mb-2" style={{ bottom: `${volume}%` }}>
                       <div className="bg-white rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-200 ease-out w-4 h-4 group-hover:w-5 group-hover:h-5 group-active:w-5 group-active:h-3.5">
                          <div className="bg-red-600 rounded-full transition-all duration-150 ease-in-out w-0 h-0 group-hover:w-2.5 group-hover:h-2.5 group-active:w-1.5 group-active:h-2"></div>
                       </div>
                    </div>
                    
                    <input 
                      type="range" min="0" max="100" value={volume} onChange={handleVolumeChange}
                      className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-20"
                      style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
                    />
                 </div>
              </div>
            )}

            <button 
              onClick={(e) => { e.stopPropagation(); setShowVolumePopup(!showVolumePopup); }}
              onDoubleClick={handleVolumeDoubleClick}
              className="hover:text-white focus:outline-none transition-colors p-2 rounded-full hover:bg-white/5 active:scale-95"
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          
          <Maximize2 size={18} className="hover:text-white cursor-pointer ml-2" />
          <MoreHorizontal size={20} className="hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
}