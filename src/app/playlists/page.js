"use client";
import { useState, useEffect } from "react";
// useRouter imported
import { useRouter } from "next/navigation";
import { Link as LinkIcon, Trash2, Plus, Music, ListMusic, FolderPlus, Play, Heart } from "lucide-react";
import Link from "next/link";
import CreatePlaylistModal from "../components/CreatePlaylistModal";
import Swal from 'sweetalert2';

export default function Playlists() {
    // Router initialized
    const router = useRouter();

    const [links, setLinks] = useState([]);
    const [customPlaylists, setCustomPlaylists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch Data
    const fetchData = () => {
        const savedUploads = localStorage.getItem("pulse_media_uploads");
        if (savedUploads) {
            setLinks(JSON.parse(savedUploads).filter((item) => item.type === "url"));
        }

        let savedPlaylists = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
        const isInitialized = localStorage.getItem("pulse_init_done");

        if (!isInitialized) {
            const hasFav = savedPlaylists.some(p => p.name === "Favourites");
            if (!hasFav) {
                const defaultPlaylist = {
                    id: "fav-default",
                    name: "Favourites",
                    createdAt: new Date().toLocaleDateString(),
                    songs: []
                };
                savedPlaylists = [defaultPlaylist, ...savedPlaylists];
                localStorage.setItem("userCustomPlaylists", JSON.stringify(savedPlaylists));
            }
            localStorage.setItem("pulse_init_done", "true");
        }
        setCustomPlaylists(savedPlaylists);
    };

    useEffect(() => {
        fetchData();
        window.addEventListener("storage", fetchData);
        return () => window.removeEventListener("storage", fetchData);
    }, []);

    const deleteLink = (id) => {
        Swal.fire({
            title: "Remove Link?", text: "Irreversible action!", icon: "warning",
            showCancelButton: true, confirmButtonColor: "#dc2626", cancelButtonColor: "#4b5563",
            background: "#18181b", color: "#fff"
        }).then((result) => {
            if (result.isConfirmed) {
                const savedData = JSON.parse(localStorage.getItem("pulse_media_uploads") || "[]");
                localStorage.setItem("pulse_media_uploads", JSON.stringify(savedData.filter(i => i.id !== id)));
                fetchData();
                Swal.fire({ title: "Deleted!", icon: "success", background: "#18181b", color: "#fff", confirmButtonColor: "#dc2626" });
            }
        });
    };

    const deletePlaylist = (id) => {
        Swal.fire({
            title: "Delete Playlist?", text: "Songs inside won't be deleted, just the folder.", icon: "warning",
            showCancelButton: true, confirmButtonColor: "#dc2626", cancelButtonColor: "#4b5563",
            background: "#18181b", color: "#fff"
        }).then((result) => {
            if (result.isConfirmed) {
                const saved = JSON.parse(localStorage.getItem("userCustomPlaylists") || "[]");
                localStorage.setItem("userCustomPlaylists", JSON.stringify(saved.filter(p => p.id !== id)));
                fetchData();
                Swal.fire({ title: "Deleted!", icon: "success", background: "#18181b", color: "#fff", confirmButtonColor: "#dc2626" });
            }
        });
    };

    const getFavicon = (url) => { try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`; } catch (e) { return null; } };

    return (
        <div className="min-h-screen bg-[#0a0a0f] p-8 pb-32 text-gray-200 font-sans relative overflow-hidden">
            <CreatePlaylistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPlaylistCreated={fetchData} />

            <div className="relative z-10 flex items-end justify-between mb-12 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-3 drop-shadow-lg">
                        <ListMusic className="text-red-500" size={40} /> Your Collections
                    </h1>
                </div>
            </div>

            <div className="relative z-10 mb-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Heart className="text-red-500 fill-red-500/20" size={24} /> My Playlists
                    </h2>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-red-600/20 transition-all">
                        <FolderPlus size={18} /> Create New
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <button onClick={() => setIsModalOpen(true)} className="group aspect-square rounded-2xl border-2 border-dashed border-gray-800 hover:border-red-500/50 flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-red-400 transition-all bg-[#121214] hover:bg-[#1a1a1e]">
                        <div className="w-14 h-14 rounded-full bg-[#1e1e24] flex items-center justify-center group-hover:scale-110 group-hover:bg-red-500/20 transition-all border border-white/5">
                            <Plus size={28} className="text-gray-400 group-hover:text-red-500" />
                        </div>
                        <span className="font-semibold text-sm tracking-wide">NEW PLAYLIST</span>
                    </button>

                    {customPlaylists.map(playlist => (
                        <div
                            key={playlist.id}

                            onClick={() => router.push(`/playlists/${playlist.id}`)}
                            className="group relative aspect-square bg-[#121214] rounded-2xl border border-white/5 p-5 flex flex-col justify-between hover:bg-[#1a1a1e] transition-all overflow-hidden hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-900/10 hover:-translate-y-1 cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/90 pointer-events-none" />
                            <button onClick={(e) => { e.stopPropagation(); deletePlaylist(playlist.id); }} className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-md scale-90 hover:scale-100 border border-white/10">
                                <Trash2 size={16} />
                            </button>
                            {playlist.name === "Favourites" ? (
                                <Heart size={140} className="absolute -bottom-6 -right-6 text-red-500/20 transform rotate-12" />
                            ) : (
                                <Music size={140} className="absolute -bottom-6 -right-6 text-white/5 group-hover:text-red-500/10 transition-colors transform rotate-12" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/40 transform scale-50 group-hover:scale-100 transition-transform">
                                    <Play size={24} fill="white" className="ml-1 text-white" />
                                </div>
                            </div>
                            <div className="relative mt-auto z-20">
                                <h3 className="text-xl font-bold text-white truncate mb-1 group-hover:text-red-100">{playlist.name}</h3>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-2 group-hover:text-gray-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                    {playlist.songs?.length || 0} tracks
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Links section */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><LinkIcon className="text-red-500" size={24} /> Saved Links</h2>
                    <Link href="/upload"><button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all hover:border-red-500/30 hover:text-red-100"><Plus size={18} /> Add Link</button></Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {links.length > 0 ? (
                        links.map((link) => (
                            <div key={link.id} className="group flex items-center gap-4 p-4 rounded-xl bg-[#121214] border border-white/5 hover:border-red-500/40 hover:bg-[#1a1a1e] transition-all duration-300">
                                <div className="w-12 h-12 rounded-lg bg-[#1e1e24] flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:shadow-red-500/20 transition-shadow border border-white/5">
                                    <img src={getFavicon(link.name) || ""} alt="icon" className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity" onError={(e) => { e.target.style.display = 'none'; }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <a href={link.name} target="_blank" rel="noopener noreferrer" className="text-gray-300 font-medium hover:text-red-400 hover:underline truncate block text-base transition-colors">{link.name}</a>
                                    <p className="text-xs text-gray-600 mt-1">{link.date}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => deleteLink(link.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove Link"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center border border-dashed border-gray-800 rounded-2xl bg-[#121214]"><LinkIcon className="mx-auto text-gray-700 mb-4" size={48} /><p className="text-gray-500 font-medium">No external links saved yet.</p><Link href="/upload" className="text-red-500 hover:underline text-sm mt-2 block hover:text-red-400">Add your first link</Link></div>
                    )}
                </div>
            </div>
        </div>
    );
}