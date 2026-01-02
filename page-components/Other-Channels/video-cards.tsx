"use client"

import { ChannelVideo } from "@/types/video.types"
import Image from "next/image"

export function VideoCard({ video }: { video: ChannelVideo }) {
  return (
    <div className="group cursor-pointer" >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <Image
          src={video.thumbnail || "/placeholder.svg"}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mt-3">
        <h3 className="line-clamp-2 font-medium leading-snug group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <div className="mt-1 flex items-center text-sm text-muted-foreground">
          <span>{video.views} views</span>
          <span className="mx-1.5">•</span>
          <span>{video.uploadedAt}</span>
        </div>
      </div>
    </div>
  )
}
