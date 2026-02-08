"use client";
import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Music,
  Video,
  ListMusic,
  Library,
  Settings,
  Search,
  Menu,
  ChevronLeft,
  Upload,
} from "lucide-react";

export default function SideBar() {
  const router = useRouter();
  const closeTimeout = useRef(null);
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { name: "Home", icon: Home, url: "/" },
    { name: "Music library", icon: Music, url: "/musicLibrary" },
    { name: "Video library", icon: Video, url: "/videoLibrary" },
    { name: "Play queue", icon: ListMusic, url: "/playQueue" },
    { name: "Playlists", icon: Library, url: "/playlists" },
    { name: "Upload", icon: Upload, url: "/upload" },
  ];

  const handleNavClick = (url) => {
    router.push(url);
  };

  return (
    <aside
      className={`
    fixed md:relative z-50 h-screen bg-[#181818] border-r border-[#2a2a2a]
    flex flex-col transition-all duration-500 linear
    ${isExpanded ? "w-72" : "w-20"}
  `}
      onMouseEnter={() => {
        if (closeTimeout.current) {
          clearTimeout(closeTimeout.current);
          closeTimeout.current = null;
        }
      }}
      onMouseLeave={() => {
        closeTimeout.current = setTimeout(() => {
          setIsExpanded(false);
        }, 250);
      }}
    >
      {/* --- Top Section --- */}
      <div className="p-5 flex flex-col gap-6">
        {/* Toggle Button Row */}
        <div
          className={`flex items-center ${isExpanded ? "justify-between" : "justify-center"}`}
        >
          {/* Logo (Only visible when expanded) */}
          <div
            className={`flex items-center gap-3 transition-opacity duration-200 ${isExpanded ? "opacity-100 flex" : "opacity-0 hidden w-0"}`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              <img
                src="/favicon.ico"
                alt="Pulse"
                className="w-8 h-8 object-cover"
              />
            </div>
            <span className="font-bold text-white tracking-wide">Pulse</span>
          </div>

          {/* THE TOGGLE BUTTON */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            {isExpanded ? <ChevronLeft size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* --- Search Section --- */}
        <div className="relative group">
          {isExpanded ? (
            // Full Search Bar
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search
                  size={16}
                  className="text-gray-500 group-focus-within:text-red-500 transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-[#252525] text-gray-200 text-sm rounded-md py-2.5 pl-10 pr-4 outline-none border border-transparent focus:border-red-500/50 focus:bg-[#2a2a2a] transition-all"
              />
            </div>
          ) : (
            // Search Icon Button
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full flex justify-center py-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Search size={22} />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.url;
          return (
            <div key={item.name} className="relative group flex items-center">
              <button
                onClick={() => handleNavClick(item.url)}
                className={`
                  w-full flex items-center p-3 rounded-lg transition-all duration-200
                  ${isActive ? "bg-[#252525] text-white" : "text-gray-400 hover:bg-[#252525] hover:text-gray-200"}
                  ${isExpanded ? "justify-start gap-4" : "justify-center"}
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-red-600 rounded-r-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                )}
                <item.icon
                  size={22}
                  className={`${isActive ? "text-red-500" : "group-hover:text-gray-200"} transition-colors duration-200`}
                />
                <span
                  className={`whitespace-nowrap transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"}`}
                >
                  {item.name}
                </span>
              </button>

              {!isExpanded && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#252525] text-white text-xs rounded border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  {item.name}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#252525] border-l border-b border-gray-700 transform rotate-45"></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* --- Footer --- */}
      <div className="p-3 border-t mb-9.25 border-[#2a2a2a]">
        <div className="relative group flex items-center">
          <button
            onClick={() => router.push("/setting")}
            className={`
        w-full flex items-center p-3 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-all
        ${isExpanded ? "justify-start gap-4" : "justify-center"}
      `}
          >
            <Settings size={26} />
            <span className={`${isExpanded ? "block" : "hidden"}`}>
              Settings
            </span>
          </button>

          {!isExpanded && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-[#252525] text-white text-xs rounded border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Settings
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
