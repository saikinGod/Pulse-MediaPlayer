"use client";
import { useState, useEffect } from "react";
import {
    Play, Trash2, X, ListMusic, Video, Music,
    CheckSquare, Square, ArrowUp, MousePointer2
} from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';

export default function PlayQueue() {
    const router = useRouter();
    const [queue, setQueue] = useState([]);
    const [playingIndex, setPlayingIndex] = useState(null);
    const [selectedIndices, setSelectedIndices] = useState([]);

    // Load Queue
    const fetchQueue = () => {
        const savedQueue = JSON.parse(localStorage.getItem("pulseQueue") || "[]");
        setQueue(savedQueue);
        setSelectedIndices([]);
    };

    useEffect(() => {
        fetchQueue();
        window.addEventListener("storage", fetchQueue);
        return () => window.removeEventListener("storage", fetchQueue);
    }, []);

    // Selection Logic
    const toggleSelection = (index) => {
        if (selectedIndices.includes(index)) {
            setSelectedIndices(prev => prev.filter(i => i !== index));
        } else {
            setSelectedIndices(prev => [...prev, index]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIndices.length === queue.length) {
            setSelectedIndices([]);
        } else {
            setSelectedIndices(queue.map((_, i) => i));
        }
    };

    // Actions
    const removeSelected = () => {
        Swal.fire({
            title: `Remove ${selectedIndices.length} items?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#4b5563",
            background: "#18181b", color: "#fff"
        }).then((result) => {
            if (result.isConfirmed) {
                const newQueue = queue.filter((_, index) => !selectedIndices.includes(index));
                setQueue(newQueue);
                localStorage.setItem("pulseQueue", JSON.stringify(newQueue));
                setSelectedIndices([]);
                window.dispatchEvent(new Event("storage"));

                const Toast = Swal.mixin({
                    toast: true, position: 'bottom-end', showConfirmButton: false, timer: 1500,
                    background: '#18181b', color: '#fff'
                });
                Toast.fire({ icon: 'success', title: 'Removed selected items' });
            }
        });
    };

    const clearQueue = () => {
        Swal.fire({
            title: "Clear Queue?", icon: "warning", showCancelButton: true,
            confirmButtonColor: "#dc2626", cancelButtonColor: "#4b5563",
            background: "#18181b", color: "#fff"
        }).then((result) => {
            if (result.isConfirmed) {
                setQueue([]);
                setSelectedIndices([]);
                localStorage.setItem("pulseQueue", "[]");
                window.dispatchEvent(new Event("storage"));
                Swal.fire({ title: "Cleared!", icon: "success", background: "#18181b", color: "#fff", confirmButtonColor: "#dc2626" });
            }
        });
    };

    const handlePlay = (index) => {
        setPlayingIndex(index);
        const Toast = Swal.mixin({
            toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000,
            background: '#18181b', color: '#fff'
        });
        Toast.fire({ icon: 'success', title: `Now Playing: ${queue[index].name}` });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-200 font-sans p-8 pb-32">

            {/* HEADER AREA*/}
            <div className="mb-8 border-b border-white/5 pb-6">

                {/* Title */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-linear-to-br from-red-600 to-pink-700 flex items-center justify-center shadow-lg shadow-red-900/20">
                        <ListMusic size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Play Queue</h1>
                        <p className="text-gray-400 font-medium text-xs mt-1 uppercase tracking-wider flex items-center gap-2">
                            {queue.length} Tracks
                            {selectedIndices.length > 0 && (
                                <>
                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                    <span className="text-red-400 font-bold">{selectedIndices.length} Selected</span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* DYNAMIC TOOLBAR */}
                {queue.length > 0 && (
                    <div className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-300 ${selectedIndices.length > 0 ? 'bg-[#18181b] border-red-500/20 shadow-lg shadow-red-900/10' : 'bg-transparent border-transparent'}`}>

                        <div className="flex items-center gap-3 px-2 h-10">
                            {selectedIndices.length > 0 && (
                                <button
                                    onClick={toggleSelectAll}
                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
                                >
                                    <CheckSquare size={18} className="text-red-500" />
                                    {selectedIndices.length === queue.length ? "Deselect All" : "Select All"}
                                </button>
                            )}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2">
                            {selectedIndices.length > 0 ? (
                                <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors">
                                        <ArrowUp size={16} /> Play Next
                                    </button>
                                    <button onClick={removeSelected} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-red-600/20">
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                            ) : (
                                // DEFAULT MODE
                                <div className="flex items-center gap-2">
                                    <button onClick={() => router.push("/musicLibrary")} className="flex items-center gap-2 px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg font-medium transition-colors text-sm">
                                        <Music size={16} /> Add Music
                                    </button>
                                    <button onClick={() => router.push("/videoLibrary")} className="flex items-center gap-2 px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg font-medium transition-colors text-sm">
                                        <Video size={16} /> Add Video
                                    </button>
                                    <button onClick={clearQueue} className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-all text-sm font-medium">
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* LIST SECTION */}
            <div className="flex flex-col gap-1 select-none">
                {queue.length > 0 ? (
                    queue.map((track, index) => {
                        const isPlaying = playingIndex === index;
                        const isSelected = selectedIndices.includes(index);

                        return (
                            <div
                                key={`${track.id}-${index}`}
                                onClick={() => handlePlay(index)}
                                className={`group flex items-center p-2 rounded-lg border transition-all cursor-pointer relative overflow-hidden
                  ${isSelected
                                        ? "bg-[#202023] border-red-500/30"
                                        : isPlaying
                                            ? "bg-[#1f1f23] border-white/5"
                                            : "bg-transparent hover:bg-[#18181b] border-transparent hover:border-white/5"
                                    }`}
                            >
                                {/* CHECKBOX AREA (On Hover) */}
                                <div
                                    className="w-12 flex justify-center items-center relative z-10"
                                    onClick={(e) => { e.stopPropagation(); toggleSelection(index); }}
                                >
                                    {/* Selected -> Always show Checkbox */}
                                    {isSelected ? (
                                        <CheckSquare size={18} className="text-red-500" />
                                    ) : (
                                        <>
                                            {/* Not Selected -> Show Number/Play Animation */}
                                            <div className="group-hover:hidden flex items-center justify-center">
                                                {isPlaying ? (
                                                    <div className="flex gap-0.5 justify-center items-end h-3">
                                                        <span className="w-0.5 bg-red-500 animate-bounce h-2"></span>
                                                        <span className="w-0.5 bg-red-500 animate-[bounce_1.2s_infinite] h-3"></span>
                                                        <span className="w-0.5 bg-red-500 animate-[bounce_0.8s_infinite] h-1.5"></span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-mono text-gray-500">{index + 1}</span>
                                                )}
                                            </div>

                                            {/* Hover -> Show Empty Checkbox */}
                                            <Square
                                                size={18}
                                                className="text-gray-600 hidden group-hover:block hover:text-white transition-colors"
                                            />
                                        </>
                                    )}
                                </div>

                                {/* Type Icon */}
                                <div className="mr-4 text-gray-500">
                                    {track.fileType === 'video' ? <Video size={16} /> : <Music size={16} />}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 flex items-center gap-4">
                                    <h3 className={`font-medium truncate text-sm ${isPlaying || isSelected ? "text-white" : "text-gray-300"}`}>
                                        {track.name}
                                    </h3>
                                    <span className="hidden md:inline text-xs text-gray-600 truncate max-w-37.5">
                                        Unknown Artist
                                    </span>
                                </div>

                                {/* Duration */}
                                <div className="text-xs text-gray-500 font-mono w-16 text-right pr-4">
                                    {track.duration || "0:00"}
                                </div>

                            </div>
                        );
                    })
                ) : (
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-gray-800 rounded-2xl bg-[#121214]/50">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-red-500 blur-2xl opacity-10 rounded-full"></div>
                            <ListMusic size={64} className="text-gray-700 relative z-10" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Queue is Empty</h2>
                        <p className="text-gray-500 max-w-sm mb-8">
                            Your queue is waiting for some tunes. Add songs or videos from your library.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => router.push("/musicLibrary")}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-900/20 active:scale-95"
                            >
                                <Music size={20} /> Browse Music
                            </button>
                            <button
                                onClick={() => router.push("/videoLibrary")}
                                className="flex items-center gap-2 px-6 py-3 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-xl font-medium transition-all active:scale-95"
                            >
                                <Video size={20} /> Browse Videos
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}