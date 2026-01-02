"use client";

import Image from "next/image";
import { Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export interface PlaylistVideo {
  id: string;
  thumbnail: string;
  duration: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  channelPic: string;
}

interface Props {
  canRemove: boolean;
  videos: PlaylistVideo[];
  onRemove: (id: string) => void;
}

function formatDuration(sec: string): string {
  const seconds = Number(sec);
  if (!seconds || seconds < 0) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function HorizontalVideoRow({
  videos,
  onRemove,
  canRemove,
}: Props) {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      {videos.map((video) => (
        <div
          key={video.id}
          onClick={() => router.push(`/watch-video/${video.id}`)}
          className="flex gap-4 p-2 cursor-pointer hover:bg-white/5 transition rounded-md"
        >
          {/* Thumbnail */}
          <div className="relative w-61.5 h-34.5 shrink-0 rounded-xl overflow-hidden">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
            />
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {formatDuration(video.duration)}
            </span>
          </div>

          {/* Right content */}
          <div className="flex flex-1 gap-3">
            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold line-clamp-2">
                {video.title}
              </h3>

              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={video.channelPic || "/user.png"} />
                  <AvatarFallback>{video.channel[0]}</AvatarFallback>
                </Avatar>

                <span className="text-xs text-muted-foreground truncate">
                  {video.channel}
                </span>
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                {video.views} • {video.timeAgo}
              </p>
            </div>

            {/* More icon */}
            {canRemove && (
              <Trash
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(video.id);
                }}
                className="h-5 w-5  hover:text-muted-foreground shrink-0 mt-1"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
