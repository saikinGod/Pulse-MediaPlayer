"use client";
import { useState } from "react";
import { Music, Search, ArrowUpDown } from "lucide-react";

export default function MusicLibrary() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("recent");

    // Empty state - no tracks yet
    const tracks = [];

    return (
        <div className="flex flex-col h-full" style={{ background: "#0a0a0f", color: "#e2e0e8" }}>

            {/* Header */}
            <div className="shrink-0 px-6 pt-6 pb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}>
                        <Music size={32} color="#fff" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Music Library</h1>
                        <p className="text-gray-500 text-sm">{tracks.length} tracks available</p>
                    </div>
                </div>

                {/* Search & Sort Bar */}
                <div className="flex gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
                        <input
                            type="text"
                            placeholder="Search music..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                            style={{
                                background: "rgba(30,41,59,0.5)",
                                border: "1px solid rgba(71,85,105,0.3)",
                                color: "#e2e0e8",
                            }}
                        />
                    </div>

                    {/* Sort Button */}
                    <button
                        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                            background: "rgba(30,41,59,0.5)",
                            border: "1px solid rgba(71,85,105,0.3)",
                            color: "#e2e0e8",
                        }}
                    >
                        <ArrowUpDown size={16} />
                        Sort: Recent
                    </button>
                </div>
            </div>

            {/* Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                    style={{ background: "rgba(71,85,105,0.2)" }}>
                    <Music size={48} className="text-gray-600" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">No music yet</h2>
                <p className="text-gray-500">Upload some music to get started</p>
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