"use client"

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Video, User, Loader2, X } from "lucide-react";
import { useDebounce } from "@/hooks/search-hook";
import { useSearchStore } from "@/Store/searchStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
};

export default function SearchBar({
  placeholder = "Search videos and channels...",
  className,
  defaultValue = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState(defaultValue);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const {
    suggestions,
    isLoadingSuggestions,
    getSuggestions,
    clearSuggestions,
    search,
  } = useSearchStore();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Fetch suggestions when debounced query changes
  React.useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      getSuggestions(debouncedQuery);
      setShowSuggestions(true);
    } else {
      clearSuggestions();
      setShowSuggestions(false);
    }
  }, [debouncedQuery, getSuggestions, clearSuggestions]);

  // Close suggestions when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query.trim()) {
      search(query.trim());
      router.push(`/search/${query.trim()}`);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  }

  function handleSuggestionClick(
    type: "video" | "user",
    id: string,
    title?: string
  ) {
    if (type === "video") {
      router.push(`/watch-video/${id}`);
    } else {
      router.push(`/channel/${id}`);
    }
    setShowSuggestions(false);
    if (title) setQuery(title);

  }

  function clearSearch() {
    setQuery("");
    clearSuggestions();
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  const hasResults =
    suggestions.videos.length > 0 || suggestions.users.length > 0;

  return (
    <div className="relative w-full max-w-2xl">
      <form
        role="search"
        aria-label="Site search"
        onSubmit={handleSubmit}
        className={cn(
          "relative flex w-full items-center gap-2 rounded-full px-4 py-2",
          "backdrop-blur-xl backdrop-saturate-150",
          "bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/20",
          `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.15)]`,
          "transition-all duration-200",
          showSuggestions && hasResults && "rounded-b-none",
          className
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center text-foreground/70"
        >
          <Search className="w-5 h-5" />
        </span>

        <label htmlFor="search-input" className="sr-only">
          Search
        </label>

        <input
          ref={inputRef}
          id="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent border-0 outline-none",
            "focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            "text-foreground placeholder:text-foreground/50",
            "h-10 px-0"
          )}
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-foreground/10 transition-colors"
          >
            <X className="w-4 h-4 text-foreground/70" />
          </button>
        )}

        {isLoadingSuggestions && (
          <Loader2 className="w-5 h-5 animate-spin text-foreground/70" />
        )}

        <Button
          size="sm"
          className={cn(
            "rounded-full px-5 py-2 bg-transparent font-medium transition-all duration-300 backdrop-blur-md",
            "hover:bg-foreground/10",
            "text-foreground"
          )}
        >
          Search
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && hasResults && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute top-full left-0 right-0 mt-0",
            "backdrop-blur-xl backdrop-saturate-200",
            "border border-t-0 ",
            "rounded-b-2xl shadow-2xl",
            "max-h-125 overflow-y-auto",
            "z-50"
          )}
        >
          {/* Videos Section */}
          {suggestions.videos.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4" />
                Videos
              </div>
              {suggestions.videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() =>
                    handleSuggestionClick("video", video.id, video.title)
                  }
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background/20 transition-colors text-left"
                >
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    height={20}
                    width={20}
                    className="w-20 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {video.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-foreground/60 mt-1">
                      {video.owner.avatar ? (
                        <Image
                          src={video.owner.avatar || "user.png"}
                          alt={video.owner.username}
                          className="w-4 h-4 rounded-full"
                          height={20}
                    width={20}
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-white  shrink-0">
                          {video.owner.username.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <span>{video.owner.username}</span>
                      <span>•</span>
                      <span>{video.views.toLocaleString()} views</span>
                    </div>
                  </div>
                  <Search className="w-4 h-4 text-foreground/40" />
                </button>
              ))}
            </div>
          )}

          {/* Users/Channels Section */}
          {suggestions.users.length > 0 && (
            <div className="p-2 border-t border-foreground/10">
              <div className="px-3 py-2 text-xs font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" />
                Channels
              </div>
              {suggestions.users.map((user) => (
                <button
                  key={user.id}
                  onClick={() =>
                    handleSuggestionClick("user", user.id, user.username)
                  }
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/5 transition-colors text-left"
                >
                  {
                    user.avatar ?<Image
                    src={user.avatar }
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                    height={50}
                    width={50}
                  />:
                  <Image
                    src={"/user.png"}
                    unoptimized
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                    height={20}
                    width={20}
                  />
                  }
                  
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {user.username}
                    </p>
                    <p className="text-xs text-foreground/60">Channel</p>
                  </div>
                  <Search className="w-4 h-4 text-foreground/40" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
