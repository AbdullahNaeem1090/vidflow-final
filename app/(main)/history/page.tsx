"use client"

import { useEffect, useState } from "react"
import { Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { WatchHistoryCard } from "@/page-components/history/watch-history"
import Loader from "@/page-components/Loader"
import { useWatchHistoryStore, ProcessedWatchHistory } from "@/Store/historyStore"
import { useAuthStore } from "@/Store/authStore"

export default function WatchHistoryPage() {
  const [historyItems, setHistoryItems] = useState<ProcessedWatchHistory[]>([])
  const [loading, setLoading] = useState(true)

  // Get functions from stores
  const { getUserWatchHistory, deleteWatchHistoryItem, clearUserWatchHistory } = useWatchHistoryStore()
  const { currUser } = useAuthStore()

  // ==============================
  // FETCH WATCH HISTORY ON LOAD
  // ==============================
  useEffect(() => {
    const loadHistory = () => {
      try {
        if (currUser) {
          const history = getUserWatchHistory(currUser.id)
          setHistoryItems(history)
        }
      } catch (error) {
        console.error("Failed to load watch history", error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [currUser, getUserWatchHistory])

  // ==============================
  // HANDLERS
  // ==============================
  const handleRemove = (id: string) => {
    if (!currUser) return

    deleteWatchHistoryItem(id, currUser.id)
    // Update local state
    setHistoryItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleClearHistory = () => {
    if (!currUser) return

    clearUserWatchHistory(currUser.id)
    // Update local state
    setHistoryItems([])
  }

  // ==============================
  // UI
  // ==============================
  if (loading) {
    return <Loader />
  }

  // If no user is logged in
  if (!currUser) {
    return (
      <main className="min-h-screen bg-background w-full">
        <div className="mx-auto w-full px-4 py-8 md:py-12">
          <div className="flex flex-col items-center justify-center rounded-lg border border-border/40 bg-card/30 py-16">
            <Clock className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Not Logged In</h2>
            <p className="text-muted-foreground text-center max-w-sm">
              Please log in to view your watch history.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background w-full">
      <div className="mx-auto w-full px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Watch History</h1>
              <p className="text-sm text-muted-foreground">
                {historyItems.length} videos in your history
              </p>
            </div>
          </div>

          {historyItems.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Clear All</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Clear Watch History</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to clear your entire watch history? This action cannot be undone.
                </AlertDialogDescription>
                <div className="flex gap-3 justify-end">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearHistory}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Clear History
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Content */}
        {historyItems.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {historyItems.map((item) => (
              <WatchHistoryCard
                key={item.id}
                {...item}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border/40 bg-card/30 py-16">
            <Clock className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Watch History</h2>
            <p className="text-muted-foreground text-center max-w-sm">
              Your watch history is empty. Start watching videos to build your history.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}