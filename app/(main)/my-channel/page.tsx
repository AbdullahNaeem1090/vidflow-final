"use client";

import {  useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChannelHeader } from "@/page-components/MyChannel/channel-header";
import { useAuthStore } from "@/Store/authStore";
import { VideoGrid } from "@/page-components/MyChannel/video-grid";
import { PlaylistManager } from "@/page-components/MyChannel/PlaylistManager";
import { subscription } from "@/data/subscribed";
import { useVideoStore } from "@/Store/videoStore";

export default function MyChannelPage() {
  const [activeTab, setActiveTab] = useState<"videos" | "playlists">("videos");
  const { currUser } = useAuthStore();
  const {videos}=useVideoStore()

  const videosArr =
    videos.filter(
      (video) => video.owner === currUser?.id
    ) ?? [];

  const subscribersCount=subscription.filter(
      (doc) => doc.subscribedTo === currUser?.id
    ).length;

  return (
    <main className="min-h-screen w-full bg-background">
      {/* Channel Header */}
      <ChannelHeader subscribersCount={subscribersCount} />

      {/* Content Section */}
      <div className="md:px-8 lg:px-12 py-8">
        <div className="w-full mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "videos" | "playlists")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 max-w-xs bg-muted">
              <TabsTrigger
                value="videos"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Videos
              </TabsTrigger>
              <TabsTrigger
                value="playlists"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Playlists
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-8">
              <VideoGrid videos={videosArr} />
            </TabsContent>

            <TabsContent value="playlists" className="mt-8">
              <PlaylistManager ChannelVideos={videosArr} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
