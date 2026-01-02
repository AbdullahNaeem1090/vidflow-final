"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Play, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import Image from "next/image"
import { useState } from "react"

interface PlaylistCardProps {
  id: string
  title: string
  description?: string
  videosCount: number
  image?: string
  onPlay?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function PlaylistCard({ title, description, videosCount, image, onPlay, onEdit, onDelete }: PlaylistCardProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const handleDeleteClick = (e: Event) => {
    e.preventDefault()
    setIsAlertOpen(true)
  }

  const handleDelete = () => {
    setIsAlertOpen(false)
    onDelete?.()
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-border/50 bg-card/50 backdrop-blur hover:bg-card">
        <div className="relative w-full h-48 bg-linear-to-br from-primary/30 via-accent/20 to-secondary/30 flex items-center justify-center overflow-hidden">
          {image ? (
            <>
              <Image
                height={200}
                width={200}
                src={image|| "/playlist.png"}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <Music className="w-12 h-12 text-primary/60 group-hover:text-primary transition-colors duration-300" />
              <p className="text-xs text-muted-foreground">Your Playlist</p>
            </div>
          )}

          <Button
            onClick={onPlay}
            size="icon"
            className="absolute bottom-4 right-4 rounded-full bg-primary hover:bg-primary/90 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl transform group-hover:scale-100 scale-75"
          >
            <Play className="h-5 w-5 fill-primary-foreground" />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-lg font-semibold truncate text-card-foreground group-hover:text-primary transition-colors duration-200">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-muted-foreground line-clamp-1 group-hover:text-muted-foreground/80 transition-colors duration-200">
                    {description}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>}
                  {onDelete && (
                    <DropdownMenuItem 
                      className="text-destructive"
                      onSelect={handleDeleteClick}
                    >
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/30">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {videosCount} {videosCount === 1 ? "video" : "videos"}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Playlist</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the playlist and its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}