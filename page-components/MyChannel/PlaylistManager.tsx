"use client";

import * as React from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Play,
  Eye,
  EyeOff,
  MoreVertical,
  X,
  Check,
  ListVideo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePlaylistStore } from "@/Store/playlistStore";
import Loader from "../Loader";
import { IPlaylist } from "@/types/playlist.types";
import { IHomeVideo } from "@/types/video.types";
import { toast } from "sonner";
import { useAuthStore } from "@/Store/authStore";
import { formatTimeAgo} from "@/lib/helper";
import { IVideo } from "@/Store/videoStore";


export interface PlaylistVideo {
  id: string;
  thumbnail: string;
  duration: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  channelPic: string;
}

export function PlaylistManager({
  ChannelVideos,
}: {
  ChannelVideos: IVideo[];
}) {
  const {
    Playlists,
    isCreatingPlaylist,
    CreatePlaylist,
    ToggleVideoInPlaylist,
    UpdatePlaylist,
    DeletePlaylist,
    getPlaylists
  } = usePlaylistStore();
  const ChannelPlaylists = Playlists.PublicAndPrivate;
  const [CurrentPlaylistVideos, setCurrentPlaylistVideos] = React.useState<
    PlaylistVideo[]
  >([]);
  const [isFetchingVideos, setIsFetchingVideos] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("");
  const [newPlaylistName, setNewPlaylistName] = React.useState("");
  const [editingPlaylistId, setEditingPlaylistId] = React.useState<
    string | null
  >(null);
  const [editName, setEditName] = React.useState("");
  const [selectedVideoId, setSelectedVideoId] = React.useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const {currUser}=useAuthStore()
  
    React.useEffect(() => {
      if(!currUser) return
      getPlaylists(currUser?.id);
    }, [getPlaylists,currUser]);
  // CRUD Operations for Playlists

  const addPlaylist = () => {
    if (!newPlaylistName.trim() ||!currUser) return;


    const newPlaylist: IPlaylist = {
      id: "none",
      title: newPlaylistName,
      description: "",
      videosCount: 1,
      image: "",
      category: "Private",
      videos: [],
      owner:currUser.id
    };

    CreatePlaylist(newPlaylistName, "Private", newPlaylist);
    setNewPlaylistName("");
    setIsDialogOpen(false);
  };

  const updatePlaylistName = (id: string) => {
    if (!editName.trim()) return;
    const playlist = ChannelPlaylists.find((p) => p.id === id);
    if(!playlist) return
    UpdatePlaylist(id, { title: editName, category: playlist.category });
    setEditingPlaylistId(null);
  };

  const deletePlaylist = (id: string) => {
    if (!id) return;
    DeletePlaylist(id);
  };

  const toggleVisibility = (id: string) => {
    if (!id) return;
    const playlist = ChannelPlaylists.find((p) => p.id === id);
    if(!playlist) return
    const category = playlist?.category === "Private" ? "Public" : "Private";
    UpdatePlaylist(id, { title: playlist?.title, category });
  };

  const addVideo = (playlistId: string) => {
    if (!selectedVideoId) {
      toast.error("Please select a video");
      return;
    }

    if (!playlistId) return;

    ToggleVideoInPlaylist(playlistId, selectedVideoId);

    const videoToAdd = ChannelVideos.find((v) => v.id === selectedVideoId);
    if (videoToAdd) {
      setCurrentPlaylistVideos((prev) => [
        ...prev,
        {
          id: videoToAdd.id,
          title: videoToAdd.title,
          thumbnail: videoToAdd.thumbnail,
          channel: "",
          channelPic: "",
          timeAgo: formatTimeAgo(videoToAdd.createdAt),
          duration: "",
          views: "",
        },
      ]);
    }

    setSelectedVideoId("");
  };


  const removeVideo = (playlistId: string, videoId: string) => {
    ToggleVideoInPlaylist(playlistId, videoId);
    setCurrentPlaylistVideos((prev) => prev.filter((v) => v.id !== videoId));
    toast.success("Video removed");
  };

  const getPlaylistVideos = async (playlistId: string) => {
    if (!playlistId) return;
     
        setIsFetchingVideos(true);
    
        const plist = ChannelPlaylists.find(
          (pl) => pl.id === playlistId
        );
    
        if (!plist) {
          setCurrentPlaylistVideos([]);
          setIsFetchingVideos(false);
          return;
        }
    
        const formattedVideos: PlaylistVideo[] = plist.videos
          .map((videoId) => {
            const video = ChannelVideos.find((v) => v.id === videoId);    
            return {
              id: video!.id,
              thumbnail: video!.thumbnail,
              duration:String(video!.duration),
              title: video!.title,
              channel: currUser?.username|| "Me",
              views: `${video!.views} views`,
              timeAgo: formatTimeAgo(video!.createdAt),
              channelPic: currUser?.avatar || "/user.png",
            };
          })
          
    
        setCurrentPlaylistVideos(formattedVideos);
        setIsFetchingVideos(false);
      };

  // Empty State - No playlists
  if (!ChannelPlaylists || ChannelPlaylists.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <ListVideo className="h-16 w-16 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              No Playlists Yet
            </h2>
            <p className="text-muted-foreground text-lg">
              Create your first playlist to start organizing your video
              collections
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-5 w-5" /> Create Your First Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
                <DialogDescription>
                  Enter a name for your new video collection.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Playlist Name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPlaylist()}
              />
              <DialogFooter>
                <Button disabled={isCreatingPlaylist} onClick={addPlaylist}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // Normal State - Has playlists
  return (
    <div className="w-full mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Playlists</h1>
          <p className="text-muted-foreground">
            Manage and organize your video collections
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
              <DialogDescription>
                Enter a name for your new video collection.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Playlist Name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlaylist()}
            />
            <DialogFooter>
              <Button disabled={isCreatingPlaylist} onClick={addPlaylist}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="bg-secondary/50 p-1 mb-4">
            {ChannelPlaylists.map((playlist, k) => (
              <TabsTrigger
                key={k}
                value={playlist.id}
                className="relative data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 py-2"
                onClick={() => getPlaylistVideos(playlist.id)}
                disabled={isFetchingVideos}
              >
                {playlist.category === "Private" && (
                  <EyeOff className="h-3 w-3 mr-2 opacity-50" />
                )}
                {playlist.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {ChannelPlaylists.map((playlist, k) => (
          <TabsContent key={k} value={playlist.id} className="space-y-4">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  {editingPlaylistId === playlist.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-75"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updatePlaylistName(playlist.id)}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingPlaylistId(null)}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <CardTitle className="text-2xl flex items-center gap-3">
                      {playlist.title}
                      {playlist.category === "Private" && (
                        <Badge variant="secondary">Private</Badge>
                      )}
                    </CardTitle>
                  )}
                  <CardDescription>
                    {playlist.videos.length} videos in this collection
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleVisibility(playlist.id)}
                  >
                    {playlist.category === "Private" ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditName(playlist.title);
                          setEditingPlaylistId(playlist.id);
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-2" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deletePlaylist(playlist.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Playlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Select
                    value={selectedVideoId}
                    onValueChange={setSelectedVideoId}
                  >
                    <SelectTrigger className="flex-1 bg-secondary/30">
                      <SelectValue placeholder="Select a video to add..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ChannelVideos.map((video) => (
                        <SelectItem key={video.id} value={video.id}>
                          {video.title} ({formatTimeAgo(video.createdAt)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => addVideo(playlist.id)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Video
                  </Button>
                </div>

                <div className="grid gap-3">
                  {isFetchingVideos ? (
                    <Loader />
                  ) : (
                    CurrentPlaylistVideos.map((video) => (
                      <div
                        key={video.id}
                        className="group flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors border border-transparent hover:border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center text-primary">
                            <Play className="h-5 w-5 fill-current" />
                          </div>
                          <div>
                            <p className="font-medium">{video.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {video.timeAgo}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeVideo(playlist.id, video.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                  {CurrentPlaylistVideos.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-muted rounded-xl">
                      <p className="text-muted-foreground">
                        No videos in this playlist yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}