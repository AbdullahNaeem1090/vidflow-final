"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/page-components/Other-Channels/video-cards";
import { PlaylistCard } from "@/page-components/Other-Channels/playlist-card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Loader from "@/page-components/Loader";
import { PlaylistVideo } from "@/page-components/Playlists/playlist-videos";
import HorizontalPlaylistVideoList from "@/page-components/Playlists/playlist-videos";
import { channelData, useAuthStore } from "@/Store/authStore";
import { useSubscriptionStore } from "@/Store/susbcriptionStore";
import { usePlaylistStore } from "@/Store/playlistStore";
import { useVideoStore } from "@/Store/videoStore";
import {  formatTimeAgo} from "@/lib/helper";



export default function ChannelPage() {
  const router=useRouter()
  const { id } = useParams<{id:string}>();
  const [channelData, setChannelData] = useState<channelData | null>(null);
  const{currUser,getChannelData,users}=useAuthStore()
  const {playlists}=usePlaylistStore()
const {videos}=useVideoStore()
  const {toggleSubscription,isSubscribed,getSubscriberCount}=useSubscriptionStore()

  const [currentPlaylistVideos, setCurrentPlaylistVideos] = useState<
    PlaylistVideo[]
  >([]);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);
  const [activePlaylistName, setActivePlaylistName] = useState<string | null>(
    null
  );



const getPlaylistVideos = async (
    playlistId: string,
    playlistName: string
  ) => {
    setIsFetchingVideos(true);
    setActivePlaylistName(playlistName);

    const plist = playlists.find(
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



useEffect(() => {
  if (!id) return;
  function func(){
    setChannelData(getChannelData(id));
  }
  func()
}, [id, getChannelData]);

  if (!channelData ) {
    return <Loader />;
  }

  if(!currUser){
    return <p>No user</p>
  }


  return (
    <div className="min-h-screen bg-background w-full">
      {/* Banner Section */}
      <div className="relative h-[20vh] min-h-40 w-full overflow-hidden md:h-[25vh] rounded-2xl">
        {channelData.bannerImage ? (
          <Image
            height={200}
            width={500}
            src={channelData.bannerImage || "/banner.png"}
            alt="Channel Banner"
            className="h-full w-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
          />
        ) : (
          <Image
            height={200}
            width={500}
            src={"/banner.png"}
            alt="Channel Banner"
            unoptimized
            className="h-full w-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 flex flex-col items-center gap-6 sm:-mt-16 sm:flex-row sm:items-end">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl sm:h-40 sm:w-40">
            <AvatarImage
              src={channelData.profilePic || "/user.png"}
              alt={channelData.name}
              className="object-cover"
            />
            <AvatarFallback>{channelData.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:pb-4 sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {channelData.name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {getSubscriberCount(id)} subscribers
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
              <Button
                onClick={()=>toggleSubscription(currUser.id,id)}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                { isSubscribed(currUser.id,id)? "Subscribed" : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0 gap-8">
              <TabsTrigger
                value="videos"
                className="rounded-t-lg border-b-2 border-transparent px-2 pb-4 pt-2 text-base font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                Videos
              </TabsTrigger>
              <TabsTrigger
                value="playlists"
                className="rounded-t-lg border-b-2 border-transparent px-2 pb-4 pt-2 text-base font-medium data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                Playlists
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-8">
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {channelData.videos.map((video) => (
                  <div key={video.id} onClick={()=>router.push(`watch-video/${video.id}`)}>
                  <VideoCard  video={video} />
                  </div>
                ))}
              </div>
            </TabsContent>

           <TabsContent value="playlists" className="mt-8">
  {channelData.playlists.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <svg
          className="mx-auto h-16 w-16 text-muted-foreground mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
          />
        </svg>
        <h3 className="text-lg font-semibold mb-2">No playlists yet</h3>
        <p className="text-muted-foreground text-sm">
          This channel hasnt created any public playlists yet.
        </p>
      </div>
    </div>
  ) : (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {channelData.playlists.map((playlist, i) => (
          <div
            key={i}
            onClick={() =>
              getPlaylistVideos(playlist.id, playlist.title)
            }
          >
            <PlaylistCard key={playlist.id} playlist={playlist} />
          </div>
        ))}
      </div>
      {activePlaylistName && (
        <section className="mt-5 p-8 border border-border rounded-3xl">
          <h2 className="text-xl font-semibold mb-4">
            {activePlaylistName}
          </h2>

          {isFetchingVideos ? (
            <Loader />
          ) : (
            <HorizontalPlaylistVideoList
              canRemove={false}
              videos={currentPlaylistVideos}
              onRemove={() => {}}
            />
          )}
        </section>
      )}
    </>
  )}
</TabsContent>
          </Tabs>
        </div>
      </div>

      <footer className="mt-20 border-t py-12 text-center text-sm text-muted-foreground">
        <p>© 2025 {channelData.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
