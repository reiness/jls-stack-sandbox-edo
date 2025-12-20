import { cn } from "@/lib/utils"
import { CheckCircle, AlertTriangle, XCircle, MinusCircle } from "lucide-react"

export type QualityStatus = "pass" | "fail" | "warn" | "neutral"

type QualityBadgeProps = {
  label: string
  status?: QualityStatus
  className?: string
}

export function QualityBadge({ label, status = "neutral", className }: QualityBadgeProps) {
  const styles = {
    pass: {
      container: "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    fail: {
      container: "bg-red-100 text-red-700 border-red-200",
      icon: <XCircle className="h-3 w-3" />,
    },
    warn: {
      container: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <AlertTriangle className="h-3 w-3" />,
    },
    neutral: {
      container: "bg-slate-100 text-slate-700 border-slate-200",
      icon: <MinusCircle className="h-3 w-3" />,
    },
  }

  const currentStyle = styles[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold transition-all hover:scale-105",
        currentStyle.container,
        className
      )}
    >
      {currentStyle.icon}
      {label}
    </span>
  )
}
