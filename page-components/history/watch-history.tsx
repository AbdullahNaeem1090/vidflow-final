"use client"

import { MoreVertical, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useRouter } from "next/navigation"

export interface WatchHistoryCardProps {
  id: string
  title: string
  thumbnail: string
  duration: string
  watchedAt: string
  channelName: string
  viewCount: string
  onRemove?: (id: string) => void
}


export function WatchHistoryCard({
  id,
  title,
  thumbnail,
  duration,
  watchedAt,
  channelName,
  viewCount,
  onRemove,
}: WatchHistoryCardProps) {
  const router =useRouter();
  return (
            
    <div  onClick={() => router.push(`/watch-video/${id}`)} className="group flex gap-3 rounded-lg border border-border/40 bg-card/50 p-3 transition-all duration-300 hover:bg-card hover:border-border hover:shadow-lg md:gap-4 md:p-4">
      {/* Thumbnail */}
      <div className="relative shrink-0 overflow-hidden rounded-lg bg-muted w-32 h-24 md:w-48 md:h-28">
        <Image
        width={200}
        height={200}
          src={thumbnail||"/user.png"}
          alt={title}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
          <Button
            size="icon"
            className="opacity-0 transition-all duration-300 group-hover:opacity-100 bg-accent hover:bg-accent/90 rounded-full h-12 w-12"
          >
            <Play className="h-5 w-5 fill-accent-foreground" />
          </Button>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs font-semibold text-white">
          {duration}
        </div>

       
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        {/* Title and Metadata */}
        <div className="space-y-1">
          <h3 className="font-semibold text-sm md:text-base text-foreground line-clamp-2">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">{channelName}</p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{viewCount}</span>
          <span>•</span>
          <span>{watchedAt}</span>
        </div>
      </div>

      {/* Menu */}
      <div className="shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) =>{
              e.stopPropagation() 
            onRemove?.(id)
            }} className="text-destructive focus:bg-destructive/10">
              Remove from History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
