"use client";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { getMediaFromDB } from "../logic/saveData";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const mediaRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState(0);

    const currentTrack = queue[currentIndex] || null;

    useEffect(() => {
        const handleStorageChange = () => {
            const savedQueue = JSON.parse(localStorage.getItem("pulseQueue") || "[]");
            setQueue(savedQueue);
            if (savedQueue.length === 0) {
                setIsPlaying(false);
                if (mediaRef.current) {
                    mediaRef.current.pause();
                    mediaRef.current.removeAttribute('src');
                    mediaRef.current.load();
                }
            }
        };
        handleStorageChange();
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const loadAndPlayTrack = async (track) => {
        if (!mediaRef.current || !track) return;
        setIsPlaying(false);
        setDuration(0);
        setCurrentTime(0);

        try {
            const actualFile = await getMediaFromDB(track.id);
            if (!actualFile) {
                nextTrack();
                return;
            }

            const fileUrl = URL.createObjectURL(actualFile);
            mediaRef.current.src = fileUrl;
            mediaRef.current.load();

            const playPromise = mediaRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => setIsPlaying(true)).catch(e => {
                    if (e.name !== 'AbortError') setIsPlaying(false);
                });
            }
        } catch (error) {
            setIsPlaying(false);
        }
    };

    const playTrack = (track, newQueue = null) => {
        let q = newQueue || queue;
        localStorage.setItem("pulseQueue", JSON.stringify(q));
        window.dispatchEvent(new Event("storage"));

        const index = q.findIndex(t => t.id === track.id);
        const newIndex = index === -1 ? 0 : index;

        if (currentIndex === newIndex && mediaRef.current && q.length > 0) {
            mediaRef.current.currentTime = 0;
            mediaRef.current.play().catch(e => { if (e.name !== 'AbortError') setIsPlaying(false); });
            setIsPlaying(true);
        } else {
            setCurrentIndex(newIndex);
        }
    };

    const togglePlay = () => {
        if (!mediaRef.current || !currentTrack) return;
        if (isPlaying) mediaRef.current.pause();
        else mediaRef.current.play().catch(e => { if (e.name !== 'AbortError') setIsPlaying(false); });
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        if (!queue.length) return;

        if (repeatMode === 2) {
            if (mediaRef.current) {
                mediaRef.current.currentTime = 0;
                mediaRef.current.play().catch(e => { if (e.name !== 'AbortError') setIsPlaying(false); });
                setIsPlaying(true);
            }
            return;
        }

        let nextIdx = currentIndex + 1;

        if (isShuffle && queue.length > 1) {
            do {
                nextIdx = Math.floor(Math.random() * queue.length);
            } while (nextIdx === currentIndex);
        }

        if (nextIdx < queue.length) {
            setCurrentIndex(nextIdx);
        } else if (repeatMode === 1) {
            setCurrentIndex(0);
        } else {
            setIsPlaying(false);
        }
    };

    const prevTrack = () => {
        if (currentTime > 3 || currentIndex === 0) {
            if (mediaRef.current) {
                mediaRef.current.currentTime = 0;
                mediaRef.current.play().catch(e => { if (e.name !== 'AbortError') setIsPlaying(false); });
                setIsPlaying(true);
            }
            return;
        }
        setCurrentIndex(prev => prev - 1);
    };

    const seek = (time) => {
        if (mediaRef.current && !isNaN(time)) {
            mediaRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const changeVolume = (val) => {
        const clampedVal = Math.min(Math.max(val, 0), 1);
        setVolume(clampedVal);
        if (mediaRef.current) mediaRef.current.volume = clampedVal;
    };

    const toggleShuffle = () => setIsShuffle(!isShuffle);
    const toggleRepeat = () => setRepeatMode((prev) => (prev + 1) % 3);

    const removeFromQueue = (indexToRemove) => {
        const updatedQueue = queue.filter((_, idx) => idx !== indexToRemove);
        localStorage.setItem("pulseQueue", JSON.stringify(updatedQueue));
        window.dispatchEvent(new Event("storage"));
    };

    const clearQueue = () => {
        localStorage.removeItem("pulseQueue");
        window.dispatchEvent(new Event("storage"));
    };

    useEffect(() => {
        const media = mediaRef.current;
        if (!media) return;

        const updateTime = () => setCurrentTime(media.currentTime);
        const updateDuration = () => setDuration(media.duration || 0);
        const onEnded = () => nextTrack();
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        media.addEventListener("timeupdate", updateTime);
        media.addEventListener("loadedmetadata", updateDuration);
        media.addEventListener("ended", onEnded);
        media.addEventListener("play", onPlay);
        media.addEventListener("pause", onPause);

        return () => {
            media.removeEventListener("timeupdate", updateTime);
            media.removeEventListener("loadedmetadata", updateDuration);
            media.removeEventListener("ended", onEnded);
            media.removeEventListener("play", onPlay);
            media.removeEventListener("pause", onPause);
        };
    }, [currentIndex, queue, isShuffle, repeatMode]);

    useEffect(() => {
        if (currentTrack) loadAndPlayTrack(currentTrack);
    }, [currentIndex, currentTrack?.id]);

    return (
        <PlayerContext.Provider
            value={{
                currentTrack, isPlaying, queue, currentTime, duration, volume,
                isShuffle, repeatMode, toggleShuffle, toggleRepeat,
                playTrack, nextTrack, prevTrack, togglePlay, seek, changeVolume,
                removeFromQueue, clearQueue, videoRef: mediaRef
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);