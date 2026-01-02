import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { useAuthStore } from "./authStore";
import { useVideoStore } from "./videoStore";
import { history } from "@/data/watchHistory";

/* ---------------- TYPES ---------------- */

export interface WatchHistory {
  id: string;
  userId: string;
  videoId: string;
  watchedAt: string; // ISO date string
}

export interface ProcessedWatchHistory {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  watchedAt: string;
  channelName: string;
  viewCount: string;
}


/* ---------------- HELPER FUNCTIONS ---------------- */

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  }
  return `${count} views`;
};

const formatWatchedAt = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

/* ---------------- STORE ---------------- */

interface WatchHistoryStore {
  watchHistory: WatchHistory[];

  getUserWatchHistory: (userId: string) => ProcessedWatchHistory[];
  addToWatchHistory: (userId: string, videoId: string) => void;
  deleteWatchHistoryItem: (historyId: string, userId: string) => void;
  clearUserWatchHistory: (userId: string) => void;
}

export const useWatchHistoryStore = create<WatchHistoryStore>()(
  persist(
    (set, get) => ({
      watchHistory: history,

      /* ---------------- GET USER WATCH HISTORY ---------------- */
      getUserWatchHistory: (userId) => {
        const { watchHistory } = get();
        const videos = useVideoStore.getState().videos;
        const users = useAuthStore.getState().users;

        // Filter history by userId and sort by most recent
        const userHistory = watchHistory
          .filter((h) => h.userId === userId)
          .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());

        // Process and map to required format
        return userHistory
          .map((h) => {
            const video = videos.find((v) => v.id === h.videoId);
            if (!video) return null; // Skip if video not found

            const channel = users.find((u) => u.id === video.owner);

            return {
              id: h.id,
              title: video.title,
              thumbnail: video.thumbnail,
              duration: formatDuration(video.duration),
              watchedAt: formatWatchedAt(h.watchedAt),
              channelName: channel?.username || "Unknown Channel",
              viewCount: formatViewCount(video.views),
            };
          })
          .filter((item): item is ProcessedWatchHistory => item !== null);
      },

      /* ---------------- ADD TO WATCH HISTORY ---------------- */
      addToWatchHistory: (userId, videoId) => {
        const currUser = useAuthStore.getState().currUser;

        // Validate user is logged in
        if (!currUser) {
          return; // Silent fail for watch history
        }

        // Validate the userId matches current user
        if (currUser.id !== userId) {
          return;
        }

        // Check if this video is already the most recent entry for this user
        const { watchHistory } = get();
        const userHistory = watchHistory
          .filter((h) => h.userId === userId)
          .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());

        // If the most recent video is the same, don't add duplicate
        if (userHistory.length > 0 && userHistory[0].videoId === videoId) {
          return;
        }

        const newHistoryEntry: WatchHistory = {
          id: Date.now().toString(),
          userId,
          videoId,
          watchedAt: new Date().toISOString(),
        };

        set((state) => ({
          watchHistory: [...state.watchHistory, newHistoryEntry],
        }));
      },

      /* ---------------- DELETE WATCH HISTORY ITEM ---------------- */
      deleteWatchHistoryItem: (historyId, userId) => {
        const { watchHistory } = get();
        const historyItem = watchHistory.find((h) => h.id === historyId);

        if (!historyItem) {
          toast.error("History item not found");
          return;
        }

        // Check if user owns this history entry
        if (historyItem.userId !== userId) {
          toast.error("You can only delete your own watch history");
          return;
        }

        set({
          watchHistory: watchHistory.filter((h) => h.id !== historyId),
        });

        toast.success("Removed from watch history");
      },

      /* ---------------- CLEAR USER WATCH HISTORY ---------------- */
      clearUserWatchHistory: (userId) => {
        const currUser = useAuthStore.getState().currUser;

        // Validate user is logged in
        if (!currUser) {
          toast.error("You must be logged in");
          return;
        }

        // Validate the userId matches current user
        if (currUser.id !== userId) {
          toast.error("Invalid user");
          return;
        }

        set((state) => ({
          watchHistory: state.watchHistory.filter((h) => h.userId !== userId),
        }));

        toast.success("Watch history cleared");
      },
    }),
    {
      name: "watch-history-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist watch history data
        watchHistory: state.watchHistory,
      }),
    }
  )
);