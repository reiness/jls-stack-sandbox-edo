type Tone = "default" | "subtle"

type BadgePillProps = {
  label: string
  tone?: Tone
}

export function BadgePill({ label, tone = "default" }: BadgePillProps) {
  const cls =
    tone === "default"
      ? "bg-accent/20 text-foreground border-accent"
      : "bg-muted text-muted-foreground border-border"

  return (
    <span className={`inline-flex items-center rounded-full border-2 px-2 py-0.5 text-xs font-bold ${cls}`}>
      {label}
    </span>
  )
}
