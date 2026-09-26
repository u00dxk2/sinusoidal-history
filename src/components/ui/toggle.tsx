"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// Colours use THIS site's tokens (globals.css @theme); the shadcn defaults (bg-accent, bg-muted,
// ring-ring, border-input, destructive) are undefined here and rendered with no colour. The
// palette has no destructive red, so the aria-invalid styling (which never rendered) is dropped.
// Pinned by src/lib/uiTokens.test.ts. An icon-only Toggle has no text of its own — callers must
// pass aria-label.
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-paper-deep hover:text-ink-soft focus-visible:border-ink focus-visible:ring-[3px] focus-visible:ring-ink/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-paper-deep data-[state=on]:text-ink [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-rule-soft bg-transparent shadow-xs hover:bg-paper-deep hover:text-ink",
      },
      size: {
        default: "h-9 min-w-9 px-2",
        sm: "h-8 min-w-8 px-1.5",
        lg: "h-10 min-w-10 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
