"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuthStore } from "@/Store/authStore"
import Image from "next/image"

export function ChannelHeader({subscribersCount}:{subscribersCount:number}) {

  const {currUser}=useAuthStore()

  return (
    <div className="">

      {/* Channel Info */}
     <div className="relative h-[20vh] min-h-40 w-full overflow-hidden md:h-[25vh] rounded-2xl">
        
          <Image
            height={200}
            width={500}
            src={"/banner.png"}
            unoptimized
            alt="Channel Banner"
            className="h-full w-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
          />
        
         
      

        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 flex flex-col items-center gap-6 sm:-mt-16 sm:flex-row sm:items-end">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl sm:h-40 sm:w-40">
            <AvatarImage
              src={currUser?.avatar || "/user.png"}
              alt={currUser?.username}
              className="object-cover"
            />
            <AvatarFallback>{currUser?.username.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:pb-4 sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {currUser?.username}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {subscribersCount} subscribers
            </p>
            
          </div>
        </div>

        {/* Content Tabs */}
        
      </div>




    </div>
  )
}
