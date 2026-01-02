import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { playlists as initialPlaylists } from "@/data/playlists";
import { useAuthStore } from "./authStore";


/* ---------------- TYPES ---------------- */

export interface IPlaylist {
  id: string;
  owner: string;
  title: string;
  description: string;
  videos: string[];
  category: string;
}

interface IPlaylistStore {
  playlists: IPlaylist[]; // Store playlists in state for persistence

  getPlaylists: (id: string) => void;
  Playlists: {
    Personal: IPlaylist[];
    PublicAndPrivate: IPlaylist[];
  };
  isFecthingPlaylists: boolean;

  CreatePlaylist: (
    playlistName: string,
    category: "Public" | "Private" | "Personal",
    tempPlaylist: IPlaylist
  ) => Promise<void>;

  ToggleVideoInPlaylist: (playlistId: string, videoId: string) => Promise<void>;
  removeVideoFromAllPlaylists: (videoId: string) => void;
  DeletePlaylist: (playlistId: string) => Promise<void>;
  UpdatePlaylist: (
    playlistId: string,
    updates: { title: string; category: string }
  ) => Promise<void>;

  isCreatingPlaylist: boolean;
}

/* ---------------- STORE ---------------- */

export const usePlaylistStore = create<IPlaylistStore>()(
  persist(
    (set, get) => ({
      playlists: initialPlaylists, // Initialize with playlists from data file
      
      isFecthingPlaylists: false,
      isCreatingPlaylist: false,

      Playlists: {
        Personal: [],
        PublicAndPrivate: [],
      },

      /* ---------------- GET PLAYLISTS ---------------- */
      getPlaylists: (id) => {
        set({ isFecthingPlaylists: true });

        const { playlists } = get();

        const personal = playlists.filter(
          (p) => p.category === "Personal" && p.owner === id
        );

        const publicPrivate = playlists.filter(
          (p) =>
            (p.category === "Public" || p.category === "Private") &&
            p.owner === id
        );

        set({
          Playlists: {
            Personal: personal,
            PublicAndPrivate: publicPrivate,
          },
          isFecthingPlaylists: false,
        });
      },

      /* ---------------- CREATE PLAYLIST ---------------- */
      CreatePlaylist: async (playlistName, category, tempPlaylist) => {
        set({ isCreatingPlaylist: true });

        const currUser = useAuthStore.getState().currUser;

        if (!currUser) {
          toast.error("You must be logged in to create a playlist");
          set({ isCreatingPlaylist: false });
          return;
        }

        const newPlaylist: IPlaylist = {
          ...tempPlaylist,
          id: Date.now().toString(),
          title: playlistName,
          category,
          owner: currUser.id, // Use actual logged-in user ID
        };

        // Update playlists immutably
        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }));

        // Update categorized playlists
        set((state) => {
          if (category === "Personal") {
            return {
              Playlists: {
                ...state.Playlists,
                Personal: [...state.Playlists.Personal, newPlaylist],
              },
              isCreatingPlaylist: false,
            };
          }

          return {
            Playlists: {
              ...state.Playlists,
              PublicAndPrivate: [
                ...state.Playlists.PublicAndPrivate,
                newPlaylist,
              ],
            },
            isCreatingPlaylist: false,
          };
        });

        toast.success("Playlist created");
      },

      /* ---------------- TOGGLE VIDEO ---------------- */
      ToggleVideoInPlaylist: async (playlistId, videoId) => {
        const { playlists } = get();
        const playlist = playlists.find((p) => p.id === playlistId);
        
        if (!playlist) {
          toast.error("Playlist not found");
          return;
        }

        const exists = playlist.videos.includes(videoId);

        // Update playlist videos immutably
        const updatedPlaylists = playlists.map((p) =>
          p.id === playlistId
            ? {
                ...p,
                videos: exists
                  ? p.videos.filter((id) => id !== videoId)
                  : [...p.videos, videoId],
              }
            : p
        );

        set({ playlists: updatedPlaylists });

        // Update categorized playlists
        set((state) => {
          const updatedPlaylist = updatedPlaylists.find(
            (p) => p.id === playlistId
          );
          if (!updatedPlaylist) return state;

          const update = (list: IPlaylist[]) =>
            list.map((p) => (p.id === playlistId ? updatedPlaylist : p));

          return {
            Playlists: {
              Personal: update(state.Playlists.Personal),
              PublicAndPrivate: update(state.Playlists.PublicAndPrivate),
            },
          };
        });

        toast.success(
          exists ? "Video removed from playlist" : "Video added to playlist"
        );
      },

      /* ---------------- REMOVE VIDEO FROM ALL ---------------- */
      removeVideoFromAllPlaylists: (videoId) => {
        const { playlists } = get();

        // Remove video from all playlists immutably
        const updatedPlaylists = playlists.map((p) => ({
          ...p,
          videos: p.videos.filter((id) => id !== videoId),
        }));

        set({ playlists: updatedPlaylists });

        // Update categorized playlists
        set((state) => ({
          Playlists: {
            Personal: state.Playlists.Personal.map((p) => ({
              ...p,
              videos: p.videos.filter((id) => id !== videoId),
            })),
            PublicAndPrivate: state.Playlists.PublicAndPrivate.map((p) => ({
              ...p,
              videos: p.videos.filter((id) => id !== videoId),
            })),
          },
        }));

        toast.success("Video removed from all playlists");
      },

      /* ---------------- DELETE PLAYLIST ---------------- */
      DeletePlaylist: async (playlistId) => {
        const { playlists } = get();
        const currUser = useAuthStore.getState().currUser;

        const playlist = playlists.find((p) => p.id === playlistId);

        if (!playlist) {
          toast.error("Playlist not found");
          return;
        }

        // Check ownership
        if (currUser && playlist.owner !== currUser.id) {
          toast.error("You can only delete your own playlists");
          return;
        }

        // Remove playlist immutably
        set({
          playlists: playlists.filter((p) => p.id !== playlistId),
        });

        // Update categorized playlists
        set((state) => ({
          Playlists: {
            Personal: state.Playlists.Personal.filter(
              (p) => p.id !== playlistId
            ),
            PublicAndPrivate: state.Playlists.PublicAndPrivate.filter(
              (p) => p.id !== playlistId
            ),
          },
        }));

        toast.success("Playlist deleted");
      },

      /* ---------------- UPDATE PLAYLIST ---------------- */
      UpdatePlaylist: async (playlistId, updates) => {
        const { playlists } = get();
        const currUser = useAuthStore.getState().currUser;

        const playlist = playlists.find((p) => p.id === playlistId);

        if (!playlist) {
          toast.error("Playlist not found");
          return;
        }

        // Check ownership
        if (currUser && playlist.owner !== currUser.id) {
          toast.error("You can only update your own playlists");
          return;
        }

        // Update playlist immutably
        const updatedPlaylists = playlists.map((p) =>
          p.id === playlistId
            ? {
                ...p,
                title: updates.title ?? p.title,
                category: updates.category ?? p.category,
              }
            : p
        );

        set({ playlists: updatedPlaylists });

        // Update categorized playlists based on new category
        const updatedPlaylist = updatedPlaylists.find(
          (p) => p.id === playlistId
        );

        if (!updatedPlaylist) return;

        set((state) => {
          // Remove from both categories first
          const personal = state.Playlists.Personal.filter(
            (p) => p.id !== playlistId
          );
          const pubPriv = state.Playlists.PublicAndPrivate.filter(
            (p) => p.id !== playlistId
          );

          // Add to correct category based on updated category
          if (updatedPlaylist.category === "Personal") {
            personal.push(updatedPlaylist);
          } else {
            pubPriv.push(updatedPlaylist);
          }

          return {
            Playlists: {
              Personal: personal,
              PublicAndPrivate: pubPriv,
            },
          };
        });

        toast.success("Playlist updated");
      },
    }),
    {
      name: "playlist-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist playlists data
        playlists: state.playlists,
      }),
    }
  )
);