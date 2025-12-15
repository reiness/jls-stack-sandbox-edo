import { BadgePill } from "../components/common/BadgePill"
import { EmptyState } from "../components/common/EmptyState"
import { InfoRow } from "../components/common/InfoRow"
import { InlineAlert } from "../components/common/InlineAlert"
import { PageHeader } from "../components/common/PageHeader"
import { SectionCard } from "../components/common/SectionCard"
import { Button } from "../components/ui/button"

export function ComponentsPage() {
  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Component Gallery"
        subtitle="A showcase of reusable components and patterns."
      />

      {/* Inline Alerts */}
      <SectionCard title="Inline Alerts" description="Contextual messages with tone variants.">
        <div className="space-y-4">
          <InlineAlert
            title="Update Available"
            message="A new version of JLS Stack is ready."
            tone="info"
          />
          <InlineAlert
            title="Success!"
            message="Your profile has been updated."
            tone="success"
          />
          <InlineAlert
            title="Warning"
            message="Your account is in sandbox mode."
            tone="warning"
          />
          <InlineAlert
            title="Error"
            message="Failed to connect to the server."
            tone="danger"
          />
        </div>
      </SectionCard>

      {/* Info Rows */}
      <SectionCard title="Info Rows" description="Standardized label-value pairs.">
        <div className="rounded-xl border-2 border-border/10 bg-card p-4">
          <InfoRow label="Version" value="1.0.0" />
          <InfoRow
            label="Status"
            value={<BadgePill label="Active" tone="default" />}
          />
          <InfoRow
            label="Plan"
            value="Pro Tier"
            action={
              <Button size="sm" variant="outline" className="h-7 text-xs">
                Manage
              </Button>
            }
          />
        </div>
      </SectionCard>

      {/* Empty States */}
      <SectionCard title="Empty State" description="Placeholder for missing content.">
        <EmptyState
          title="No Projects Found"
          description="You haven't created any projects yet. Start by creating your first workspace."
          action={<Button size="sm">Create Project</Button>}
        />
      </SectionCard>

       {/* Badges */}
       <SectionCard title="Badges" description="Simple status indicators.">
        <div className="flex gap-4">
          <BadgePill label="Default Badge" tone="default" />
          <BadgePill label="Subtle Badge" tone="subtle" />
        </div>
      </SectionCard>
    </div>
  )
}
