"use client"
import { cn } from "@/lib/utils"

export function VideoPlayer({
  src,
  poster,
  title,
  className,
}: {
  src: string
  poster?: string
  title: string
  className?: string
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="aspect-video overflow-hidden rounded-lg bg-muted">
        <video className="h-full w-full" controls playsInline autoPlay preload="metadata" poster={poster}>
          <source src={src} type="video/mp4" />
          {/* Fallback text for unsupported browsers */}
          {`Your browser does not support the video tag.`}
        </video>
      </div>
      <p className="sr-only">{title}</p>
    </div>
  )
}
