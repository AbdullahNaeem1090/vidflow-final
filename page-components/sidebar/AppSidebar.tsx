'use client';

import * as React from 'react';
import {
  Home,
  LaptopMinimalCheck,
  Tv,
  History,
  Plus,
  SquarePlay,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { SidebarHeaderLogo } from './Sidebar-Header-Logo';
import { SidebarProfile } from './Sidebar-Porfile';
import { useAuthStore } from '@/Store/authStore';
import { SidebarNavOptions } from './Sidebar-Navigation-Options';

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {

  const {currUser}=useAuthStore()

  const data = {
  user: {
    name: currUser?.username,
    email: currUser?.email,
    avatar: currUser?.avatar,
  },

  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
    {
      title: 'My Channel',
      url: '/my-channel',
      icon:Tv ,
    },
    {
      title: 'Playlists',
      url: '/my-playlists',
      icon: SquarePlay, 
    },
    {
      title: 'Subscriptions',
      url: '/subscriptions',
      icon: LaptopMinimalCheck,
    },
    {
      title: 'Watch History',
      url: '/history',
      icon: History,
    },
    {
      title: 'Create',
      url: '/upload-video',
      icon: Plus,
    },
  ],
 
};

  return (
    <Sidebar
      className="px-2.5"
      {...props}

    >
      <SidebarHeader className="h-28 justify-center bg-background">
        <SidebarHeaderLogo />
      </SidebarHeader>
      <SidebarContent className='bg-background'>
        <SidebarNavOptions items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className='bg-background'>
        <SidebarProfile user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
