import { BadgePill } from "../components/common/BadgePill"
import { InlineAlert } from "../components/common/InlineAlert"
import { PageHeader } from "../components/common/PageHeader"
import { StatsRow } from "../components/dashboard/StatsRow"
import { SectionCard } from "../components/common/SectionCard"
import { EmptyState } from "../components/common/EmptyState"
import { Button } from "../components/ui/button"

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard" 
        subtitle="Your JLS Stack Sandbox command center." 
      />
      
      <InlineAlert 
        title="Welcome Back!" 
        message="You have 3 new notifications." 
        tone="info" 
      />

      <StatsRow 
        stats={[
          { label: "Routes", value: "3+" },
          { label: "Shell", value: <BadgePill label="Online" tone="default" /> },
          { label: "UI System", value: <BadgePill label="Growing" tone="subtle" /> },
        ]} 
      />

      <div className="pt-4">
        <InlineAlert 
          title="Routing is working!" 
          message="Check out the Playground to experiment with more components." 
          tone="success" 
        />
      </div>

      <SectionCard title="Tools Overview" description="Manage your custom utilities.">
        <EmptyState
          title="No Tools Found"
          description="You haven't created any custom tools yet. Start building your workspace toolkit."
          action={
            <Button asChild size="sm">
              <a href="/create-tool">Create Tool</a>
            </Button>
          }
        />
      </SectionCard>
    </div>
  )
}
