"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlayer } from "../../context/PlayerContext";
import { Play, ListMusic, ArrowLeft, Shuffle, Trash2 } from "lucide-react";

export default function SinglePlaylistView() {
    const params = useParams();
    const router = useRouter();
    const { playTrack, currentTrack, isPlaying } = usePlayer();

    const [playlist, setPlaylist] = useState(null);
    const [playlistTracks, setPlaylistTracks] = useState([]);

    useEffect(() => {
        const loadPlaylistData = () => {
            const allPlaylists = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
            const allMusics = JSON.parse(localStorage.getItem("userMusics") || "[]");

            const currentPlaylist = allPlaylists.find(p => p.id === params.id);
            if (currentPlaylist) {
                setPlaylist(currentPlaylist);
                const tracksInPlaylist = currentPlaylist.songs
                    .map(songId => allMusics.find(m => m.id === songId))
                    .filter(Boolean);
                setPlaylistTracks(tracksInPlaylist);
            }
        };

        loadPlaylistData();
        window.addEventListener("storage", loadPlaylistData);
        return () => window.removeEventListener("storage", loadPlaylistData);
    }, [params.id]);

    const handlePlayAll = () => {
        if (playlistTracks.length > 0) playTrack(playlistTracks[0], playlistTracks);
    };

    const handleShufflePlay = () => {
        if (playlistTracks.length > 0) {
            const shuffled = [...playlistTracks].sort(() => Math.random() - 0.5);
            playTrack(shuffled[0], shuffled);
        }
    };

    const handleRemoveFromPlaylist = (e, trackId) => {
        e.stopPropagation();
        const allPlaylists = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
        const playlistIndex = allPlaylists.findIndex(p => p.id === params.id);

        if (playlistIndex !== -1) {
            allPlaylists[playlistIndex].songs = allPlaylists[playlistIndex].songs.filter(id => id !== trackId);
            localStorage.setItem("userCustomPlaylists", JSON.stringify(allPlaylists));
            window.dispatchEvent(new Event("storage"));
        }
    };

    if (!playlist) return <div className="p-8 text-white">Loading playlist...</div>;

    return (
        <div className="flex flex-col h-full min-h-screen" style={{ background: "#0a0a0f", color: "#e2e0e8" }}>
            <div className="px-8 pt-8 pb-6 bg-linear-to-b from-red-900/20 to-transparent">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="flex items-end gap-6 mb-8">
                    <div className="w-40 h-40 rounded-2xl flex items-center justify-center shadow-2xl bg-linear-to-br from-red-600 to-red-900">
                        <ListMusic size={64} color="#fff" className="opacity-80" />
                    </div>
                    <div className="flex-1 pb-2">
                        <p className="text-xs font-bold tracking-widest text-red-500 uppercase mb-2">Playlist</p>
                        <h1 className="text-5xl font-black text-white mb-4 tracking-tight">{playlist.name}</h1>
                        <p className="text-gray-400 font-medium">{playlistTracks.length} tracks • Created {playlist.createdAt || 'Recently'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={handlePlayAll} disabled={playlistTracks.length === 0} className="w-14 h-14 bg-red-600 hover:bg-red-500 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-900/50 transition-all">
                        <Play size={24} fill="currentColor" className="ml-1" />
                    </button>
                    <button onClick={handleShufflePlay} disabled={playlistTracks.length === 0} className="p-4 text-gray-300 hover:text-white disabled:opacity-50 transition-colors bg-white/5 hover:bg-white/10 rounded-full">
                        <Shuffle size={24} />
                    </button>
                </div>
            </div>

            <div className="flex-1 px-8 pb-8 overflow-y-auto">
                <div className="flex flex-col gap-1">
                    {playlistTracks.map((track, index) => {
                        const isThisPlaying = currentTrack?.id === track.id;
                        return (
                            <div key={track.id + index} onClick={() => playTrack(track, playlistTracks)} className={`group relative flex items-center p-3 rounded-xl transition-all cursor-pointer border ${isThisPlaying ? 'bg-red-500/10 border-red-500/20' : 'hover:bg-white/5 border-transparent'}`}>
                                <div className="w-10 text-center text-gray-500 text-sm font-mono shrink-0 relative flex justify-center items-center">
                                    {isThisPlaying && isPlaying ? (
                                        <div className="flex gap-0.5 items-end h-3">
                                            <span className="w-0.5 bg-red-500 animate-bounce h-2"></span>
                                            <span className="w-0.5 bg-red-500 animate-[bounce_1.2s_infinite] h-3"></span>
                                            <span className="w-0.5 bg-red-500 animate-[bounce_0.8s_infinite] h-1.5"></span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className={`${isThisPlaying ? 'hidden' : 'group-hover:hidden'}`}>{index + 1}</span>
                                            <Play size={14} className={`hidden ${isThisPlaying ? 'block text-red-500' : 'group-hover:block text-white'} mx-auto`} fill="currentColor" />
                                        </>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 pr-4 ml-4">
                                    <h3 className={`font-medium text-sm truncate ${isThisPlaying ? 'text-red-400' : 'text-gray-200 group-hover:text-white'}`}>{track.name}</h3>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => handleRemoveFromPlaylist(e, track.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="w-16 text-right text-xs text-gray-500 font-mono pl-4">{track.duration || "0:00"}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}