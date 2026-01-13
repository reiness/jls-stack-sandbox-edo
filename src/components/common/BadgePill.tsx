type BadgeVariant = "primary" | "accent" | "destructive" | "secondary" | "outline" | "success" | "warning" | "info"

type BadgePillProps = {
  label: string
  variant?: BadgeVariant
}

export function BadgePill({ label, variant = "outline" }: BadgePillProps) {
  const baseClasses = "inline-flex items-center border-2 border-border px-2 py-0.5 text-xs font-black rounded-lg transition-all"
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground shadow-hard-sm",
    accent: "bg-accent text-accent-foreground shadow-hard-sm",
    destructive: "bg-destructive text-destructive-foreground shadow-hard-sm",
    secondary: "bg-muted text-muted-foreground shadow-hard-sm",
    outline: "bg-transparent text-foreground shadow-none",
    success: "bg-emerald-400 text-black shadow-hard-sm",
    warning: "bg-amber-400 text-black shadow-hard-sm",
    info: "bg-sky-300 text-black shadow-hard-sm"
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {label}
    </span>
  )
}
