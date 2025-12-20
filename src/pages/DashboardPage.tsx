import { QualityBadge } from "../components/common/QualityBadge"
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
          { label: "Shell", value: <QualityBadge label="Online" status="pass" /> },
          { label: "UI System", value: <QualityBadge label="Polished" status="pass" /> },
        ]} 
      />

      <SectionCard title="Quick Actions" description="Jumpstart your workflow.">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Button variant="outline" className="h-24 flex-col gap-2 border-2 border-dashed border-border/60 hover:border-primary hover:bg-primary/5" asChild>
            <a href="/create-tool">
              <span className="text-2xl">🛠️</span>
              <span className="font-bold">New Tool</span>
            </a>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 border-2 border-dashed border-border/60 hover:border-accent hover:bg-accent/5" asChild>
            <a href="/quality">
              <span className="text-2xl">💎</span>
              <span className="font-bold">Quality Check</span>
            </a>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 border-2 border-dashed border-border/60 hover:border-destructive hover:bg-destructive/5" asChild>
            <a href="/settings">
              <span className="text-2xl">⚙️</span>
              <span className="font-bold">Settings</span>
            </a>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 border-2 border-dashed border-border/60 hover:border-secondary hover:bg-secondary/5" asChild>
            <a href="/help">
              <span className="text-2xl">📚</span>
              <span className="font-bold">Docs</span>
            </a>
          </Button>
        </div>
      </SectionCard>

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
