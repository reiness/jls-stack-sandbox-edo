import { PageHeader } from "../components/common/PageHeader";
import { SectionCard } from "../components/common/SectionCard";

export function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <PageHeader 
        title="Help & Documentation" 
        subtitle="Find resources, guides, and support for your JLS Stack journey."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Week 1 Docs */}
        <SectionCard 
          title="Week 1 Docs" 
          description="Environment setup"
        >
          <ul className="text-sm text-muted-foreground font-bold opacity-80 list-disc list-inside space-y-2">
            <li>Stack basics</li>
            <li>Getting started</li>
          </ul>
        </SectionCard>

        {/* Card 2: Week 2 UI/UX Docs */}
        <SectionCard 
          title="Week 2 UI/UX Docs" 
          description="UI/UX principles"
        >
          <ul className="text-sm text-muted-foreground font-bold opacity-80 list-disc list-inside space-y-2">
            <li>Layout techniques</li>
            <li>Component styling</li>
          </ul>
        </SectionCard>

        {/* Card 3: Mentor Help */}
        <SectionCard 
          title="Ask for Help" 
          description="Stuck on a problem?"
        >
          <ul className="text-sm text-muted-foreground font-bold opacity-80 list-disc list-inside space-y-2">
            <li>Need a code review?</li>
            <li>Ping a mentor!</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  )
}