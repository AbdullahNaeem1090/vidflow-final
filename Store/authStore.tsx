import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { TloginFormData, TsignUpFormData } from "@/zod/auth-schema";
import { users as initialUsers, T1 } from "@/data/user";
import { ChannelVideo } from "@/types/video.types";
import { PlaylistPreview } from "@/types/playlist.types";
import { useVideoStore } from "./videoStore";
import { usePlaylistStore } from "./playlistStore";
import { useSubscriptionStore } from "./susbcriptionStore";

export interface channelData {
  name: string;
  subscribers: string;
  profilePic: string;
  bannerImage: string;
  isSubscribed: boolean;
  videos: ChannelVideo[];
  playlists: PlaylistPreview[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  password: string; // dummy only
}

type TAuthStore = {
  isLoggedIn: boolean;
  currUser: null | User;
  users: User[]; // Store users in state
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
  isUpdatingProfile: boolean;
  isChangingPassword: boolean;

  checkUser: () => void;
  signup: (data: TsignUpFormData) => void;
  login: (data: TloginFormData) => void;
  logout: () => void;
  setCurrUser: (data: User) => void;
  updateProfile: (UpdatedData: {
    username?: string;
    avatarUrl?: string;
  }) => void;
  changePassword: (passData: {
    currentPassword?: string;
    newPassword?: string;
  }) => void;

  getChannelData: (channelId: string) => channelData | null;
};

export const useAuthStore = create<TAuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      currUser: null,
      users: initialUsers, // Initialize with users from data file
      isLoggingIn: false,
      isSigningUp: false,
      isCheckingAuth: false,
      isUpdatingProfile: false,
      isChangingPassword: false,

      /* ---------------- SET CURRENT USER ---------------- */
      setCurrUser: (user) => {
        // Always get the latest user data from the users array
        const { users } = get();
        const latestUser = users.find((u) => u.id === user.id);
        
        set({ 
          currUser: latestUser || user, 
          isLoggedIn: true 
        });
      },

      /* ---------------- CHECK AUTH ---------------- */
      checkUser: () => {
        const { currUser, users } = get();
        if (currUser) {
          // Update currUser with latest data from users array
          const latestUser = users.find((u) => u.id === currUser.id);
          if (latestUser) {
            set({ currUser: latestUser, isLoggedIn: true });
          } else {
            set({ isLoggedIn: true });
          }
        }
      },

      /* ---------------- SIGNUP ---------------- */
      signup: (formData: TsignUpFormData) => {
        set({ isSigningUp: true });

        const { users } = get();
        const userExists = users.find((u) => u.email === formData.email);

        if (userExists) {
          toast.error("User already exists");
          set({ isSigningUp: false });
          return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          username: formData.username,
          email: formData.email,
          password: formData.password,
          avatar: T1,
        };

        set({
          users: [...users, newUser],
          currUser: newUser,
          isLoggedIn: true,
          isSigningUp: false,
        });

        toast.success("Account created successfully!");
      },

      /* ---------------- LOGIN ---------------- */
      login: (formData: TloginFormData) => {
        set({ isLoggingIn: true });

        const { users } = get();
        const user = users.find(
          (u) =>
            u.email === formData.email &&
            u.password === formData.password
        );

        if (!user) {
          toast.error("Invalid credentials");
          set({ isLoggingIn: false });
          return;
        }

        set({
          currUser: user,
          isLoggedIn: true,
          isLoggingIn: false,
        });

        toast.success(`Welcome back, ${user.username}!`);
      },

      /* ---------------- LOGOUT ---------------- */
      logout: () => {
        set({
          currUser: null,
          isLoggedIn: false,
        });
        toast.success("Logged out successfully");
      },

