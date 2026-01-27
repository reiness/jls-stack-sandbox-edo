import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

type Props = {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: Props) {
  return (
    <Card className="p-8 border-2 border-border bg-destructive/5 shadow-hard rounded-3xl text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-destructive/10 p-3 rounded-full border-2 border-border text-destructive shadow-hard-sm">
          <AlertCircle className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground font-bold max-w-sm mx-auto">
            {message}
          </p>
        </div>

        {onRetry ? (
          <div className="pt-4">
            <Button 
              variant="outline" 
              onClick={onRetry}
              className="border-2 border-border shadow-hard-sm hover:translate-y-[2px] hover:shadow-none active:translate-y-[4px] transition-all rounded-lg font-black px-8"
            >
              Retry
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
