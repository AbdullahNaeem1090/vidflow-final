"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { useVideoStore } from "@/Store/videoStore";
import { useState } from "react";

/* ---------------- DUMMY DATA ---------------- */

const DUMMY_VIDEOS = [
  {
    name: "Dummy Video One",
    url: "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/Videos/1766742045991-WhatsApp%20Video%202025-12-15%20at%2010.29.29%20PM.mp4",
    duration: 5,
  },
  {
    name: "Cinematic Intro",
    url: "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/Videos/1767204480226-WhatsApp%20Video%202025-12-15%20at%208.09.37%20PM.mp4",
    duration: 11,
  },
  {
    name: "Tutorial Video",
    url: "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/Videos/1766909074271-WhatsApp%20Video%202025-12-15%20at%2010.32.41%20PM.mp4",
    duration: 15,
  },
];

const DUMMY_THUMBNAILS = [
  "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/thumbnails/1764431470877-3d.webp",
  "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/thumbnails/1764438887221-vr.jpeg",
  "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/thumbnails/1766741959089-Unity.webp",
  "https://rvrudbxrmazuiftvioaw.supabase.co/storage/v1/object/public/thumbnails/1766742050982-nft.webp",
];

interface VideoFormData {
  title: string;
  description: string;
}

export function VideoUploadForm() {
  const { uploadVideo } = useVideoStore();

  const form = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const [selectedVideo, setSelectedVideo] = useState<typeof DUMMY_VIDEOS[0] | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = (data: VideoFormData) => {
    if (!selectedVideo || !selectedThumbnail) {
      toast.warning("Please select both video and thumbnail");
      return;
    }

    uploadVideo({
      videoUrl: selectedVideo.url,
      thumbnail: selectedThumbnail,
      title: data.title,
      description: data.description,
      duration: selectedVideo.duration,
    },form.reset);

    setSelectedVideo(null);
    setSelectedThumbnail(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Upload Your Video
        </h1>
        <p className="text-muted-foreground">
          Select a video, thumbnail and publish
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* SELECT VIDEO */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Video</Label>
            <div className="grid sm:grid-cols-3 gap-4">
              {DUMMY_VIDEOS.map((video) => (
                <button
                  key={video.url}
                  type="button"
                  onClick={() => setSelectedVideo(video)}
                  className={`p-4 border rounded-lg text-left transition
                    ${
                      selectedVideo?.url === video.url
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted"
                    }`}
                >
                  <p className="font-medium">{video.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {video.duration}s
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* SELECT THUMBNAIL */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Thumbnail</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {DUMMY_THUMBNAILS.map((thumb) => (
                <button
                  key={thumb}
                  type="button"
                  onClick={() => setSelectedThumbnail(thumb)}
                  className={`rounded-lg overflow-hidden border-2 transition
                    ${
                      selectedThumbnail === thumb
                        ? "border-primary scale-105"
                        : "border-transparent hover:border-muted"
                    }`}
                >
                  <Image
                    src={thumb}
                    alt="Thumbnail"
                    width={200}
                    height={120}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* TITLE */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Enter video title"
              {...form.register("title", { required: true })}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              rows={4}
              {...form.register("description")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* SUBMIT */}
          <Button type="submit" className="w-full">
            Publish Video
          </Button>
        </form>
      </Card>
    </div>
  );
}
