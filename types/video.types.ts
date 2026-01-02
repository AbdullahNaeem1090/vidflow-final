import { videoUploadSchema } from "@/zod/video-schema";
import { z } from "zod"

export type VideoUploadFormData = z.infer<typeof videoUploadSchema>


export interface IVideo {
  title: string;
  description?: string;
  owner: string;
  thumbnail: string;
  videoURL: string;
  duration: number;
}

export interface IHomeVideo {
  id:string
  thumbnail: string;
  duration: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  channelPic?:string
}

export interface ICurrentVideo {
  src: string;
  thumbnail: string;
  title: string;
  description: string;
  views: number;
  uploadedAt: string;
  likes: number;
  channel: {
    id:string
    name: string;
    subscribers: number;
    isSubscribed: boolean;
    avatar?: string;
  };
}

export interface IComment {
  id: string
  author: string
  avatar: string
  time: string
  text: string
}


export interface ChannelVideo {
  id: string
  title: string
  thumbnail: string
  views: string
  uploadedAt: string
}