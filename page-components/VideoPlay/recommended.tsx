import { cn } from "@/lib/utils"
import { useVideoStore } from "@/Store/videoStore"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo } from "react"
import { Clock } from "lucide-react"
import { formatTimeAgo } from "@/lib/helper"

export function RecommendedList({
  className,
}: {
  className?: string
}) {
  const {
    fetchVideos,
    isfetchingHomeVideos,
    HomeVideos,
    CurrentVideo,
  } = useVideoStore()

  // =========================
  // FETCH HOME VIDEOS
  // =========================
  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  // =========================
  // FILTER CURRENT VIDEO
  // =========================
  const filteredVideos = useMemo(() => {
    if (!CurrentVideo) return HomeVideos

    return HomeVideos.filter(
      (video) => video.title !== CurrentVideo.title
    )
  }, [HomeVideos, CurrentVideo])

  // =========================
  // LOADING STATE
  // =========================
  if (isfetchingHomeVideos) {
    return (
      <div className={cn("grid gap-4", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[168px_minmax(0,1fr)] gap-3 py-2 px-1 animate-pulse"
          >
            <div className="h-23.5 w-42 rounded-md bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-3 w-2/3 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (!filteredVideos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Clock className="h-8 w-8 mb-2 opacity-50" />
        <p>No recommendations available</p>
      </div>
    )
  }

  // =========================
  // UI
  // =========================
  return (
    <div className={cn("grid gap-4", className)}>
      {filteredVideos.map((v) => (
        <Link
          key={v.id}
          href={`/watch-video/${v.id}`}
          className="group grid grid-cols-[168px_minmax(0,1fr)] gap-3 glassy-hover py-2 px-1 rounded-md"
        >
          <div className="relative h-23.5 w-42 overflow-hidden rounded-md bg-muted">
            <Image
              width={168}
              height={95}
              src={v.thumbnail || "/placeholder.svg"}
              alt={`${v.title} thumbnail`}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            />
            <span className="pointer-events-none absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {`0:${v.duration}`}
              
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-medium">
              {v.title}
            </h3>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {v.channel}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {v.views}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {formatTimeAgo(v.timeAgo)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
