"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal} from "lucide-react";
import { subscription } from "@/data/subscribed";
import { useSubscriptionStore } from "@/Store/susbcriptionStore";
import { useAuthStore } from "@/Store/authStore";
import Loader from "../Loader";

export function VideoMeta({
  channel,
  // likes,
  className,
  OpenPlaylistDialog,
}: {
  channel: {
    id:string
    name: string;
    avatar?: string;
    subscribers: number;
    isSubscribed: boolean;
  };
  likes: number;
  className?: string;
  OpenPlaylistDialog: () => void;
}) {

  const {getSubscriberCount,isSubscribed,toggleSubscription}=useSubscriptionStore()
  const {currUser}=useAuthStore()
  if(!currUser){
    return <Loader/>
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={channel.avatar || "/user.png"}
            alt={`${channel.name} avatar`}
          />
          <AvatarFallback>
            {channel.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium leading-tight">{channel.name}</p>
          <p className="text-xs text-muted-foreground">
            {getSubscriberCount(channel.id)} subscribers
          </p>
        </div>

        <div className="ml-1 flex items-center gap-2">
          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <Button size="sm" onClick={()=>toggleSubscription(currUser.id,channel.id)} >
            {isSubscribed(currUser.id,channel.id) ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center overflow-hidden rounded-lg border">
          {/* <Button
            variant={liked ? "default" : "ghost"}
            className="h-9 rounded-none px-3"
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label="Like"
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            <span className="tabular-nums">{likeCount.toLocaleString()}</span>
          </Button> */}
        </div>

        {/* <Button variant="outline" className="h-9 bg-transparent">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 bg-transparent"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={OpenPlaylistDialog}>
              Save to playlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
