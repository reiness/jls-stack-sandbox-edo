import { EmptyState } from "../components/common/EmptyState"
import { PageHeader } from "../components/common/PageHeader"
import { Button } from "../components/ui/button"

export function ActivityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Recent Activity"
        subtitle="Track your progress and system events."
      />

      <EmptyState
        title="No Recent Activity"
        description="You haven't performed any actions yet. Start by exploring the sandbox."
        action={<Button>Explore Playground</Button>}
      />
    </div>
  )
}
