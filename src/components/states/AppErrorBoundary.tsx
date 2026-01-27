import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

type Props = { children: React.ReactNode }
type State = { hasError: boolean; error?: unknown }

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error }
  }

  componentDidCatch(error: unknown) {
    console.error("App crashed:", error)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-['Fredoka']">
        <Card className="max-w-lg w-full p-8 space-y-6 border-2 border-border shadow-hard rounded-3xl text-center">
          <div className="flex justify-center">
            <div className="bg-destructive/10 p-4 rounded-full border-2 border-border text-destructive shadow-hard-sm">
              <AlertTriangle className="h-10 w-10" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Oops! Something snapped.</h2>
            <p className="text-sm text-muted-foreground font-bold">
              The app hit an unexpected error. This is exactly why we use error boundaries—to avoid a blank screen and keep things cartoony.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all rounded-lg font-black tracking-wide h-12 px-8"
            >
                Reload App
            </Button>
            <Button 
                variant="outline" 
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="border-2 border-border shadow-hard-sm hover:translate-y-[2px] hover:shadow-none active:translate-y-[4px] transition-all rounded-lg font-bold h-12 px-8"
            >
                Try to recover
            </Button>
          </div>
        </Card>
      </div>
    )
  }
}
