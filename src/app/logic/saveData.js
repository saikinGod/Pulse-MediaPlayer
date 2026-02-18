export const saveData = ({ type, data }) => {
    if (!data) return false;

    // Map type to Local Storage Keys
    const keyMap = {
        music: "userMusics",
        video: "userVideos",
        playQueue: "userPlayQueue",
        recent: "userRecents",
        playlist: "userCustomPlaylists",
    };

    if (type === "playlist") {
        return addToCustomPlaylist(data);
    }

    const storageKey = keyMap[type];
    if (!storageKey) {
        console.warn(`Unknown type: ${type}`);
        return false;
    }

    // Format the data based on type
    let formattedItem;

    if (type === "playQueue") {
        formattedItem = {
            id: data.id,
            addedAt: Date.now(),
            name: data.name,
            artist: data.artist || "Unknown",
        };
    }

    else if (data instanceof File) {
        formattedItem = {
            id: Date.now(),
            name: data.name,
            size: (data.size / (1024 * 1024)).toFixed(2) + " MB",
            date: new Date().toLocaleDateString(),
            fileType: type === "video" ? "video" : "audio",
        };
    }
    else {
        formattedItem = {
            ...data,
            id: data.id || Date.now(),
            date: data.date || new Date().toLocaleDateString(),
        };
    }

    // Save to Local Storage
    try {
        const existing = localStorage.getItem(storageKey);
        let parsedData = existing ? JSON.parse(existing) : [];
        parsedData = [formattedItem, ...parsedData];

        localStorage.setItem(storageKey, JSON.stringify(parsedData));
        window.dispatchEvent(new Event("storage"));

        console.log(`Saved to ${storageKey}:`, formattedItem);
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

        // Find the target playlist
        const playlistIndex = playlists.findIndex(p => p.id === playlistId);
        if (playlistIndex === -1) {
            console.error("Playlist not found!");
            return false;
        }

        // Check if song already exists in that playlist
        if (playlists[playlistIndex].songs.includes(songId)) {
            console.warn("Song already in playlist");
            return false;
        }

        // Add song ID to the playlist's 'songs' array
        playlists[playlistIndex].songs.push(songId);

        // Save back
        localStorage.setItem("userCustomPlaylists", JSON.stringify(playlists));
        window.dispatchEvent(new Event("storage"));

        console.log(`Added song ${songId} to playlist ${playlistId}`);
        return true;
    } catch (error) {
        console.error("Error adding to playlist:", error);
        return false;
    }
};