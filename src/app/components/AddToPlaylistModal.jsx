"use client";
import { useState, useEffect } from "react";
import { X, Plus, Music, ListMusic } from "lucide-react";
import Swal from "sweetalert2";

export default function AddToPlaylistModal({ isOpen, onClose, track }) {
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [showCreateInput, setShowCreateInput] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const savedPlaylists = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
            setPlaylists(savedPlaylists);
            setShowCreateInput(false);
            setNewPlaylistName("");
        }
    }, [isOpen]);

    if (!isOpen || !track) return null;

    const handleAddToPlaylist = (playlistId) => {
        let updatedPlaylists = [...playlists];
        const index = updatedPlaylists.findIndex(p => p.id === playlistId);

        if (index !== -1) {
            if (!updatedPlaylists[index].songs.includes(track.id)) {
                updatedPlaylists[index].songs.push(track.id);
                localStorage.setItem("userCustomPlaylists", JSON.stringify(updatedPlaylists));
                window.dispatchEvent(new Event("storage"));

                Swal.fire({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000, background: '#18181b', color: '#fff', icon: 'success', title: 'Added to Playlist' });
            } else {
                Swal.fire({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000, background: '#18181b', color: '#fff', icon: 'info', title: 'Already in Playlist' });
            }
        }
        onClose();
    };

    const handleCreatePlaylist = () => {
        if (!newPlaylistName.trim()) return;

        const newPlaylist = {
            id: "playlist-" + Date.now(),
            name: newPlaylistName.trim(),
            createdAt: new Date().toLocaleDateString(),
            songs: [track.id]
        };

        const updatedPlaylists = [newPlaylist, ...playlists];
        localStorage.setItem("userCustomPlaylists", JSON.stringify(updatedPlaylists));
        window.dispatchEvent(new Event("storage"));

        Swal.fire({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000, background: '#18181b', color: '#fff', icon: 'success', title: 'Playlist Created & Added' });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/80 backdrop-blur-md" onClick={onClose}>
            <div className="bg-[#0a0a0f] border border-red-500/20 w-full max-w-md rounded-2xl p-6 shadow-[0_0_50px_rgba(220,38,38,0.15)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Add to Playlist</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex items-center gap-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
                        <Music size={20} className="text-white" />
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="text-red-400 font-medium truncate">{track.name}</h4>
                        <p className="text-gray-400 text-xs truncate">Select a destination</p>
                    </div>
                </div>

                <div className="max-h-60 overflow-y-auto pr-2 mb-4 space-y-2 custom-scrollbar">
                    {playlists.map((playlist) => (
                        <button
                            key={playlist.id}
                            onClick={() => handleAddToPlaylist(playlist.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-left group"
                        >
                            <div className="w-10 h-10 bg-[#18181b] rounded flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                <ListMusic size={18} className="text-gray-500 group-hover:text-red-500" />
                            </div>
                            <div>
                                <span className="text-gray-200 block font-medium group-hover:text-white transition-colors">{playlist.name}</span>
                                <span className="text-xs text-gray-500 block">{playlist.songs.length} tracks</span>
                            </div>
                        </button>
                    ))}
                    {playlists.length === 0 && !showCreateInput && (
                        <p className="text-center text-gray-500 py-4 text-sm">No playlists found.</p>
                    )}
                </div>

                {!showCreateInput ? (
                    <button onClick={() => setShowCreateInput(true)} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium transition-all shadow-lg">
                        <Plus size={20} /> Create New Playlist
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Playlist name..."
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            autoFocus
                            className="flex-1 bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 transition-colors"
                        />
                        <button onClick={handleCreatePlaylist} className="bg-red-600 hover:bg-red-500 text-white px-5 rounded-xl font-medium transition-colors shadow-lg">
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}