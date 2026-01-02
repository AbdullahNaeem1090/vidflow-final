import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Music } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { IPlaylist } from "@/Store/playlistStore";

interface AddToPlaylistDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
  playlists: IPlaylist[];
  onVideoTogglePlaylist: (
    videoId: string,
    playlistId: string
  ) => void | Promise<void>;
  onCreatePlaylist: (playlistName: string) => void;
}

export function AddToPlaylistDialog({
  isOpen,
  onOpenChange,
  videoId,
  playlists,
  onVideoTogglePlaylist,
  onCreatePlaylist,
}: AddToPlaylistDialogProps) {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loadingPlaylistId, setLoadingPlaylistId] = useState<string | null>(
    null
  );

  const handlePlaylistToggle = async (playlistId: string) => {
    setLoadingPlaylistId(playlistId);
      onVideoTogglePlaylist(playlistId, videoId);
      setLoadingPlaylistId(null);
  
  };

  const handleCreateAndAdd = async () => {
    if (!newPlaylistName.trim()) return;
    setIsCreating(true);
    onCreatePlaylist(newPlaylistName);
    setNewPlaylistName("");
    setIsCreating(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-xs w-96 bg-background rounded-lg shadow-lg p-6 z-50">
        <AlertDialogHeader className="flex flex-row items-center justify-between pb-2">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Music className="h-5 w-5" />
            Add to Playlist
          </DialogTitle>
        </AlertDialogHeader>

        <div className="space-y-3">
          {/* Existing Playlists */}
          <div className="space-y-2">
            {playlists.length > 0 && (
              <>
                <ScrollArea className="h-48 rounded-lg border border-border/50 bg-card/30 p-3">
                  <div className="space-y-2">
                    {playlists.length > 0 ? (
                      playlists.map((playlist, k) => {
                        const isInPlaylist =
                          playlist.videos.includes(videoId);
                        const isLoading = loadingPlaylistId === playlist.id;

                        return (
                          <div
                            key={k}
                            className="flex items-center gap-3 rounded-lg p-2 hover:bg-card/50 transition-colors"
                          >
                            <Checkbox
                              id={playlist.id}
                              checked={isInPlaylist}
                              onCheckedChange={() =>
                                handlePlaylistToggle(playlist.id)
                              }
                              disabled={isLoading}
                              className="cursor-pointer"
                            />
                            <Label
                              htmlFor={playlist.id}
                              className="flex-1 cursor-pointer"
                            >
                              <span className="text-sm font-medium text-foreground">
                                {playlist.title}
                              </span>
                            </Label>
                            {isInPlaylist && (
                              <div
                                className="h-2 w-2 rounded-full bg-accent"
                                title="Video is in this playlist"
                              />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          No playlists found
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            )}

            {playlists.length === 0 && (
              <div className="py-4 text-center">
                <Music className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No playlists yet
                </p>
              </div>
            )}
          </div>

          {/* Create New Playlist */}
          <div className="space-y-2 border-t border-border/50 pt-3">
            <div className="flex gap-2">
              <Input
                placeholder="Playlist name..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newPlaylistName.trim()) {
                    handleCreateAndAdd();
                  }
                }}
                disabled={isCreating}
                className="text-sm"
              />
              <Button
                onClick={handleCreateAndAdd}
                disabled={!newPlaylistName.trim() || isCreating}
                size="sm"
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
