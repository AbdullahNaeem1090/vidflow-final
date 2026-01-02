"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, PlayCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { PlaylistPreview } from "@/types/playlist.types"



export function PlaylistGrid({playlists}:{playlists:PlaylistPreview[]}) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  

  const handleDelete = () => {
    setDeleteConfirm(null)

  }

  const handleUpdate = () => {
    toast("Update playlist feature - opening editor")
  }

  const handleViewDetails = () => {
    toast("Opening playlist details")
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border-border"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted overflow-hidden group">
              <Image
                width={200}
                height={120}
                src={"/playlist.png"}
                alt={playlist.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Video Count Badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                <PlayCircle className="w-3 h-3" />
                {playlist.videoCount} videos
              </div>

              {/* Play Icon Overlay */}
              {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <PlayCircle className="w-12 h-12  opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
              </div> */}

              {/* More Options Button */}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="bg-black/50 hover:bg-black/70 text-white h-8 w-8 rounded-full"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                    <DropdownMenuItem
                      onClick={() => handleViewDetails()}
                      className="cursor-pointer text-foreground hover:bg-muted"
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleUpdate()}
                      className="cursor-pointer text-foreground hover:bg-muted"
                    >
                      Edit Playlist
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={() => setDeleteConfirm(playlist.id)}
                      className="cursor-pointer text-destructive hover:bg-destructive/10"
                    >
                      Delete Playlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Playlist Info */}
            <div className="p-3 md:p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-2 hover:text-primary cursor-pointer">
                {playlist.title}
              </h3>
              
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Playlist</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this playlist? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80 border-border">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm !== null && handleDelete()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
