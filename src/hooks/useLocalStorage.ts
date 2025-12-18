"use client";

import { useState, useEffect, useCallback } from "react";

export interface HistoryItem {
  slug: string;
  title: string;
  poster: string;
  lastEpisode: string;
  lastEpisodeNum: number;
  timestamp: number;
}

// Custom event names
const HISTORY_UPDATED_EVENT = "anime-history-updated";
const WATCHED_UPDATED_EVENT = "anime-watched-updated";

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Helper to read from local storage
  const getStoredHistory = (): HistoryItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem("anime-history");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse history", e);
      return [];
    }
  };

  useEffect(() => {
    // Initial load
    setHistory(getStoredHistory());

    // Listen for custom events and storage events
    const handleHistoryUpdate = () => {
      setHistory(getStoredHistory());
    };

    window.addEventListener(HISTORY_UPDATED_EVENT, handleHistoryUpdate);
    window.addEventListener("storage", handleHistoryUpdate);

    return () => {
      window.removeEventListener(HISTORY_UPDATED_EVENT, handleHistoryUpdate);
      window.removeEventListener("storage", handleHistoryUpdate);
    };
  }, []);

  const addToHistory = useCallback((item: Omit<HistoryItem, "timestamp">) => {
    const currentHistory = getStoredHistory();
    const newHistory = [
      { ...item, timestamp: Date.now() },
      ...currentHistory.filter((h) => h.slug !== item.slug),
    ].slice(0, 20); // Keep last 20

    localStorage.setItem("anime-history", JSON.stringify(newHistory));
    setHistory(newHistory);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event(HISTORY_UPDATED_EVENT));
  }, []);

  const removeFromHistory = useCallback((slug: string) => {
    const currentHistory = getStoredHistory();
    const newHistory = currentHistory.filter((h) => h.slug !== slug);
    
    localStorage.setItem("anime-history", JSON.stringify(newHistory));
    setHistory(newHistory);
    
    window.dispatchEvent(new Event(HISTORY_UPDATED_EVENT));
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem("anime-history");
    setHistory([]);
    window.dispatchEvent(new Event(HISTORY_UPDATED_EVENT));
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
}

export function useWatched() {
  const [watched, setWatched] = useState<Record<string, number[]>>({});

  const getStoredWatched = (): Record<string, number[]> => {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem("anime-watched");
    try {
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to parse watched episodes", e);
      return {};
    }
  };

  useEffect(() => {
    setWatched(getStoredWatched());

    const handleWatchedUpdate = () => {
      setWatched(getStoredWatched());
    };

    window.addEventListener(WATCHED_UPDATED_EVENT, handleWatchedUpdate);
    window.addEventListener("storage", handleWatchedUpdate);

    return () => {
      window.removeEventListener(WATCHED_UPDATED_EVENT, handleWatchedUpdate);
      window.removeEventListener("storage", handleWatchedUpdate);
    };
  }, []);

  const markAsWatched = useCallback((animeSlug: string, episodeNum: number) => {
    const currentWatched = getStoredWatched();
    const currentList = currentWatched[animeSlug] || [];
    
    if (currentList.includes(episodeNum)) {
        return;
    }

    const newWatched = {
      ...currentWatched,
      [animeSlug]: [...currentList, episodeNum],
    };

    localStorage.setItem("anime-watched", JSON.stringify(newWatched));
    setWatched(newWatched);
    
    window.dispatchEvent(new Event(WATCHED_UPDATED_EVENT));
  }, []);

  const isWatched = useCallback((animeSlug: string, episodeNum: number) => {
    return watched[animeSlug]?.includes(episodeNum) || false;
  }, [watched]);

  const clearWatched = useCallback(() => {
    localStorage.removeItem("anime-watched");
    setWatched({});
    window.dispatchEvent(new Event(WATCHED_UPDATED_EVENT));
  }, []);

  return { watched, markAsWatched, isWatched, clearWatched };
}
