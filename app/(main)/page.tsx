"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useVideoStore } from "@/Store/videoStore";
import VideoCard from "@/page-components/Home/video-card";
import Loader from "@/page-components/Loader";



export default function HomePage() {
  const { HomeVideos, fetchVideos, isfetchingHomeVideos, hasMore } =
    useVideoStore();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (HomeVideos.length === 0) fetchVideos();
  }, [fetchVideos, HomeVideos.length]);

  useEffect(() => {
    if (inView && hasMore) fetchVideos();
  }, [inView, hasMore, fetchVideos]);

  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full ">
      {HomeVideos.map((video, i) => (
        <VideoCard key={i} {...video} />
      ))}

      {hasMore && (
        <div ref={ref} className="col-span-full flex justify-center py-6">
          {isfetchingHomeVideos ? (
            <Loader />
          ) : hasMore ? (
            <span className="text-gray-500 font-medium">
              
            </span>
          ) : (
            <span className="text-gray-400 font-medium">No more videos</span>
          )}
        </div>
      )}
    </div>
  );
}
