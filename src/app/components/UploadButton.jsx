"use client";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { saveData } from "../logic/saveData";
import Swal from 'sweetalert2';

export default function UploadButton({ type = "music" }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const success = await saveData({ type, data: file });

    setIsUploading(false);

    if (success) {
      const Toast = Swal.mixin({
        toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000,
        background: '#18181b', color: '#fff'
      });
      Toast.fire({ icon: 'success', title: 'File Uploaded & Saved to DB!' });

      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={type === "video" ? "video/*" : "audio/*"}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-900/20 active:scale-95 disabled:opacity-50"
      >
        <Upload size={18} />
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}