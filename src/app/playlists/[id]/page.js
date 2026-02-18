"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play, Clock, Trash2, Music, Heart, Shuffle, Video, Layers } from "lucide-react";
import Swal from 'sweetalert2';

export default function PlaylistView({ params }) {
    const playlistId = use(params).id;

    const router = useRouter();
    const [playlist, setPlaylist] = useState(null);
    const [playlistItems, setPlaylistItems] = useState([]); // All mixed items
    const [filteredItems, setFilteredItems] = useState([]); // Currently visible items
    const [totalDuration, setTotalDuration] = useState("0 mins");
    const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'audio', 'video'

    // Calculate Duration
    const calculateTotalDuration = (items) => {
        let totalSeconds = 0;
        items.forEach(item => {
            if (item.duration && item.duration.includes(":")) {
                const parts = item.duration.split(':').map(Number);
                if (parts.length === 2) {
                    totalSeconds += (parts[0] * 60) + parts[1];
                } else if (parts.length === 3) { // hr:min:sec
                    totalSeconds += (parts[0] * 3600) + (parts[1] * 60) + parts[2];
                }
            }
        });

        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);

        if (hrs > 0) return `${hrs} hr ${mins} min`;
        return `${mins} mins`;
    };

    // Fetch Data
    const fetchData = () => {
        // Load All Data Sources
        const allPlaylists = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
        const allMusic = JSON.parse(localStorage.getItem("userMusics") || "[]");
        const allVideos = JSON.parse(localStorage.getItem("userVideos") || "[]");

        // Combine Libraries for lookup
        const allMedia = [...allMusic, ...allVideos];

        // Find Current Playlist
        const currentPlaylist = allPlaylists.find(p => p.id.toString() === playlistId);

        if (currentPlaylist) {
            setPlaylist(currentPlaylist);

            // Find Items details
            const itemIds = currentPlaylist.songs || [];

            // Map IDs to real objects (preserve order)
            const items = itemIds.map(id => allMedia.find(m => m.id === id)).filter(Boolean);

            setPlaylistItems(items);

            // Apply Initial Filter
            applyFilter(activeFilter, items);
        } else {
            router.push("/playlists");
        }
    };

    // Filter Logic
    const applyFilter = (filterType, items = playlistItems) => {
        setActiveFilter(filterType);
        let filtered = [];

        if (filterType === "all") {
            filtered = items;
        } else {
            filtered = items.filter(item => item.fileType === filterType);
        }

        setFilteredItems(filtered);
        setTotalDuration(calculateTotalDuration(filtered));
    };

    useEffect(() => {
        fetchData();
        window.addEventListener("storage", fetchData);
        return () => window.removeEventListener("storage", fetchData);
    }, [playlistId]);

    // Remove Item
    const removeItem = (itemId) => {
        const allPlaylists = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
        const pIndex = allPlaylists.findIndex(p => p.id.toString() === playlistId);

        if (pIndex > -1) {
            allPlaylists[pIndex].songs = allPlaylists[pIndex].songs.filter(id => id !== itemId);
            localStorage.setItem("userCustomPlaylists", JSON.stringify(allPlaylists));

            // UI Update manually to avoid full reload flickers
            const updatedItems = playlistItems.filter(i => i.id !== itemId);
            setPlaylistItems(updatedItems);
            applyFilter(activeFilter, updatedItems);

            window.dispatchEvent(new Event("storage")); // Notify others

            const Toast = Swal.mixin({
                toast: true, position: 'bottom-end', showConfirmButton: false, timer: 1500,
                background: '#18181b', color: '#fff'
            });
            Toast.fire({ icon: 'success', title: 'Removed from playlist' });
        }
    };

    // Play Logic (Context Placeholder)
    const handlePlayAll = () => {

        const typeText = activeFilter === 'all' ? 'All items' : activeFilter === 'audio' ? 'Music' : 'Videos';

        // Add filteredItems to Play Queue
        localStorage.setItem("pulseQueue", JSON.stringify(filteredItems));
        window.dispatchEvent(new Event("storage"));

        const Toast = Swal.mixin({
            toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000,
            background: '#18181b', color: '#fff'
        });
        Toast.fire({ icon: 'success', title: `Queued ${filteredItems.length} ${typeText}` });
        router.push("/playQueue");
    };

    // Check Theme
    const isFav = (name) => ["fav", "favs", "favorite", "favorites", "favourite", "favourites"].includes(name?.toLowerCase().trim());
    if (!playlist) return <div className="min-h-screen bg-[#0a0a0f]" />;
    const isFavourites = isFav(playlist.name);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-200 font-sans pb-32">

            {/* HERO SECTION */}
            <div className={`relative h-80 flex items-end p-8 overflow-hidden`}>
                <div className={`absolute inset-0 opacity-20 blur-[100px] ${isFavourites ? 'bg-red-600' : 'bg-blue-600'}`} />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />

                <div className="relative z-10 flex items-end gap-6 w-full max-w-7xl mx-auto">
                    {/* Cover Art */}
                    <div className={`w-52 h-52 rounded-2xl shadow-2xl flex items-center justify-center shrink-0 border border-white/10 ${isFavourites ? 'bg-linear-to-br from-red-600 to-pink-800' : 'bg-linear-to-br from-blue-600 to-purple-800'}`}>
                        {isFavourites ? <Heart size={80} className="text-white fill-white/20" /> : <Layers size={80} className="text-white" />}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-2 mb-2">
                        <span className="text-xs font-bold tracking-wider uppercase bg-white/10 px-2 py-1 rounded w-fit backdrop-blur-md border border-white/5">
                            {isFavourites ? "System Collection" : "Custom Playlist"}
                        </span>
                        <h1 className="text-6xl font-black text-white tracking-tight drop-shadow-lg truncate max-w-2xl">{playlist.name}</h1>
                        <p className="text-gray-300 font-medium flex items-center gap-2 mt-2">
                            <span className="text-white">{filteredItems.length} items</span>
                            <span className="w-1 h-1 bg-gray-500 rounded-full" />
                            <span>{totalDuration}</span>
                        </p>
                    </div>
                </div>

                <button onClick={() => router.back()} className="absolute top-8 left-8 p-3 bg-black/20 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-all z-20 border border-white/5">
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* CONTROLS & LIST */}
            <div className="max-w-7xl mx-auto px-8 mt-8">

                {/* Action Bar */}
                <div className="flex items-center justify-between mb-8">
                    {/* Play Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handlePlayAll}
                            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${isFavourites ? 'bg-red-500 text-black shadow-red-500/20' : 'bg-blue-500 text-black shadow-blue-500/20'}`}
                        >
                            <Play size={28} fill="currentColor" className="ml-1" />
                        </button>
                        <button className="p-3 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10">
                            <Shuffle size={24} />
                        </button>
                    </div>

                    {/* Filter Tabs (The Smart Logic) */}
                    <div className="flex bg-[#18181b] p-1 rounded-xl border border-white/10">
                        {[
                            { id: 'all', label: 'All', icon: Layers },
                            { id: 'audio', label: 'Music', icon: Music },
                            { id: 'video', label: 'Videos', icon: Video }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => applyFilter(tab.id)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeFilter === tab.id
                                    ? (isFavourites ? 'bg-red-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg')
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon size={14} /> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List Header */}
                <div className="sticky top-0 bg-[#0a0a0f] z-20 flex items-center px-4 py-3 border-b border-white/10 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <div className="w-10 text-center">#</div>
                    <div className="flex-1">Title</div>
                    <div className="w-32 hidden md:block">Added</div>
                    <div className="w-20 text-center">Type</div>
                    <div className="w-16 flex justify-center"><Clock size={14} /></div>
                    <div className="w-12"></div>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-1">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="group flex items-center px-4 py-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">

                                {/* Index / Icon */}
                                <div className="w-10 text-center text-gray-500 text-sm font-mono shrink-0">
                                    <span className="group-hover:hidden">{index + 1}</span>
                                    <Play size={14} className="hidden group-hover:block mx-auto text-white" fill="currentColor" />
                                </div>

                                {/* Title & Info */}
                                <div className="flex-1 flex items-center gap-4 min-w-0 pr-4">
                                    <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center shrink-0 text-gray-500 border border-white/5">
                                        {item.fileType === 'video' ? <Video size={18} /> : <Music size={18} />}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className={`font-medium truncate ${isFavourites ? 'group-hover:text-red-400' : 'group-hover:text-blue-400'} text-gray-200`}>{item.name}</h3>
                                        <p className="text-xs text-gray-500 truncate">
                                            {item.fileType === 'video' ? 'Video File' : 'Unknown Artist'}
                                        </p>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="w-32 hidden md:block text-xs text-gray-500">{item.date}</div>

                                {/* Type Badge */}
                                <div className="w-20 text-center">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${item.fileType === 'video'
                                        ? 'text-purple-400 border-purple-400/20 bg-purple-400/10'
                                        : 'text-green-400 border-green-400/20 bg-green-400/10'
                                        }`}>
                                        {item.fileType === 'video' ? 'Video' : 'Music'}
                                    </span>
                                </div>

                                {/* Duration */}
                                <div className="w-16 text-center text-xs text-gray-500 font-mono">
                                    {item.duration || "0:00"}
                                </div>

                                {/* Remove Button */}
                                <div className="w-12 flex justify-end">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                        title="Remove from playlist"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-gray-500">
                            <Layers size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No {activeFilter === 'all' ? 'items' : activeFilter} found in this playlist.</p>
                            <button onClick={() => router.push("/musicLibrary")} className={`mt-4 text-sm font-medium hover:underline ${isFavourites ? 'text-red-500' : 'text-blue-500'}`}>Browse Library</button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}