      /* ---------------- UPDATE PROFILE ---------------- */
      updateProfile: (UpdatedData) => {
        set({ isUpdatingProfile: true });

        const { currUser, users } = get();
        if (!currUser) {
          set({ isUpdatingProfile: false });
          toast.error("No user logged in");
          return;
        }

        // Update users array
        const updatedUsers = users.map((u) =>
          u.id === currUser.id
            ? {
                ...u,
                username: UpdatedData.username ?? u.username,
                avatar: UpdatedData.avatarUrl ?? u.avatar,
              }
            : u
        );

        // Get the updated user
        const updatedUser = updatedUsers.find((u) => u.id === currUser.id);

        if (!updatedUser) {
          set({ isUpdatingProfile: false });
          toast.error("Failed to update profile");
          return;
        }

        // CRITICAL: Update both users array AND currUser in a single set call
        set({
          users: updatedUsers,
          currUser: updatedUser, // This ensures currUser is updated with latest data
          isUpdatingProfile: false,
        });

        toast.success("Profile updated successfully");
      },

      /* ---------------- CHANGE PASSWORD ---------------- */
      changePassword: ({ currentPassword, newPassword }) => {
        set({ isChangingPassword: true });

        const { currUser, users } = get();
        if (!currUser || !currUser.password || !newPassword) {
          set({ isChangingPassword: false });
          toast.error("Invalid password data");
          return;
        }

        if (currUser.password !== currentPassword) {
          toast.error("Current password is incorrect");
          set({ isChangingPassword: false });
          return;
        }

        // Update users array
        const updatedUsers = users.map((u) =>
          u.id === currUser.id ? { ...u, password: newPassword } : u
        );

        // Get the updated user
        const updatedUser = updatedUsers.find((u) => u.id === currUser.id);

        if (!updatedUser) {
          set({ isChangingPassword: false });
          toast.error("Failed to change password");
          return;
        }

        // CRITICAL: Update both users array AND currUser
        set({
          users: updatedUsers,
          currUser: updatedUser, // Ensure currUser has the new password
          isChangingPassword: false,
        });

        toast.success("Password changed successfully");
      },

      /* ---------------- GET CHANNEL DATA ---------------- */
      getChannelData: (id: string) => {
        const { users, currUser } = get();
        if (!currUser) return null;
        
        // Get the channel/user
        const channel = users.find((u) => u.id === id);
        if (!channel) {
          return null;
        }

        // Get videos from videoStore
        const videos = useVideoStore.getState().videos;
        const channelVideos = videos
          .filter((v) => v.owner === id)
          .map((v) => ({
            id: v.id,
            title: v.title,
            thumbnail: v.thumbnail,
            views: String(v.views),
            uploadedAt: v.createdAt,
          }));

        // Get public playlists from playlistStore
        const playlists = usePlaylistStore.getState().playlists;
        const channelPlaylists = playlists
          .filter((p) => p.owner === id && p.category === "Public")
          .map((p) => {
            // Get first video thumbnail for playlist preview
            const firstVideoId = p.videos[0];
            const firstVideo = videos.find((v) => v.id === firstVideoId);

            return {
              id: p.id,
              title: p.title,
              thumbnail: firstVideo?.thumbnail || "/placeholder-thumbnail.png",
              videoCount: p.videos.length,
            };
          });

        // Get subscriber count and check if current user is subscribed
        const subscriberCount = useSubscriptionStore
          .getState()
          .getSubscriberCount(id);
        const isSubscribed = useSubscriptionStore
          .getState()
          .isSubscribed(currUser.id, id);

        return {
          name: channel.username,
          subscribers: String(subscriberCount),
          profilePic: channel.avatar,
          bannerImage: "", // Fallback to avatar if no banner
          isSubscribed,
          videos: channelVideos,
          playlists: channelPlaylists,
        };
      },
    }),
    {
      name: "auth-storage", // Key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        users: state.users,
        currUser: state.currUser,
        isLoggedIn: state.isLoggedIn,
      }),
      version: 1, // Add version for migration support
    }
  )
);