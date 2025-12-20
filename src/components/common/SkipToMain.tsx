import { cn } from "@/lib/utils"

export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:px-4 focus:py-2",
        "bg-primary text-primary-foreground font-bold rounded-lg border-2 border-border shadow-hard",
        "outline-none focus:ring-4 focus:ring-ring/50"
      )}
    >
      Skip to main content
    </a>
  )
}
