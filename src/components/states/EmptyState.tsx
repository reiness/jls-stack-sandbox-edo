import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { PackageOpen } from "lucide-react"

type Props = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
  action,
}: Props) {
  return (
    <div className="bg-card border-2 border-border shadow-hard rounded-3xl p-12 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-hard-sm text-muted-foreground">
          {icon || <PackageOpen className="h-8 w-8" />}
        </div>

        <h2 className="text-2xl font-black tracking-tight">{title}</h2>

        {description ? (
          <p className="text-sm text-muted-foreground font-bold">{description}</p>
        ) : null}

        {(actionLabel || secondaryActionLabel || action) ? (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            {actionLabel && onAction ? (
              <Button
                onClick={onAction}
                className="bg-primary text-primary-foreground border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all rounded-lg font-black tracking-wide h-11 px-6"
              >
                {actionLabel}
              </Button>
            ) : null}

            {secondaryActionLabel && onSecondaryAction ? (
              <Button
                variant="outline"
                onClick={onSecondaryAction}
                className="border-2 border-border shadow-hard-sm hover:translate-y-[2px] hover:shadow-none active:translate-y-[4px] transition-all rounded-lg font-bold h-11 px-6"
              >
                {secondaryActionLabel}
              </Button>
            ) : null}

            {action}
          </div>
        ) : null}
      </div>
    </div>
  )
}
