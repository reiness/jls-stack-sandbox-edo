import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"

type AlertTone = "info" | "success" | "warning" | "danger"

type InlineAlertProps = {
  title: string
  message: string
  tone?: AlertTone
}

export function InlineAlert({ title, message, tone = "info" }: InlineAlertProps) {
  const styles = {
    info: {
      container: "bg-accent/10 border-accent text-foreground",
      icon: <Info className="h-5 w-5 text-accent" />,
    },
    success: {
      container: "bg-green-500/10 border-green-500 text-foreground",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    warning: {
      container: "bg-yellow-500/10 border-yellow-500 text-foreground",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    },
    danger: {
      container: "bg-destructive/10 border-destructive text-foreground",
      icon: <XCircle className="h-5 w-5 text-destructive" />,
    },
  }

  const currentStyle = styles[tone]

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border-2 p-4 shadow-hard-sm ${currentStyle.container}`}
    >
      <div className="shrink-0 pt-0.5">{currentStyle.icon}</div>
      <div className="space-y-1">
        <h4 className="font-bold leading-none tracking-tight">{title}</h4>
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </div>
  )
}
