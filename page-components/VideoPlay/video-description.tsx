"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function VideoDescription({
  description,
  className,
}: {
  description: string
  className?: string
}) {
  const [expanded, setExpanded] = React.useState(false)
//   const MAX_LINES = 3

  return (
    <section aria-label="Video description" className={cn("rounded-lg bg-muted/50 p-4", className)}>
      <pre className={cn("whitespace-pre-wrap text-sm leading-relaxed", !expanded && "line-clamp-3")}>
        {description}
      </pre>
      <div className="mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-controls="video-description-content"
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      </div>
    </section>
  )
}
