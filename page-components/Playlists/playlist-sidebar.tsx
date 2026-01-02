"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import Image from "next/image"

export function Playlistsidebar({ playlistTitle, currentIndex, videos, isAutoplay, setIsAutoplay, setCurrentIndex, setProgress, setIsPlaying }:{
    playlistTitle: string;
    currentIndex: number;
    videos: { id: string; title: string; thumbnail: string; uploadedAt: string }[];
    isAutoplay: boolean;
    setIsAutoplay: (value: boolean) => void;
    setCurrentIndex: (index: number) => void;
    setProgress: (progress: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
}) {
  return (
    <div className="w-full shrink-0 lg:w-100">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          {/* Playlist Header */}
          <div className="bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">{playlistTitle}</h2>
                <p className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {videos.length} videos
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Autoplay</span>
                  <Switch
                    checked={isAutoplay}
                    onCheckedChange={setIsAutoplay}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Video List */}
          <ScrollArea className="h-112.5">
            <div className="p-2">
              {videos.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => {
                    setCurrentIndex(index)
                    setProgress(0)
                    setIsPlaying(true)
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/80",
                    currentIndex === index && "bg-muted ring-1 ring-primary/20",
                  )}
                >
                  <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                    height={200}
                    width={200}
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    {currentIndex === index && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play className="h-5 w-5 fill-white text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1 py-1">
                    <h3
                      className={cn(
                        "line-clamp-2 text-sm font-medium leading-tight",
                        currentIndex === index && "text-primary",
                      )}
                    >
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{video.uploadedAt}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
  )
}

