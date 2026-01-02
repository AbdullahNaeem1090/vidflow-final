"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, Play } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { myAxios } from "@/lib/axios"
import { IVideo, useVideoStore } from "@/Store/videoStore"
import { usePlaylistStore } from "@/Store/playlistStore"
import { formatTimeAgo } from "@/lib/helper"
import VideoUploadPage from "@/app/(main)/upload-video/page"

// Mock video data

export function VideoGrid( {videos}:{videos:IVideo[]} ) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const router = useRouter()
  const { removeVideo } = useVideoStore()
  const { removeVideoFromAllPlaylists } = usePlaylistStore()

  const handleDelete = async (id: string) => {
    try {
      
      
        removeVideo(id)
        removeVideoFromAllPlaylists(id)
      
      setDeleteConfirm(null)
    } catch (error) {
      console.log(error)
    }
  }

  // ============================
  // EMPTY / NULL STATE
  // ============================
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
        <Play className="h-12 w-12 mb-4 opacity-40" />
        <h3 className="text-lg font-semibold text-foreground">
          No videos found
        </h3>
        <p className="mt-1 text-sm">
          Upload a video to get started.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {videos.map((video) => (
          <Card
            key={video.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border-border"
            onClick={() => router.push(`/watch-video/${video.id}`)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted overflow-hidden group">
              <Image
                width={200}
                height={120}
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
              </div>

              {/* Options */}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-black/50 hover:bg-black/70 text-white h-8 w-8 rounded-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm(video.id)
                      }}
                      className="cursor-pointer text-destructive hover:bg-destructive/10"
                    >
                      Delete Video
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Info */}
            <div className="p-3 md:p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-2">
                {video.title}
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-xs md:text-sm text-muted-foreground">
                  {video.views} views
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(video.createdAt)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Dialog */}
      <AlertDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this video? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

