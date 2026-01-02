import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import type { VideoUploadFormData } from "@/types/video.types";
import type { DeepPartial } from "react-hook-form";
import { videos as initialVideos } from "@/data/video";
import { useAuthStore } from "./authStore";
import { useSubscriptionStore } from "./susbcriptionStore";
import { useWatchHistoryStore } from "./historyStore";

/* ---------------- TYPES ---------------- */

export interface IVideo {
  id: string;
  title: string;
  description: string;
  owner: string;
  thumbnail: string;
  videoURL: string;
  duration: number;
  views: number;
  createdAt: string;
}

export interface IHomeVideo {
  id: string;
  thumbnail: string;
  duration: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  channelPic?: string;
}

export interface ICurrentVideo {
  src: string;
  thumbnail: string;
  title: string;
  description: string;
  views: number;
  uploadedAt: string;
  likes: number;
  channel: {
    id: string;
    name: string;
    subscribers: number;
    isSubscribed: boolean;
    avatar?: string;
  };
}

/* ---------------- STORE ---------------- */

type TVideoStore = {
  videos: IVideo[]; // Store videos in state for persistence

  uploadVideo: (
    data: {
      videoUrl: string;
      thumbnail: string;
      title: string;
      description: string;
      duration: number;
    },
    reset: (values?: DeepPartial<VideoUploadFormData>) => void
  ) => Promise<void>;

  HomeVideos: IHomeVideo[];
  nextCursor: string | null;
  isfetchingHomeVideos: boolean;
  hasMore: boolean;

  fetchVideos: () => Promise<void>;

  fetchCurrentVideo: (id: string) => void;
  isFetchingCurrVideo: boolean;
  CurrentVideo: null | ICurrentVideo;

  removeVideo: (id: string) => void;
};

export const useVideoStore = create<TVideoStore>()(
  persist(
    (set, get) => ({
      videos: initialVideos, // Initialize with videos from data file

      HomeVideos: [],
      nextCursor: null,
      isfetchingHomeVideos: false,
      hasMore: false,

      isFetchingCurrVideo: false,
      CurrentVideo: null,

      /* ---------------- SAVE VIDEO ---------------- */
      uploadVideo: async (formdata, reset) => {
        // Get current user from auth store
        const currUser = useAuthStore.getState().currUser;

        if (!currUser) {
          toast.error("You must be logged in to upload videos");
          return;
        }

        const newVideo: IVideo = {
          id: Date.now().toString(),
          title: formdata.title,
          description: formdata.description,
          owner: currUser.id, // Use actual logged-in user ID
          thumbnail: formdata.thumbnail,
          videoURL: formdata.videoUrl,
          duration: formdata.duration,
          views: 0,
          createdAt: new Date().toISOString(),
        };

        // Update videos state immutably
        set((state) => ({
          videos: [newVideo, ...state.videos],
        }));

        reset();
        toast.success("Video uploaded successfully! Refresh to see it.");
      },

      /* ---------------- FETCH HOME VIDEOS ---------------- */
      fetchVideos: async () => {
        const { isfetchingHomeVideos, videos } = get();
        if (isfetchingHomeVideos) return;

        set({ isfetchingHomeVideos: true });

        // Get users from auth store
        const users = useAuthStore.getState().users;

        const formatted: IHomeVideo[] = videos.map((v) => {
          const user = users.find((user) => user.id === v.owner);
          return {
            id: v.id,
            thumbnail: v.thumbnail,
            duration: String(v.duration),
            title: v.title,
            channel: user?.username ?? "User",
            views: `${v.views} views`,
            timeAgo: v.createdAt,
            channelPic: user?.avatar ?? "",
          };
        });

        set({
          HomeVideos: [...formatted],
          isfetchingHomeVideos: false,
        });
      },

      /* ---------------- REMOVE VIDEO ---------------- */
      removeVideo: (id) => {
        // Remove video immutably
        set((state) => ({
          videos: state.videos.filter((v) => v.id !== id),
          HomeVideos: state.HomeVideos.filter((v) => v.id !== id),
        }));

        toast.success("Video removed");
      },

      /* ---------------- FETCH CURRENT VIDEO ---------------- */
      fetchCurrentVideo: (videoId) => {
        set({ isFetchingCurrVideo: true });

        const { videos } = get();

        // Get data from other stores
        const users = useAuthStore.getState().users;
        const currUser = useAuthStore.getState().currUser;
        const subscriptions = useSubscriptionStore.getState().subscriptions;

        const video = videos.find((v) => v.id === videoId);

        if (!video) {
          set({ isFetchingCurrVideo: false });
          toast.error("Video not found");
          return;
        }

        // Increment view count immutably
        const updatedVideos = videos.map((v) =>
          v.id === videoId ? { ...v, views: v.views + 1 } : v
        );

        const vidOwner = users.find((user) => user.id === video.owner);

        if (!vidOwner) {
          set({ isFetchingCurrVideo: false });
          toast.error("Video owner not found");
          return;
        }

        // Get subscriber count from subscription store
        const subscriberCount = subscriptions.filter(
          (s) => s.subscribedTo === vidOwner.id
        ).length;

        // Check if current user is subscribed
        const isSubscribed = currUser
          ? subscriptions.some(
              (s) =>
                s.subscriber === currUser.id && s.subscribedTo === vidOwner.id
            )
          : false;

        set({
          videos: updatedVideos,
          CurrentVideo: {
            src: video.videoURL,
            thumbnail: video.thumbnail,
            title: video.title,
            description: video.description ?? "",
            views: video.views + 1,
            uploadedAt: video.createdAt,
            likes: 0,
            channel: {
              id: video.owner,
              name: vidOwner.username,
              subscribers: subscriberCount,
              isSubscribed: isSubscribed,
              avatar: vidOwner.avatar,
            },
          },
          isFetchingCurrVideo: false,
        });
        if (!currUser) return;
        useWatchHistoryStore
          .getState()
          .addToWatchHistory(currUser?.id, videoId);
      },
    }),
    {
      name: "video-storage", // Key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist videos data
        videos: state.videos,
      }),
    }
  )
);
