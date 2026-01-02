"use client";
import { Separator } from "@/components/ui/separator";
import { formatTimeAgo } from "@/lib/helper";
import Loader from "@/page-components/Loader";
import { AddToPlaylistDialog } from "@/page-components/Playlists/playlist-manager";
import { Comments } from "@/page-components/VideoPlay/comments";
import { RecommendedList } from "@/page-components/VideoPlay/recommended";
import { VideoDescription } from "@/page-components/VideoPlay/video-description";
import { VideoMeta } from "@/page-components/VideoPlay/video-meta";
import { VideoPlayer } from "@/page-components/VideoPlay/video-player";
import { useAuthStore } from "@/Store/authStore";
import { IPlaylist, usePlaylistStore } from "@/Store/playlistStore";
import { useVideoStore } from "@/Store/videoStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WatchPage() {
  const { VideoId } = useParams<{ VideoId: string }>();

  const { fetchCurrentVideo, CurrentVideo, isFetchingCurrVideo } =
    useVideoStore();

  const { Playlists, CreatePlaylist,getPlaylists,ToggleVideoInPlaylist } = usePlaylistStore();
  const {currUser}=useAuthStore()

  const [IsPlaylistBoxOpen, SetIsPlaylistBoxOpen] = useState(false);
  const [VideoIdToAdd, SetVideoIdToAdd] = useState("");

  useEffect(() => {
    if(!currUser) return
    if (VideoId) fetchCurrentVideo(VideoId);
     getPlaylists(currUser?.id)
  }, [VideoId,currUser,fetchCurrentVideo,getPlaylists],);

  const handleCreatePlaylist = async (name: string) => {
    if(!currUser) return
    const newPlaylist: IPlaylist = {
      id: "",
      title: name,
      description: "",
      category: "Personal",
      videos: [VideoId],
      owner:currUser?.id
    };

    CreatePlaylist(name, "Personal", newPlaylist);
  };


  if (!CurrentVideo || isFetchingCurrVideo || !VideoId) {
    return <Loader />;
  }


// console.log(Playlists)
  return (
    <main className="mx-auto w-full md:p-4 ">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* LEFT SIDE */}
        <section className="space-y-4">
          {/* --- VIDEO PLAYER OR SKELETON --- */}

          <VideoPlayer
            src={CurrentVideo?.src ?? ""}
            poster={CurrentVideo?.thumbnail ?? ""}
            title={CurrentVideo?.title ?? ""}
          />

          {/* --- TITLE + META --- */}
          <div className="space-y-3">
            <h1 className="text-xl font-semibold md:text-2xl">
              {CurrentVideo?.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>
                {CurrentVideo?.views
                  ? CurrentVideo.views.toLocaleString()
                  : "—"}{" "}
                views
              </span>
              <span aria-hidden="true">•</span>
              <span>{formatTimeAgo(CurrentVideo?.uploadedAt) ?? ""}</span>
            </div>

            <VideoMeta
              channel={CurrentVideo.channel}
              likes={CurrentVideo?.likes ?? 0}
              OpenPlaylistDialog={() => {
                SetVideoIdToAdd(VideoId);
                SetIsPlaylistBoxOpen(true);
              }}
            />
          </div>

          {/* --- DESCRIPTION --- */}

          <VideoDescription description={CurrentVideo?.description ?? ""} />

          <Separator />

          <Comments />
        </section>

        {/* RIGHT SIDE — RECOMMENDED */}
        <aside aria-label="Recommended videos">
          <RecommendedList  />
        </aside>
      </div>

      <AddToPlaylistDialog
        isOpen={IsPlaylistBoxOpen}
        onOpenChange={SetIsPlaylistBoxOpen}
        videoId={VideoIdToAdd}
        playlists={ Playlists.Personal }
        onVideoTogglePlaylist={ToggleVideoInPlaylist}
        onCreatePlaylist={handleCreatePlaylist}
      />
    </main>
  );
}
