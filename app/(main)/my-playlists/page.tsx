"use client";

import React, { useEffect, useState } from "react";
import { Music } from "lucide-react";
import { usePlaylistStore } from "@/Store/playlistStore";
import Loader from "@/page-components/Loader";
import { PlaylistCard } from "@/page-components/Playlists/playlist-card";
import { PlaylistVideo } from "@/page-components/MyChannel/PlaylistManager";
import HorizontalPlaylistVideoList from "@/page-components/Playlists/playlist-videos";
import { useAuthStore } from "@/Store/authStore";
import {  formatTimeAgo } from "@/lib/helper";
import { useVideoStore } from "@/Store/videoStore";

export default function PlaylistsPage() {
  const {
    getPlaylists,
    isFecthingPlaylists,
    Playlists,
    DeletePlaylist,
    ToggleVideoInPlaylist
  } = usePlaylistStore();

  const [currentPlaylistVideos, setCurrentPlaylistVideos] =
    useState<PlaylistVideo[]>([]);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);
  const [activePlaylistName, setActivePlaylistName] = useState<string | null>(
    null
  );
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const {currUser,users}=useAuthStore()
  const {videos}=useVideoStore()

  useEffect(() => {
    if(!currUser) return
    getPlaylists(currUser?.id);
  }, [getPlaylists,currUser]);

  // Helpers


  const getPlaylistVideos = async (
    playlistId: string,
    playlistName: string
  ) => {
    setIsFetchingVideos(true);
    setActivePlaylistId(playlistId);
    setActivePlaylistName(playlistName);

    const plist = Playlists.Personal.find(
      (pl) => pl.id === playlistId
    );

    if (!plist) {
      setCurrentPlaylistVideos([]);
      setIsFetchingVideos(false);
      return;
    }

    const formattedVideos: PlaylistVideo[] = plist.videos
      .map((videoId) => {
    const video = videos.find((v) => v.id === videoId);

    const channel = users.find((u) => u.id === video!.owner);

    return {
      id: video!.id,
      thumbnail: video!.thumbnail,
      duration: String(video!.duration),
      title: video!.title,
      channel: channel?.username || "Unknown",
      views: `${video!.views} views`,
      timeAgo: formatTimeAgo(video!.createdAt),
      channelPic: channel?.avatar || "/user.png",
    };
  })

    setCurrentPlaylistVideos(formattedVideos);
    setIsFetchingVideos(false);
  };

  const removeVideo = (videoId: string) => {
    if (!activePlaylistId) return;

    // future store integration
    setCurrentPlaylistVideos((prev) =>
      prev.filter((v) => v.id !== videoId)
    );
    ToggleVideoInPlaylist(activePlaylistId,videoId)
  };


  if (isFecthingPlaylists) return <Loader />;

  return (
    <main className="min-h-screen bg-background w-full">
      <div className="container mx-auto px-4 py-10 space-y-14">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Your Playlists</h1>
          <p className="text-muted-foreground mt-1">
            Manage and play your collections
          </p>
        </div>

        {/* Playlists Grid */}
        {Playlists.Personal.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Playlists.Personal.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() =>
                  getPlaylistVideos(playlist.id, playlist.title)
                }
              >
                <PlaylistCard
                  {...playlist}
                  videosCount={playlist.videos.length}
                  onDelete={() => DeletePlaylist(playlist.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Music className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No playlists yet</p>
          </div>
        )}

        {/* Playlist Videos */}
        {activePlaylistName && (
          <section className="p-8 border border-border rounded-3xl">
            <h2 className="text-xl font-semibold mb-4">
              {activePlaylistName}
            </h2>

            {isFetchingVideos ? (
              <Loader />
            ) : (
              <HorizontalPlaylistVideoList
                canRemove
                videos={currentPlaylistVideos}
                onRemove={removeVideo}
              />
            )}
          </section>
        )}
      </div>
    </main>
  );
}
