"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/Store/authStore";
import { useParams } from "next/navigation";
import { useCommentStore } from "@/Store/commentStore";

export function Comments() {
  const [text, setText] = useState("");
  const { currUser } = useAuthStore();
  const { VideoId } = useParams<{ VideoId: string }>();

  const {
    getCommentsByVideo,
    addComment,
    deleteComment,
  } = useCommentStore();

  if (!VideoId) return null;

  // ✅ derived data (NO useEffect)
  const comments = getCommentsByVideo(VideoId);

  function handleAddComment() {
    if (!text.trim() || !currUser?.id) return;
    addComment(VideoId, currUser.id, text.trim());
    setText("");
  }

  return (
    <section aria-label="Comments" className="space-y-4">
      <h2 className="text-lg font-semibold">Comments</h2>

      {/* Add Comment */}
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={currUser?.avatar || "/user.png"} />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Textarea
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-20"
          />
          <div className="mt-2 flex items-center gap-2">
            <Button onClick={handleAddComment} disabled={!text.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Comment
            </Button>
            <Button variant="ghost" onClick={() => setText("")}>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <ul className="space-y-4">
        {comments.map((c) => {
          const canDelete = currUser?.id === c.author.id;

          return (
            <li key={c.id} className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={c.author.avatar} />
                <AvatarFallback>
                  {c.author.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">
                    {c.author.username}
                  </span>

                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        deleteComment(c.id, currUser.id)
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <p className="mt-1 text-sm">{c.comment}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
