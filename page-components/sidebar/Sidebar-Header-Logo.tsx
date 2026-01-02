"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { Youtube } from 'lucide-react';

export function SidebarHeaderLogo() {
  const { open } = useSidebar();

  return (
    <SidebarMenu className='bg-background' >
      <SidebarMenuItem >
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent mx-auto cursor-pointer"
        >
          {open ? (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-3xl font-satisfy p-1">
                VidFlow
              </span>
            </div>
          ) : (
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg hover:bg-accent text-white group-data-[state=open]:hidden">
              <Youtube className="m-auto size-7" />
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
