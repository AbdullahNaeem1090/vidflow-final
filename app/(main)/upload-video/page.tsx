"use client"


import { VideoUploadForm } from "@/page-components/video-upload/upload-form";
import { useEffect } from "react";
import { toast } from "sonner";

export default function VideoUploadPage() {

  useEffect(()=>{
   toast.info("Its free tear from Supabase. Upload Short Videos 😊")
  },[])

  return (
    <main className="min-h-screen bg-background  md:p-8 lg:p-12 w-full">
      <div className="mx-auto">
        <VideoUploadForm/>
      </div>
    </main>
  )
}
