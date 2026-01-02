import { create } from "zustand";
import { useVideoStore } from "./videoStore";
import { useAuthStore } from "./authStore";

type VideoSuggestion = {
  id: string;
  type: "video";
  title: string;
  thumbnail: string;
  views: number;
  owner: {
    _id: string;
    username: string;
    avatar: string;
  };
};

type UserSuggestion = {
  id: string;
  type: "user";
  username: string;
  avatar: string;
};

type SearchSuggestions = {
  videos: VideoSuggestion[];
  users: UserSuggestion[];
};

type SearchResult = {
  query: string;
  videos: VideoSuggestion[];
  users: UserSuggestion[];
  totalVideos: number;
  totalUsers: number;
  currentPage: number;
  totalPages: number;
};

type SearchStore = {
  suggestions: SearchSuggestions;
  searchResults: SearchResult | null;
  isLoadingSuggestions: boolean;
  isSearching: boolean;
  
  getSuggestions: (query: string) => void;
  search: (query: string, type?: "all" | "videos" | "users", page?: number) => void;
  clearSuggestions: () => void;
  clearSearchResults: () => void;
};

/* ---------------- HELPER FUNCTIONS ---------------- */

const ITEMS_PER_PAGE = 12; // Adjust as needed

// Search videos by title or description
const searchVideos = (query: string, allVideos: any[], allUsers: any[]): VideoSuggestion[] => {
  const lowerQuery = query.toLowerCase().trim();
  
  return allVideos
    .filter((video) => 
      video.title.toLowerCase().includes(lowerQuery) ||
      video.description.toLowerCase().includes(lowerQuery)
    )
    .map((video) => {
      const owner = allUsers.find((u) => u.id === video.owner);
      return {
        id: video.id,
        type: "video" as const,
        title: video.title,
        thumbnail: video.thumbnail,
        views: video.views,
        owner: {
          _id: owner?.id || "",
          username: owner?.username || "Unknown",
          avatar: owner?.avatar || "/user.png",
        },
      };
    })
    .sort((a, b) => b.views - a.views); // Sort by views descending
};

// Search users by username or email
const searchUsers = (query: string, allUsers: any[]): UserSuggestion[] => {
  const lowerQuery = query.toLowerCase().trim();
  
  return allUsers
    .filter((user) => 
      user.username.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
    )
    .map((user) => ({
      id: user.id,
      type: "user" as const,
      username: user.username,
      avatar: user.avatar,
    }));
};

// Paginate results
const paginate = <T,>(items: T[], page: number, perPage: number): T[] => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return items.slice(startIndex, endIndex);
};

/* ---------------- STORE ---------------- */

export const useSearchStore = create<SearchStore>((set) => ({
  suggestions: { videos: [], users: [] },
  searchResults: null,
  isLoadingSuggestions: false,
  isSearching: false,

  getSuggestions: (query: string) => {
    if (!query || query.trim().length < 2) {
      set({ suggestions: { videos: [], users: [] } });
      return;
    }

    try {
      set({ isLoadingSuggestions: true });

      const videos = useVideoStore.getState().videos;
      const users = useAuthStore.getState().users;

      // Get top 5 video suggestions
      const videoSuggestions = searchVideos(query, videos, users).slice(0, 5);
      
      // Get top 5 user suggestions
      const userSuggestions = searchUsers(query, users).slice(0, 5);

      set({ 
        suggestions: { 
          videos: videoSuggestions, 
          users: userSuggestions 
        } 
      });
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      set({ suggestions: { videos: [], users: [] } });
    } finally {
      set({ isLoadingSuggestions: false });
    }
  },

  search: (query: string, type = "all", page = 1) => {
    if (!query || query.trim().length === 0) {
      set({ searchResults: null });
      return;
    }

    try {
      set({ isSearching: true });

      const videos = useVideoStore.getState().videos;
      const users = useAuthStore.getState().users;

      let allVideos: VideoSuggestion[] = [];
      let allUsers: UserSuggestion[] = [];

      // Search based on type
      if (type === "all" || type === "videos") {
        allVideos = searchVideos(query, videos, users);
      }

      if (type === "all" || type === "users") {
        allUsers = searchUsers(query, users);
      }

      // Calculate pagination
      const totalVideos = allVideos.length;
      const totalUsers = allUsers.length;
      const totalItems = totalVideos + totalUsers;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

      // Paginate results
      let paginatedVideos: VideoSuggestion[] = [];
      let paginatedUsers: UserSuggestion[] = [];

      if (type === "videos") {
        paginatedVideos = paginate(allVideos, page, ITEMS_PER_PAGE);
      } else if (type === "users") {
        paginatedUsers = paginate(allUsers, page, ITEMS_PER_PAGE);
      } else {
        // For "all", mix videos and users
        const combined = [
          ...allVideos.map(v => ({ ...v, sortType: 'video' })),
          ...allUsers.map(u => ({ ...u, sortType: 'user' }))
        ];
        
        const paginatedCombined = paginate(combined, page, ITEMS_PER_PAGE);
        
        paginatedVideos = paginatedCombined
          .filter(item => item.sortType === 'video')
          .map(({ sortType, ...rest }) => rest as VideoSuggestion);
        
        paginatedUsers = paginatedCombined
          .filter(item => item.sortType === 'user')
          .map(({ sortType, ...rest }) => rest as UserSuggestion);
      }

      set({ 
        searchResults: {
          query,
          videos: paginatedVideos,
          users: paginatedUsers,
          totalVideos,
          totalUsers,
          currentPage: page,
          totalPages: Math.max(1, totalPages),
        }
      });
    } catch (error) {
      console.error("Search failed:", error);
      set({ searchResults: null });
    } finally {
      set({ isSearching: false });
    }
  },

  clearSuggestions: () => set({ suggestions: { videos: [], users: [] } }),
  clearSearchResults: () => set({ searchResults: null }),
}));