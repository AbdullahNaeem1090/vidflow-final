"use client"
import { Play } from "lucide-react"
import { PlaylistPreview } from "@/types/playlist.types"
import Image from "next/image"

export function PlaylistCard({ playlist }: { playlist: PlaylistPreview }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <Image
          src={playlist.thumbnail || "/playlist.png"}
          alt={playlist.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="h-10 w-10 fill-white text-white" />
        </div>
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {playlist.videoCount} videos
        </div>
      </div>
      <div className="mt-3">
        <h3 className="line-clamp-1 font-medium group-hover:text-primary transition-colors">{playlist.title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">View full playlist</p>
      </div>
    </div>
  )
}
