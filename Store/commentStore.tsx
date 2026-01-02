import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { comments as initialComments } from "@/data/comments";
import { useAuthStore } from "./authStore";

/* ---------------- TYPES ---------------- */

export interface Comment {
  id: string;
  author: string;              // userId
  Commented_Video_id: string;  // videoId
  comment: string;
}

export interface CommentWithAuthor {
  id: string;
  comment: string;
  videoId: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
}

/* ---------------- STORE ---------------- */

interface CommentStore {
  comments: Comment[];

  getCommentsByVideo: (videoId: string) => CommentWithAuthor[];
  addComment: (videoId: string, authorId: string, text: string) => void;
  deleteComment: (commentId: string, userId: string) => void;
  removeCommentsByVideo: (videoId: string) => void; // Helper for when videos are deleted
}

export const useCommentStore = create<CommentStore>()(
  persist(
    (set, get) => ({
      comments: initialComments,

      /* ---------------- GET COMMENTS BY VIDEO ---------------- */
      getCommentsByVideo: (videoId) => {
        const { comments } = get();
        const users = useAuthStore.getState().users;

        return comments
          .filter((c) => c.Commented_Video_id === videoId)
          .map((c) => {
            const user = users.find((u) => u.id === c.author);
            return {
              id: c.id,
              comment: c.comment,
              videoId: c.Commented_Video_id,
              author: {
                id: user?.id || "",
                username: user?.username || "Unknown User",
                avatar: user?.avatar || "/user.png",
              },
            };
          })
          
      },

      /* ---------------- ADD COMMENT ---------------- */
      addComment: (videoId, authorId, text) => {
        const currUser = useAuthStore.getState().currUser;

        // Validate user is logged in
        if (!currUser) {
          toast.error("You must be logged in to comment");
          return;
        }

        // Validate the authorId matches current user
        if (currUser.id !== authorId) {
          toast.error("Invalid user");
          return;
        }

        // Validate comment text
        if (!text || text.trim().length === 0) {
          toast.error("Comment cannot be empty");
          return;
        }

        const newComment: Comment = {
          id: Date.now().toString(), // or use crypto.randomUUID() if available
          author: authorId,
          Commented_Video_id: videoId,
          comment: text.trim(),
        };

        set((state) => ({
          comments: [...state.comments, newComment],
        }));

        toast.success("Comment added!");
      },

      /* ---------------- DELETE COMMENT ---------------- */
      deleteComment: (commentId, userId) => {
        const { comments } = get();
        const comment = comments.find((c) => c.id === commentId);

        if (!comment) {
          toast.error("Comment not found");
          return;
        }

        // Check if user owns the comment
        if (comment.author !== userId) {
          toast.error("You can only delete your own comments");
          return;
        }

        set({
          comments: comments.filter((c) => c.id !== commentId),
        });

        toast.success("Comment deleted");
      },

      /* ---------------- REMOVE COMMENTS BY VIDEO ---------------- */
      removeCommentsByVideo: (videoId) => {
        set((state) => ({
          comments: state.comments.filter(
            (c) => c.Commented_Video_id !== videoId
          ),
        }));
      },
    }),
    {
      name: "comments-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist comments data
        comments: state.comments,
      }),
    }
  )
);