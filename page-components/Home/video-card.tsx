"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play } from "lucide-react";
import type { IHomeVideo } from "@/types/video.types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatTimeAgo } from "@/lib/helper";

export default function VideoCard({
  id,
  thumbnail,
  duration,
  title,
  channel,
  views,
  timeAgo,
  channelPic,
}: IHomeVideo) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/watch-video/${id}`)}
      className="group relative overflow-hidden border-0 shadow-none bg-transparent 
             hover:scale-[1.02] transition-transform duration-300 cursor-pointer max-w-95"
    >
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative w-full overflow-hidden rounded-xl">
          <AspectRatio ratio={16 / 9}>
            <Image
              width={100}
              height={100}
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </AspectRatio>

          {/* Duration Tag */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-1.5 py-0.5 rounded-md font-medium">
            {`0:${duration}`}
          </div>

          {/* Hover Play Icon */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]"
          >
            <Play className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Video Info */}
        <div className="flex gap-3 mt-3 px-1">
          {/* Channel Avatar */}
          {channelPic ? (
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              <Image
                width={30}
                height={30}
                src={channelPic}
                alt={channel}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold shrink-0">
              {channel?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Text */}
          <div className="flex flex-col justify-center text-sm w-full overflow-hidden">
            <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
              {title}
            </h3>
            <div className="text-muted-foreground text-xs mt-0.5">
              {channel}
            </div>
            <div className="text-muted-foreground text-xs">
              {views} • {formatTimeAgo(timeAgo)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
