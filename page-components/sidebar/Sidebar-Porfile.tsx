"use client"

import {
  ChevronsUpDown,
  LogOut,
  SunMoon,
  User2,
} from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

// import { useTheme } from '@/hooks/theme-provider';
import { useAuthStore } from '@/Store/authStore';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';


export function SidebarProfile({
  user,
}: {
  user: {
    name: string|undefined;
    email: string|undefined;
    avatar: string|undefined;
  };
}) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const {logout,currUser}= useAuthStore();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.avatar||"/user.png"}
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg">
                    {currUser?.username.charAt(0)??"User"}
                  
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.name}
                </span>
                <span className="truncate text-xs">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={currUser?.avatar||"/user.png"}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {currUser?.username.charAt(0)??"User"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currUser?.username??user.name}
                  </span>
                  <span className="truncate text-xs">
                    {currUser?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/edit-profile")}>
                <User2 />
                Edit Account 
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setTheme(
                    theme == 'dark'
                      ? 'light'
                      : 'dark',
                  )
                }
              >
                <SunMoon />
                Switch Theme
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>{
              router.push("/login")
              logout()}}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
