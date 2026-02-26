"use client";
import { useState, useEffect } from "react";
import { Video, Search, Trash2, Play, ListVideo, Film } from "lucide-react";
import UploadButton from "../components/UploadButton";
import Swal from 'sweetalert2';

import { usePlayer } from "../context/PlayerContext";

export default function VideoLibrary() {
    const [searchQuery, setSearchQuery] = useState("");
    const [videos, setVideos] = useState([]);

    const { playTrack, currentTrack, isPlaying } = usePlayer();

    const fetchVideos = () => {
        const savedData = localStorage.getItem("userVideos");
        if (savedData) setVideos(JSON.parse(savedData));
    };

    useEffect(() => {
        fetchVideos();
        window.addEventListener("storage", fetchVideos);
        return () => window.removeEventListener("storage", fetchVideos);
    }, []);

    const addToQueue = (video) => {
        const currentQueue = JSON.parse(localStorage.getItem("pulseQueue") || "[]");
        if (currentQueue.some(t => t.id === video.id)) {
            const Toast = Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000, background: '#18181b', color: '#fff' });
            Toast.fire({ icon: 'info', title: 'Already in Queue' });
            return;
        }
        currentQueue.push(video);
        localStorage.setItem("pulseQueue", JSON.stringify(currentQueue));
        window.dispatchEvent(new Event("storage"));
        const Toast = Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000, background: '#18181b', color: '#fff' });
        Toast.fire({ icon: 'success', title: 'Video Added to Queue' });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Video?", text: "Cannot be undone.", icon: "warning", showCancelButton: true,
            confirmButtonColor: "#dc2626", cancelButtonColor: "#4b5563", background: "#18181b", color: "#fff"
        }).then((result) => {
            if (result.isConfirmed) {
                const savedData = JSON.parse(localStorage.getItem("userVideos") || "[]");
                localStorage.setItem("userVideos", JSON.stringify(savedData.filter((item) => item.id !== id)));

                const currentQueue = JSON.parse(localStorage.getItem("pulseQueue") || "[]");
                const newQueue = currentQueue.filter(item => item.id !== id);
                localStorage.setItem("pulseQueue", JSON.stringify(newQueue));

                fetchVideos();
                window.dispatchEvent(new Event("storage"));
                Swal.fire({ title: "Deleted!", icon: "success", background: "#18181b", color: "#fff", confirmButtonColor: "#dc2626" });
            }
        });
    };

    const filteredVideos = videos.filter((video) =>
        video.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full min-h-screen relative" style={{ background: "#0a0a0f", color: "#e2e0e8" }}>
            <div className="flex justify-end p-6">
                <UploadButton type={"video"} />
            </div>

            <div className="shrink-0 px-8 pb-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/20"
                        style={{ background: "linear-gradient(135deg, #4f46e5, #312e81)" }}>
                        <Film size={40} color="#fff" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Video Library</h1>
                        <p className="text-gray-400 text-sm font-medium">
                            {videos.length} {videos.length === 1 ? 'video' : 'videos'} available
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1 group">
                        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/20"
                            style={{ background: "rgba(30,41,59,0.3)", border: "1px solid rgba(71,85,105,0.3)", color: "#e2e0e8" }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 px-8 pb-8 overflow-y-auto">
                {filteredVideos.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {filteredVideos.map((video, index) => {
                            const isThisPlaying = currentTrack?.id === video.id;

                            return (
                                <div
                                    key={video.id}
                                    onClick={() => playTrack(video, filteredVideos)}
                                    className={`group relative flex items-center p-3 rounded-xl transition-all cursor-pointer border 
                                        ${isThisPlaying ? 'bg-indigo-500/10 border-indigo-500/20' : 'hover:bg-white/5 border-transparent hover:border-white/10'}`}
                                >
                                    <div className="w-10 text-center text-gray-500 text-sm font-mono shrink-0 relative flex justify-center items-center">
                                        {isThisPlaying && isPlaying ? (
                                            <div className="flex gap-0.5 items-end h-3">
                                                <span className="w-0.5 bg-indigo-500 animate-bounce h-2"></span>
                                                <span className="w-0.5 bg-indigo-500 animate-[bounce_1.2s_infinite] h-3"></span>
                                                <span className="w-0.5 bg-indigo-500 animate-[bounce_0.8s_infinite] h-1.5"></span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className={`${isThisPlaying ? 'hidden' : 'group-hover:hidden'}`}>{index + 1}</span>
                                                <Play size={14} className={`hidden ${isThisPlaying ? 'block text-indigo-500' : 'group-hover:block text-white'} mx-auto`} fill="currentColor" />
                                            </>
                                        )}
                                    </div>

                                    <div className="flex-1 flex items-center gap-4 min-w-0 pr-4">
                                        <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center shrink-0 text-gray-500 border border-white/5 shadow-inner">
                                            <Video size={18} className={isThisPlaying ? 'text-indigo-500' : ''} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className={`font-medium text-sm truncate transition-colors ${isThisPlaying ? 'text-indigo-400' : 'text-gray-200 group-hover:text-white'}`}>
                                                {video.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">{video.size || "Unknown Size"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); addToQueue(video); }} className="text-gray-400 hover:text-green-400 transition-colors p-2 hover:bg-green-400/10 rounded-lg" title="Add to Queue">
                                            <ListVideo size={18} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(video.id); }} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="w-16 text-right text-xs text-gray-500 font-mono pl-4">{video.duration || "0:00"}</div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gray-800/50">
                            <Film size={40} className="text-gray-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">{searchQuery ? "No matches found" : "Your Video Library is Empty"}</h2>
                        <p className="text-gray-500 max-w-xs mx-auto">Upload some .mp4 files to watch them in cinematic mode.</p>
                    </div>
                )}
            </div>
        </div>
    );
}