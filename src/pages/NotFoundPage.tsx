import { EmptyState } from "@/components/common/EmptyState"
import { SectionCard } from "@/components/common/SectionCard"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SectionCard title="404 - Lost in the Sandbox?" description="We couldn't find the page you were looking for.">
          <EmptyState
            title="Page Not Found"
            description="It seems you've ventured into uncharted territory. This route doesn't exist yet."
            action={
              <Button asChild size="lg" className="w-full">
                <Link to="/">Return to Dashboard</Link>
              </Button>
            }
          />
        </SectionCard>
      </div>
    </div>
  )
}