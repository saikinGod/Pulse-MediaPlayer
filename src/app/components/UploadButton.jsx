"use client";
import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { saveData } from "../logic/saveData";
import { toast } from "react-toastify";

export default function UploadButton({ type }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get Audio/Video Duration
  const getDuration = (file) => {
    return new Promise((resolve) => {
      const element = type === "video" ? document.createElement("video") : document.createElement("audio");
      element.preload = "metadata";
      element.onloadedmetadata = () => {
        window.URL.revokeObjectURL(element.src);
        const totalSeconds = Math.floor(element.duration);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      };
      element.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (const file of files) {
      // Calculate Duration properly
      let duration = "0:00";
      try {
        duration = await getDuration(file);
      } catch (err) {
        console.error("Duration error", err);
      }

      // Prepare Data Object manually
      const dataObj = {
        id: Date.now() + Math.random(), // Unique ID
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        date: new Date().toLocaleDateString(),
        duration: duration,
        fileType: type === "video" ? "video" : "audio",

      };


      saveData({ type: type, data: dataObj });
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={type === "video" ? "video/*" : "audio/*"}
        multiple
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-red-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        {isUploading ? "Processing..." : "Upload"}
      </button>
    </>
  );
}