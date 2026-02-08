"use client";
import { useState } from "react";
import { Music, Plus, ChevronDown, Disc } from "lucide-react";

export default function Playlists() {
    const [sortBy, setSortBy] = useState("a-z");

    // Default empty playlist
    const playlists = [
        { id: 1, name: "New", items: 0, cover: null }
    ];

    return (
        <div className="flex flex-col h-full" style={{ background: "#0a0a0f", color: "#e2e0e8" }}>

            {/* Header */}
            <div className="shrink-0 px-6 pt-6 pb-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold text-white">Playlists</h1>

                    {/* Sort Dropdown */}
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                            background: "rgba(30,41,59,0.5)",
                            border: "1px solid rgba(71,85,105,0.3)",
                            color: "#dc2626",
                        }}
                    >
                        Sort by: A - Z
                        <ChevronDown size={16} />
                    </button>
                </div>

                {/* New Playlist Button */}
                <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                    style={{
                        background: "linear-gradient(135deg, #dc2626, #991b1b)",
                        color: "#fff",
                    }}
                >
                    <Plus size={18} />
                    New playlist
                </button>
            </div>

            {/* Playlists Grid */}
            <div className="flex-1 px-6 pb-6 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist.id}
                            className="group cursor-pointer"
                        >
                            {/* Playlist Cover */}
                            <div
                                className="aspect-square rounded-lg mb-3 flex items-center justify-center transition-all duration-200"
                                style={{
                                    background: "rgba(30,41,59,0.6)",
                                    border: "1px solid rgba(71,85,105,0.3)",
                                }}
                            >
                                <Disc size={64} className="text-gray-600" />
                            </div>

                            {/* Playlist Info */}
                            <div>
                                <h3 className="text-sm font-medium text-white mb-1">{playlist.name}</h3>
                                <p className="text-xs text-gray-500">{playlist.items} items</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Player Bar */}
            <div className="shrink-0 border-t px-6 py-4"
                style={{
                    background: "rgba(15,23,42,0.8)",
                    borderColor: "rgba(71,85,105,0.3)"
                }}>
                <p className="text-sm text-gray-600 text-center">No media playing</p>
            </div>
        </div>
    );
}