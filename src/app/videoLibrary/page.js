"use client";
import { useState, useEffect } from "react";
import { Video, Search, Trash2, Play, ListMusic, Heart } from "lucide-react";
import UploadButton from "../components/UploadButton";
import Swal from 'sweetalert2';

export default function VideoLibrary() {
    const [searchQuery, setSearchQuery] = useState("");
    const [videos, setVideos] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // Check Favourite Names
    const isFavPlaylist = (name) => {
        const magicWords = ["fav", "favs", "favorite", "favorites", "favourite", "favourites"];
        return magicWords.includes(name.toLowerCase().trim());
    };

    // Fetch Data
    const fetchVideos = () => {
        // Load Videos
        const savedData = localStorage.getItem("userVideos");
        if (savedData) {
            setVideos(JSON.parse(savedData));
        }

        // Load Favorites (Sync with Music Library)
        const savedPlaylists = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
        const favPlaylist = savedPlaylists.find(p => isFavPlaylist(p.name));

        if (favPlaylist && favPlaylist.songs) {
            setFavorites(favPlaylist.songs);
        } else {
            setFavorites([]);
        }
    };

    useEffect(() => {
        fetchVideos();
        window.addEventListener("storage", fetchVideos);
        return () => window.removeEventListener("storage", fetchVideos);
    }, []);

    // FAVOURITES LOGIC
    const toggleHeart = (videoId) => {
        let playlists = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
        let favIndex = playlists.findIndex(p => isFavPlaylist(p.name));

        if (favIndex === -1) {
            // Auto-create Favourites if not exists
            const newFav = {
                id: "fav-auto-" + Date.now(),
                name: "Favourites",
                createdAt: new Date().toLocaleDateString(),
                songs: [videoId]
            };
            playlists.unshift(newFav);
            setFavorites([videoId]);
        } else {
            // Toggle ID in existing playlist
            let songList = playlists[favIndex].songs || [];
            if (songList.includes(videoId)) {
                songList = songList.filter(id => id !== videoId);
                setFavorites(prev => prev.filter(id => id !== videoId));
            } else {
                songList.push(videoId);
                setFavorites(prev => [...prev, videoId]);
            }
            playlists[favIndex].songs = songList;
        }

        localStorage.setItem("userCustomPlaylists", JSON.stringify(playlists));
        window.dispatchEvent(new Event("storage"));
    };

    // ADD TO QUEUE 
    const addToQueue = (video) => {
        const currentQueue = JSON.parse(localStorage.getItem("pulseQueue") || "[]");

        // Check duplicate
        if (currentQueue.some(t => t.id === video.id)) {
            const Toast = Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000, background: '#18181b', color: '#fff' });
            Toast.fire({ icon: 'info', title: 'Already in Queue' });
            return;
        }

        currentQueue.push(video);
        localStorage.setItem("pulseQueue", JSON.stringify(currentQueue));
        window.dispatchEvent(new Event("storage"));

        const Toast = Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000, background: '#18181b', color: '#fff' });
        Toast.fire({ icon: 'success', title: 'Added to Queue' });
    };

    // DELETE VIDEO 
    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Video?", text: "Cannot be undone.", icon: "warning", showCancelButton: true,
            confirmButtonColor: "#dc2626", cancelButtonColor: "#4b5563", background: "#18181b", color: "#fff"
        }).then((result) => {
            if (result.isConfirmed) {
                const savedData = JSON.parse(localStorage.getItem("userVideos") || "[]");
                localStorage.setItem("userVideos", JSON.stringify(savedData.filter((item) => item.id !== id)));
                fetchVideos();
                Swal.fire({ title: "Deleted!", icon: "success", background: "#18181b", color: "#fff", confirmButtonColor: "#dc2626" });
            }
        });
    };

    const filteredVideos = videos.filter((video) =>
        video.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full min-h-screen relative" style={{ background: "#0a0a0f", color: "#e2e0e8" }}>

            {/* HEART ANIMATION  */}
            <style jsx global>{`
                .heart-btn { position: relative; }
                .heart-btn.is-active svg { fill: #e0245e; stroke: #e0245e; animation: heart-bounce 0.4s; }
                @keyframes heart-bounce { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
            `}</style>

            {/* Top Bar */}
            <div className="flex justify-end p-6">
                <UploadButton type={"video"} />
            </div>

            {/* Header */}
            <div className="shrink-0 px-8 pb-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20"
                        style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}>
                        <Video size={40} color="#fff" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Video Library</h1>
                        <p className="text-gray-400 text-sm font-medium">
                            {videos.length} {videos.length === 1 ? 'video' : 'videos'} available
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="flex gap-4">
                    <div className="relative flex-1 group">
                        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-red-500/20"
                            style={{ background: "rgba(30,41,59,0.3)", border: "1px solid rgba(71,85,105,0.3)", color: "#e2e0e8" }}
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-8 pb-8 overflow-y-auto">
                {filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVideos.map((video) => {
                            const isLiked = favorites.includes(video.id);

                            return (
                                <div
                                    key={video.id}
                                    className="group relative aspect-video bg-[#181818] rounded-xl border border-[#2a2a2a] overflow-hidden hover:border-red-500/50 transition-all shadow-lg hover:shadow-red-500/10 cursor-pointer"
                                >
                                    {/* Thumbnail Placeholder */}
                                    <div className="absolute inset-0 bg-linear-to-br from-[#2a2a35] to-[#121212] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                        <Video size={32} className="text-gray-600 opacity-50" />
                                    </div>

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                            <Play size={20} className="text-white ml-1" fill="currentColor" />
                                        </div>
                                    </div>

                                    {/* Info Bar & Actions */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/95 via-black/80 to-transparent">
                                        <div className="flex items-end justify-between">
                                            <div className="overflow-hidden mr-2">
                                                <h3 className="text-white font-medium text-sm truncate group-hover:text-red-100 transition-colors">{video.name}</h3>
                                                <p className="text-gray-400 text-xs mt-0.5 font-mono">{video.size} • {video.duration || "0:00"}</p>
                                            </div>

                                            {/* ACTIONS CONTAINER */}
                                            <div className="flex items-center gap-1">

                                                {/* HEART BUTTON (Fav) */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleHeart(video.id); }}
                                                    className={`heart-btn p-1.5 rounded-lg hover:bg-white/10 transition-colors ${isLiked ? 'is-active text-pink-500' : 'text-gray-400 hover:text-white'}`}
                                                    title={isLiked ? "Unlike" : "Like"}
                                                >
                                                    <Heart size={18} className="transition-all" />
                                                </button>

                                                {/* QUEUE BUTTON */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); addToQueue(video); }}
                                                    className="text-gray-400 hover:text-green-400 transition-colors p-1.5 hover:bg-green-400/10 rounded-lg"
                                                    title="Add to Queue"
                                                >
                                                    <ListMusic size={18} />
                                                </button>

                                                {/* DELETE BUTTON */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(video.id); }}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-60 mt-10">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gray-800/50">
                            <Video size={40} className="text-gray-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">
                            {searchQuery ? "No matches found" : "No videos yet"}
                        </h2>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            Upload videos to build your collection.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}