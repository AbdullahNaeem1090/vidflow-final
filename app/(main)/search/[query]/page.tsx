"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Video, User } from "lucide-react";
import { useSearchStore } from "@/Store/searchStore";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/page-components/Loader";

export default function SearchResultsPage() {
  
  const {query} = useParams<{query: string}>()

  const { searchResults,isSearching, search } = useSearchStore();

  const router = useRouter();

  // Call search ONCE on mount (or when query changes via URL)
  React.useEffect(() => {
    if (!query) return;
    if (query.trim()) {
      search(query.trim());
    }
  }, [query, search]);

  if (!query) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        Start typing to search videos or channels
      </div>
    );
  }

  if(isSearching){
    return <Loader />;
  }

  if(!searchResults){
    return <div className="text-center py-20">
            <h2 className="text-xl font-semibold">No results found</h2>
            <p className="text-muted-foreground mt-2">
              Try different keywords or check your spelling
            </p>
          </div>
  }

  return (
    <div className="mx-auto px-4 py-6 space-y-10 w-full">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-semibold">Search results for</h1>
        <p className="text-muted-foreground">“{query}”</p>
      </div>

     
      {/* Videos Section */}
      {searchResults.videos?.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Video className="h-5 w-5" />
            Videos
          </div>

          <div className="space-y-4">
            {searchResults.videos.map((video) => (
              <Card
                key={video.id}
                className="hover:bg-muted/40 transition cursor-pointer"
                onClick={()=>router.push(`/watch-video/${video.id}`)}
              >
                <CardContent className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="relative w-64 h-36 shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Meta */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {video.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {video.owner.avatar ? (
                        <Image
                          src={video.owner.avatar}
                          alt={video.owner.username}
                          width={24}
                          height={24}
                          className="rounded-full h-6 w-6 object-cover"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs">
                          {video.owner.username[0].toUpperCase()}
                        </div>
                      )}
                      <span>{video.owner.username}</span>
                      <span>•</span>
                      <span>{video.views.toLocaleString()} views</span>
                    </div>

                   
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Channels Section */}
      {searchResults.users?.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5" />
            Channels
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {searchResults.users.map((user) => (
              <Card
                key={user.id}
                className="hover:bg-muted/40 transition cursor-pointer"
                onClick={()=>router.push(`/channel/${user.id}`)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <Image
                    src={user.avatar || "/user.png"}
                    alt={user.username}
                    width={56}
                    height={56}
                    className="rounded-full object-cover h-20 w-20"
                  />

                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">Channel</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {!isSearching &&
        searchResults.videos?.length === 0 &&
        searchResults.users?.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold">No results found</h2>
            <p className="text-muted-foreground mt-2">
              Try different keywords or check your spelling
            </p>
          </div>
        )}
    </div>
  );
}
