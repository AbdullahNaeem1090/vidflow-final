"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

 interface ChannelCardProps {
  id: string
  name: string
  subscriberCount: number
  avatar: string
  description?: string
  onUnsubscribe: (id: string) => void
  onNotificationToggle?: (id: string) => void
}

export function ChannelCard({
  id,
  name,
  subscriberCount,
  description,
  avatar,
  onUnsubscribe,
}: ChannelCardProps) {

  const handleUnsubscribe = () => {
    onUnsubscribe(id)
  }

const router=useRouter()
  const formatSubscribers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div
      className="group relative bg-card border border-border rounded-lg p-4 transition-all duration-300 hover:shadow-xl hover:border-accent/50"
     
      onClick={()=>router.push(`/channel/${id}`)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          {
            avatar ? 
            <Image
            src={avatar}
            alt={name}
            width={50}
            height={50}
            className="rounded-md h-20 w-20  object-cover   transition-all duration-300 group-hover:ring-accent/50"
          />:
          <Image
            src={"/user.png"}
            alt={name}
            width={50}
            height={50}
            unoptimized
            className="rounded-md h-20 w-20 object-cover  transition-all duration-300 group-hover:ring-accent/50"
          />
          }
          
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg truncate  transition-colors">
            {name}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">{formatSubscribers(subscriberCount)} subscribers</p>
          {description && <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{description}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          

          <DropdownMenu>
            <DropdownMenuTrigger asChild  onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e)=>{
                e.stopPropagation()
                handleUnsubscribe()}} className="text-destructive">
                Unsubscribe
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
