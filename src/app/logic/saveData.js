const DB_NAME = "PulseMediaDB";
const STORE_NAME = "mediaFiles";

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const saveMediaToDB = async (id, file) => {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(file, id);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error("IndexedDB Init Error:", error);
        return false;
    }
};

export const getMediaFromDB = async (id) => {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error("IndexedDB Read Error:", error);
        return null;
    }
};

const getAudioDuration = (file) => {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
            URL.revokeObjectURL(url);
            const mins = Math.floor(audio.duration / 60);
            const secs = Math.floor(audio.duration % 60);
            resolve(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
        };
        audio.onerror = () => resolve("0:00");
    });
};

export const saveData = async ({ type, data }) => {
    if (!data) return false;

    const keyMap = {
        music: "userMusics",
        video: "userVideos",
        playQueue: "pulseQueue",
        recent: "userRecents",
        playlist: "userCustomPlaylists",
    };

    if (type === "playlist") return addToCustomPlaylist(data);

    const storageKey = keyMap[type];
    if (!storageKey) return false;

    let formattedItem;

    if (type === "playQueue") {
        formattedItem = { ...data, addedAt: Date.now() };
    }
    else if (data instanceof File) {
        const uniqueId = Date.now().toString() + Math.random().toString(36).substr(2, 5);

        try {
            await saveMediaToDB(uniqueId, data);

            const duration = await getAudioDuration(data);

            formattedItem = {
                id: uniqueId,
                name: data.name,
                size: (data.size / (1024 * 1024)).toFixed(2) + " MB",
                date: new Date().toLocaleDateString(),
                fileType: type === "video" ? "video" : "audio",
                duration: duration
            };
        } catch (error) {
            console.error("Failed to save media:", error);
            return false;
        }
    } else {
        formattedItem = { ...data, id: data.id || Date.now().toString(), date: data.date || new Date().toLocaleDateString() };
    }

    try {
        const existing = localStorage.getItem(storageKey);
        let parsedData = existing ? JSON.parse(existing) : [];
        parsedData = [formattedItem, ...parsedData];

        localStorage.setItem(storageKey, JSON.stringify(parsedData));
        window.dispatchEvent(new Event("storage"));
        return true;
    } catch (error) {
        console.error("Local Storage Error:", error);
        return false;
    }
};

const addToCustomPlaylist = ({ playlistId, songId }) => {
    try {
        const existing = localStorage.getItem("userCustomPlaylists");
        if (!existing) return false;

        let playlists = JSON.parse(existing);
        const playlistIndex = playlists.findIndex(p => p.id === playlistId);

        if (playlistIndex === -1) return false;
        if (playlists[playlistIndex].songs.includes(songId)) return false;

        playlists[playlistIndex].songs.push(songId);
        localStorage.setItem("userCustomPlaylists", JSON.stringify(playlists));
        window.dispatchEvent(new Event("storage"));
        return true;
    } catch (error) {
        return false;
    }
};