"use client";
import { useState } from "react";
import { X, Plus, Music } from "lucide-react";
import { toast } from "react-toastify";

export default function CreatePlaylistModal({ isOpen, onClose, onPlaylistCreated }) {
    const [playlistName, setPlaylistName] = useState("");

    if (!isOpen) return null;

    const handleCreate = () => {
        if (!playlistName.trim()) {
            toast.error("Please enter a playlist name!", { theme: "dark" });
            return;
        }

        // Get existing playlists
        const existing = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");

        // Check for duplicate name
        if (existing.some(p => p.name.toLowerCase() === playlistName.toLowerCase())) {
            toast.error("Playlist with this name already exists!", { theme: "dark" });
            return;
        }

        // 3. Create new playlist object
        const newPlaylist = {
            id: Date.now(),
            name: playlistName,
            createdAt: new Date().toLocaleDateString(),
            songs: []
        };

        // Save to Local Storage
        const updated = [newPlaylist, ...existing];
        localStorage.setItem("userCustomPlaylists", JSON.stringify(updated));

        // Notify & Close
        toast.success(`Playlist "${playlistName}" created!`, { theme: "dark" });
        onPlaylistCreated();
        setPlaylistName("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Music className="text-red-500" size={24} />
                        New Playlist
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Playlist Name</label>
                    <input
                        type="text"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        placeholder="e.g. Late Night Vibe"
                        className="w-full bg-[#27272a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                        autoFocus
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-900/20"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}