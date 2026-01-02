"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ChannelCard } from "@/page-components/Subscription/subscribed-channel-card";
import { useSubscriptionStore } from "@/Store/susbcriptionStore";

interface Channel {
  id: string;
  name: string;
  subscriberCount: number;
  avatar: string;
  description: string;
}

export default function SubscribedChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelToUnsubscribe, setChannelToUnsubscribe] = useState<string | null>(null);

  const { getUserSubscriptions,toggleSubscription } = useSubscriptionStore();

  const currUserId = "1"; // replace with authStore.currUser?.id in real app

  // Load subscriptions on mount
  useEffect(() => {
    if (!currUserId) return;

    const subs = getUserSubscriptions(currUserId); // returns formatted channels
    function setValue(){

      setChannels(subs||[]);
    setIsLoading(false);
    }
    setValue()
    
  }, [currUserId, getUserSubscriptions]);

  // Handle unsubscribe click
  const handleUnsubscribe = (id: string) => {
    setChannelToUnsubscribe(id);
  };

  // Confirm unsubscribe
  const confirmUnsubscribe = () => {
    if (!channelToUnsubscribe) return;

    // Toggle subscription in store
    toggleSubscription(currUserId, channelToUnsubscribe);

    // Update local state
    setChannels((prev) => prev.filter((ch) => ch.id !== channelToUnsubscribe));
    setChannelToUnsubscribe(null);

    toast.success("Unsubscribed successfully");
  };

  // Filter channels based on search
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background w-full">
      <div className="mx-auto sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Subscribed Channels</h1>
          <p className="text-muted-foreground">
            Manage your {channels.length} subscribed channel{channels.length !== 1 && "s"}
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search channels..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20 text-muted-foreground">
            Loading subscriptions...
          </div>
        ) : filteredChannels.length > 0 ? (
          <div className="space-y-4">
            {filteredChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                {...channel}
                onUnsubscribe={handleUnsubscribe}
                onNotificationToggle={(id: string) => console.log("Notification toggle:", id)}
              />
            ))}
          </div>
        ) : channels.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold">No subscribed channels</h3>
            <p className="text-muted-foreground">
              Subscribe to channels to see them here
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold">No channels found</h3>
          </div>
        )}
      </div>

      {/* Unsubscribe Dialog */}
      <AlertDialog
        open={channelToUnsubscribe !== null}
        onOpenChange={(open) => !open && setChannelToUnsubscribe(null)}
    
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsubscribe?</AlertDialogTitle>
            <AlertDialogDescription>
              You can subscribe again anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e)=>{
              e.stopPropagation()
              confirmUnsubscribe()
              }} className="bg-destructive">
              Unsubscribe
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
