import { BadgePill } from "../components/common/BadgePill"
import { PageHeader } from "../components/common/PageHeader"
import { StatsRow } from "../components/dashboard/StatsRow"

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        subtitle="Your JLS Stack Sandbox command center." 
      />
      
      <StatsRow 
        stats={[
          { label: "Routes", value: "3+" },
          { label: "Shell", value: <BadgePill label="Online" tone="default" /> },
          { label: "UI System", value: <BadgePill label="Growing" tone="subtle" /> },
        ]} 
      />

      <div className="p-4 bg-muted border-2 border-border rounded-lg shadow-hard-sm">
        <p className="text-sm text-muted-foreground font-bold opacity-80">
           Routing is working! check out the playground.
        </p>
      </div>
    </div>
  )
}
