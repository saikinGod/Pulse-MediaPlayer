"use client";
import { useState, useEffect } from "react";
import { Music, Search, Trash2, Heart, ListPlus, ListMusic } from "lucide-react";
import UploadButton from "../components/UploadButton";
import Swal from 'sweetalert2';
import AddToPlaylistModal from "../components/AddToPlaylistModal";

export default function MusicLibrary() {
    const [searchQuery, setSearchQuery] = useState("");
    const [tracks, setTracks] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // Modal State
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [selectedTrackId, setSelectedTrackId] = useState(null);

    // Helper: Check "Smart" Favourite Names
    const isFavPlaylist = (name) => {
        const magicWords = ["fav", "favs", "favorite", "favorites", "favourite", "favourites"];
        return magicWords.includes(name.toLowerCase().trim());
    };

    // Fetch Data
    const fetchMusic = () => {
        const savedData = localStorage.getItem("userMusics");
        if (savedData) {
            setTracks(JSON.parse(savedData));
        }

        const savedPlaylists = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
        const favPlaylist = savedPlaylists.find(p => isFavPlaylist(p.name));

        if (favPlaylist && favPlaylist.songs) {
            setFavorites(favPlaylist.songs);
        } else {
            setFavorites([]);
        }
    };

    useEffect(() => {
        fetchMusic();
        window.addEventListener("storage", fetchMusic);
        return () => window.removeEventListener("storage", fetchMusic);
    }, []);

    // Add to Playlist Modal Handler
    const openAddToPlaylist = (trackId) => {
        setSelectedTrackId(trackId);
        setIsPlaylistModalOpen(true);
    };

    // Add to Play Queue Logic (Local Storage)
    const addToQueue = (track) => {
        const currentQueue = JSON.parse(localStorage.getItem("pulseQueue") || "[]");

        // Duplicate check
        const exists = currentQueue.some(t => t.id === track.id);
        if (exists) {
            const Toast = Swal.mixin({
                toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000,
                background: '#18181b', color: '#fff'
            });
            Toast.fire({ icon: 'info', title: 'Already in Queue' });
            return;
        }

        currentQueue.push(track);
        localStorage.setItem("pulseQueue", JSON.stringify(currentQueue));

        // Notify System
        window.dispatchEvent(new Event("storage"));

        // Success Toast
        const Toast = Swal.mixin({
            toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000,
            background: '#18181b', color: '#fff'
        });
        Toast.fire({ icon: 'success', title: 'Added to Queue' });
    };

    // Toggle Heart
    const toggleHeart = (trackId) => {
        let playlists = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
        let favIndex = playlists.findIndex(p => isFavPlaylist(p.name));

        if (favIndex === -1) {
            const newFav = {
                id: "fav-auto-" + Date.now(),
                name: "Favourites",
                createdAt: new Date().toLocaleDateString(),
                songs: [trackId]
            };
            playlists.unshift(newFav);
            setFavorites([trackId]);
        } else {
            let songList = playlists[favIndex].songs || [];
            if (songList.includes(trackId)) {
                songList = songList.filter(id => id !== trackId);
                setFavorites(prev => prev.filter(id => id !== trackId));
            } else {
                songList.push(trackId);
                setFavorites(prev => [...prev, trackId]);
            }
            playlists[favIndex].songs = songList;
        }

        localStorage.setItem("userCustomPlaylists", JSON.stringify(playlists));
        window.dispatchEvent(new Event("storage"));
    };

    // Delete Track
    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Song?",
            text: "It will be removed from all playlists too.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#4b5563",
            background: "#18181b",
            color: "#fff"
        }).then((result) => {
            if (result.isConfirmed) {
                const savedData = JSON.parse(localStorage.getItem("userMusics") || "[]");
                const updatedData = savedData.filter(item => item.id !== id);
                localStorage.setItem("userMusics", JSON.stringify(updatedData));
                fetchMusic();
                Swal.fire({ title: "Deleted!", icon: "success", background: "#18181b", color: "#fff", confirmButtonColor: "#dc2626" });
            }
        });
    };

    const filteredTracks = tracks.filter(track =>
        track.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full min-h-screen relative" style={{ background: "#0a0a0f", color: "#e2e0e8" }}>

            {/* MODAL */}
            <AddToPlaylistModal
                isOpen={isPlaylistModalOpen}
                onClose={() => setIsPlaylistModalOpen(false)}
                trackId={selectedTrackId}
            />

            {/* TWITTER HEART CSS */}
            <style jsx global>{`
                .heart-btn { position: relative; }
                .heart-btn::before, .heart-btn::after {
                    content: ""; position: absolute; top: 50%; left: 50%; border-radius: 50%;
                    width: 100%; height: 100%; transform: translate(-50%, -50%) scale(0); pointer-events: none;
                }
                .heart-btn.is-active svg {
                    fill: #e0245e; stroke: #e0245e;
                    animation: heart-bounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .heart-btn.is-active::before { animation: sparkles-burst 0.6s ease-out; }
                @keyframes heart-bounce {
                    0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); }
                }
                @keyframes sparkles-burst {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; box-shadow: 0 -18px 0 -3px #ff2a6d, 14px -10px 0 -3px #05d9e8, 14px 10px 0 -3px #ff2a6d, 0 18px 0 -3px #05d9e8, -14px 10px 0 -3px #ff2a6d, -14px -10px 0 -3px #05d9e8; }
                    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; box-shadow: 0 -30px 0 -3px transparent, 24px -18px 0 -3px transparent, 24px 18px 0 -3px transparent, 0 30px 0 -3px transparent, -24px 18px 0 -3px transparent, -24px -18px 0 -3px transparent; }
                }
            `}</style>

            {/* Top Bar */}
            <div className="flex justify-end p-6">
                <UploadButton type={"music"} />
            </div>

            {/* Header */}
            <div className="shrink-0 px-8 pb-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20"
                        style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}>
                        <Music size={40} color="#fff" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Music Library</h1>
                        <p className="text-gray-400 text-sm font-medium">
                            {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'} available
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="flex gap-4">
                    <div className="relative flex-1 group">
                        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your tracks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-red-500/20"
                            style={{ background: "rgba(30,41,59,0.3)", border: "1px solid rgba(71,85,105,0.3)", color: "#e2e0e8" }}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-8 pb-8 overflow-y-auto">
                {filteredTracks.length > 0 ? (
                    <div className="grid gap-3">
                        {filteredTracks.map((track) => {
                            const isLiked = favorites.includes(track.id);

                            return (
                                <div
                                    key={track.id}
                                    className="group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.005] hover:bg-[#1f1f25]"
                                    style={{ background: "rgba(30,41,59,0.2)", border: "1px solid rgba(255,255,255,0.03)" }}
                                >
                                    <div className="flex items-center gap-5 overflow-hidden">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors group-hover:bg-red-600/20 bg-[#2a2a35] text-gray-400 group-hover:text-red-500">
                                            <Music size={20} />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <h3 className="text-base font-semibold text-gray-100 truncate mb-0.5">{track.name}</h3>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span>{track.duration || "0:00"}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                <span>{track.size}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                <span>{track.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">

                                        {/* HEART BUTTON (Favourites) */}
                                        <button
                                            onClick={() => toggleHeart(track.id)}
                                            className={`
                                                heart-btn p-2.5 rounded-full transition-colors
                                                ${isLiked ? 'is-active' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                            `}
                                            title={isLiked ? "Unlike" : "Like"}
                                        >
                                            <Heart size={22} className="transition-all duration-300" />
                                        </button>

                                        {/* ADD TO PLAYLIST BUTTON */}
                                        <button
                                            onClick={() => openAddToPlaylist(track.id)}
                                            className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                            title="Add to Custom Playlist"
                                        >
                                            <ListPlus size={22} />
                                        </button>

                                        {/* ADD TO QUEUE BUTTON */}
                                        <button
                                            onClick={() => addToQueue(track)}
                                            className="p-2.5 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                            title="Add to Play Queue"
                                        >
                                            <ListMusic size={22} />
                                        </button>

                                        {/* DELETE BUTTON */}
                                        <button
                                            onClick={() => handleDelete(track.id)}
                                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete track"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-60 mt-10">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gray-800/50">
                            <Music size={40} className="text-gray-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">No music found</h2>
                        <p className="text-gray-500">Upload songs to start your journey.</p>
                    </div>
                )}
            </div>
        </div>
    );
}