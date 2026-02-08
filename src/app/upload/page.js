"use client";
import { useState } from "react";
import { Upload, Link as LinkIcon, Sparkles, Music, Video, FileAudio, FileVideo, Zap } from "lucide-react";

export default function UserUpload() {
    const [dragActive, setDragActive] = useState(false);
    const [urlInput, setUrlInput] = useState("");

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            console.log("Files dropped:", e.dataTransfer.files);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            console.log("Files selected:", e.target.files);
        }
    };

    const handleAddURL = () => {
        if (urlInput.trim()) {
            console.log("URL added:", urlInput);
            setUrlInput("");
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col" style={{ background: "#0a0a0f" }}>

            {/* Animated Background Grid */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(220, 38, 38, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(220, 38, 38, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "50px 50px",
                    maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)"
                }} />
            </div>

            {/* Gradient Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
                    style={{
                        background: "radial-gradient(circle, #dc2626 0%, transparent 70%)",
                        animation: "float 8s ease-in-out infinite"
                    }} />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
                    style={{
                        background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
                        animation: "float 10s ease-in-out infinite reverse",
                        animationDelay: "2s"
                    }} />
            </div>

            {/* Hero Section */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">

                {/* Welcome Badge with Glow */}
                <div className="mb-8 px-5 py-2.5 rounded-full border flex items-center gap-2.5 relative group"
                    style={{
                        borderColor: "rgba(233,69,96,0.4)",
                        background: "rgba(233,69,96,0.08)",
                        boxShadow: "0 0 20px rgba(233,69,96,0.15)"
                    }}>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-700"
                        style={{ transform: "translateX(-100%)", animation: "shimmer 3s infinite" }} />
                    <Sparkles size={16} className="text-red-400 animate-pulse" />
                    <span className="text-sm text-red-400 font-semibold tracking-wide">PULSE-MEDIA v2.0</span>
                    <Zap size={14} className="text-red-400" />
                </div>

                {/* Main Heading with Gradient */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-center mb-6 max-w-5xl leading-tight">
                    <span className="block bg-linear-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        Your Futuristic
                    </span>
                    <span className="block bg-linear-to-r from-red-600 via-red-700 to-red-500 bg-clip-text text-transparent animate-gradient">
                        Media Hub
                    </span>
                </h1>

                {/* Subtitle with Better Typography */}
                <p className="text-lg md:text-xl text-gray-400 text-center max-w-3xl mb-16 leading-relaxed">
                    Upload, organize, and play your media with cutting-edge style.<br />
                    <span className="text-red-400 font-medium">Experience the pulse of modern entertainment.</span>
                </p>

                {/* Upload Section with Enhanced Glassmorphism */}
                <div className="w-full max-w-5xl rounded-3xl p-8 md:p-12 relative"
                    style={{
                        background: "rgba(18,18,26,0.7)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                    }}>

                    {/* Accent Line with Glow */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 rounded-full"
                        style={{
                            background: "linear-gradient(90deg, transparent, #dc2626, transparent)",
                            boxShadow: "0 0 20px #dc2626"
                        }} />

                    {/* Section Title */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1.5 h-10 rounded-full relative ">
                            <div className="absolute inset-0 bg-linear-to-b from-red-500 to-purple-500 animate-gradient" />
                        </div>
                        <h2 className="text-3xl font-black bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Upload Media
                        </h2>
                    </div>

                    {/* Drag & Drop Zone with Enhanced Effects */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className="relative mb-8 rounded-2xl border-2 border-dashed p-12 md:p-24 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer group "
                        style={{
                            borderColor: dragActive ? "#dc2626" : "rgba(100,116,139,0.25)",
                            background: dragActive
                                ? "rgba(220,38,38,0.08)"
                                : "linear-gradient(135deg, rgba(15,23,42,0.5) 0%, rgba(30,15,42,0.5) 100%)",
                            boxShadow: dragActive
                                ? "0 0 40px rgba(220,38,38,0.2), inset 0 0 40px rgba(220,38,38,0.1)"
                                : "inset 0 1px 0 rgba(255,255,255,0.03)"
                        }}
                        onClick={() => document.getElementById('file-input').click()}
                    >
                        {/* Animated Border Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 rounded-2xl"
                                style={{
                                    background: "linear-gradient(45deg, transparent 30%, rgba(220,38,38,0.1) 50%, transparent 70%)",
                                    backgroundSize: "200% 200%",
                                    animation: "gradient-shift 3s ease infinite"
                                }} />
                        </div>

                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept="audio/*,video/*"
                            onChange={handleFileInput}
                            className="hidden"
                        />

                        {/* Upload Icon with 3D Effect */}
                        <div className="mb-8 relative">
                            <div
                                className="absolute inset-0 rounded-full blur-2xl transition-all duration-500"
                                style={{
                                    background: "radial-gradient(circle, rgba(233,69,96,0.6) 0%, transparent 70%)",
                                    opacity: dragActive ? 1 : 0.4,
                                    transform: dragActive ? "scale(1.3)" : "scale(1)"
                                }}
                            />
                            <div className="relative transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                <Upload size={72} className="text-red-400" strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Text with Better Hierarchy */}
                        <p className="text-2xl font-bold text-white mb-3 tracking-tight">Drop your media files here</p>
                        <p className="text-base text-gray-400 mb-2">
                            or <span className="text-red-400 font-medium underline decoration-red-400/30">click to browse</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            MP3 • MP4 • WAV • OGG • WebM
                        </p>

                        {/* Upload Stats */}
                        <div className="mt-6 flex items-center gap-6 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-gray-500">Ready to upload</span>
                            </div>
                            <div className="w-px h-3 bg-gray-700" />
                            <span className="text-gray-500">Max 500MB per file</span>
                        </div>
                    </div>

                    {/* URL Input Section with Modern Design */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-red-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition duration-500" />
                            <div className="relative">
                                <LinkIcon size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-colors group-hover:text-red-400" />
                                <input
                                    type="url"
                                    placeholder="Paste direct media URL (https://...)"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddURL()}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border text-sm outline-none transition-all duration-300"
                                    style={{
                                        background: "rgba(15,23,42,0.7)",
                                        borderColor: "rgba(100,116,139,0.3)",
                                        color: "#e2e0e8",
                                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#dc2626";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.1), inset 0 1px 0 rgba(255,255,255,0.03)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "rgba(100,116,139,0.3)";
                                        e.target.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.03)";
                                    }}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleAddURL}
                            className="relative px-10 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95  group"
                            style={{
                                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                                boxShadow: "0 4px 24px rgba(233,69,96,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
                            }}
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                                style={{ transform: "translateX(-100%)", animation: "shimmer 3s infinite" }} />
                            <span className="relative">Add URL</span>
                        </button>
                    </div>
                </div>

                {/* Quick Access Cards with 3D Effect */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16 w-full max-w-5xl">
                    {[
                        { icon: Music, label: "Music Library", count: "156 tracks", color: "#dc2626", gradient: "from-red-500 to-red-700" },
                        { icon: Video, label: "Video Library", count: "42 videos", color: "#a855f7", gradient: "from-purple-500 to-purple-700" },
                        { icon: FileAudio, label: "Playlists", count: "8 playlists", color: "#00d4ff", gradient: "from-cyan-400 to-cyan-600" },
                        { icon: FileVideo, label: "Recently Played", count: "24 items", color: "#f59e0b", gradient: "from-amber-500 to-amber-700" },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className="group p-6 rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 text-left relative "
                            style={{
                                background: "rgba(18,18,26,0.6)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = `${item.color}60`;
                                e.currentTarget.style.boxShadow = `0 12px 32px ${item.color}30`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
                            }}
                        >
                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-linear-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110"
                                    style={{
                                        background: `${item.color}20`,
                                        boxShadow: `0 0 20px ${item.color}20`
                                    }}>
                                    <item.icon size={22} style={{ color: item.color }} strokeWidth={2} />
                                </div>
                                <p className="text-sm font-bold text-white mb-1.5">{item.label}</p>
                                <p className="text-xs text-gray-500 font-medium">{item.count}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer with Glow Effect */}
            <div className="relative py-8 text-center border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-px bg-linear-to-r from-transparent via-red-500 to-transparent opacity-50" />
                <p className="text-sm text-gray-600">
                    Powered by <span className="text-red-400 font-bold">Pulse-Media</span>
                    <span className="mx-2 text-gray-700">•</span>
                    <span className="text-gray-500">Your futuristic media experience</span>
                </p>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -30px) scale(1.1); }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
}