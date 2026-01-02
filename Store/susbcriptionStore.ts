import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscription } from "@/data/subscribed";
import { useAuthStore } from "./authStore";

export interface Subscription {
  id: string;
  subscriber: string; // userId
  subscribedTo: string; // channelId
}

interface SubscriptionState {
  subscriptions: Subscription[];

  toggleSubscription: (subscriberId: string, channelId: string) => void;

  isSubscribed: (subscriberId: string, channelId: string) => boolean;
  getSubscriberCount: (channelId: string) => number;
  getUserSubscriptions: (subscriberId: string) => ({
    id: string;
    name: string;
    subscriberCount: number;
    description: string;
    avatar: string;
})[]
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: subscription,

      // ✅ Subscribe to a channel
      toggleSubscription: (subscriberId, channelId) => {
        const { subscriptions } = get();

        const existing = subscriptions.find(
          (s) => s.subscriber === subscriberId && s.subscribedTo === channelId
        );

        // ❌ Unsubscribe
        if (existing) {
          set({
            subscriptions: subscriptions.filter((s) => s.id !== existing.id),
          });
          return;
        }

        // ✅ Subscribe
        const newSubscription = {
          id: crypto.randomUUID(),
          subscriber: subscriberId,
          subscribedTo: channelId,
        };

        set({
          subscriptions: [...subscriptions, newSubscription],
        });
      },

      // 🔍 Check subscription status
      isSubscribed: (subscriberId, channelId) => {
        return get().subscriptions.some(
          (s) => s.subscriber === subscriberId && s.subscribedTo === channelId
        );
      },

      // 👥 Get subscriber count for a channel
      getSubscriberCount: (channelId) => {
        return get().subscriptions.filter((s) => s.subscribedTo === channelId)
          .length;
      },

      // 📺 Get all channels a user subscribed to
      getUserSubscriptions: (subscriberId: string) => {
  const authStore = useAuthStore.getState();
  const users = authStore.users;

  const subscribedRecords = get().subscriptions.filter(
    (s) => s.subscriber === subscriberId
  );

  const channelIds = Array.from(
    new Set(subscribedRecords.map((s) => s.subscribedTo))
  );

  // Only include channels that exist in the users array
  const subscribedChannels = channelIds.reduce<{
    id: string;
    name: string;
    subscriberCount: number;
    description: string;
    avatar: string;
  }[]>((acc, channelId) => {
    const channelUser = users.find((u) => u.id === channelId);
    if (!channelUser) return acc; // skip if user not found

    const subscriberCount = get().subscriptions.filter(
      (s) => s.subscribedTo === channelId
    ).length;

    acc.push({
      id: channelUser.id,
      name: channelUser.username,
      subscriberCount,
      description: "",
      avatar: channelUser.avatar || "/user.png",
    });

    return acc;
  }, []);

  return subscribedChannels;
},

    }),
    {
      name: "subscriptions-storage", // localStorage key
    }
  )
);
