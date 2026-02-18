"use client";
import { useState, useEffect } from "react";
import { X, Music, Plus } from "lucide-react";

export default function AddToPlaylistModal({ isOpen, onClose, trackId }) {
    const [playlists, setPlaylists] = useState([]);

    // Load Playlists when modal opens
    useEffect(() => {
        if (isOpen) {
            const saved = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
            setPlaylists(saved);
        }
    }, [isOpen]);

    const handleAddToPlaylist = (playlistId) => {
        const saved = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
        const playlistIndex = saved.findIndex(p => p.id === playlistId);

        if (playlistIndex > -1) {
            // Check if song already exists
            if (saved[playlistIndex].songs.includes(trackId)) {
                alert("Song is already in this playlist!"); // Simple alert
                return;
            }

            // Add song ID
            saved[playlistIndex].songs.push(trackId);
            localStorage.setItem("userCustomPlaylists", JSON.stringify(saved));

            // Notify & Close
            window.dispatchEvent(new Event("storage")); // Refresh UI
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Add to Playlist</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
                </div>

                <div className="flex flex-col gap-2 max-h-75 overflow-y-auto pr-2">
                    {playlists.length > 0 ? (
                        playlists.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => handleAddToPlaylist(p.id)}
                                className="flex items-center gap-3 p-3 rounded-xl bg-[#27272a] hover:bg-[#3f3f46] transition-colors text-left group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-gray-400 group-hover:text-red-500 transition-colors">
                                    <Music size={18} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium text-sm">{p.name}</h3>
                                    <p className="text-xs text-gray-500">{p.songs.length} songs</p>
                                </div>
                                <Plus size={16} className="text-gray-500 group-hover:text-white" />
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No playlists found.<br />Go to Library to create one.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}