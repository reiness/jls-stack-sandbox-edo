import { SectionCard } from "@/components/common/SectionCard"
import { PageHeader } from "@/components/common/PageHeader"
import { QualityBadge } from "@/components/common/QualityBadge"

export function QualityPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Quality Assurance"
        subtitle="Internal audit of UI polish and accessibility compliance."
      />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Brand Identity / Direction */}
        <div className="md:col-span-2">
          <SectionCard title="Brand Identity: Art Box" description="Core visual direction for the sandbox.">
            <div className="space-y-4">
              <p className="text-sm font-medium">
                Our goal is to create a <span className="font-bold text-primary">Playful</span>, <span className="font-bold text-secondary-foreground">Web-Native</span>, and <span className="font-bold text-destructive">Bold</span> interface.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-primary p-4 text-center text-md font-bold text-primary-foreground shadow-hard-sm">Primary</div>
                <div className="rounded-lg bg-accent p-4 text-center text-md font-bold text-accent-foreground shadow-hard-sm">Accent</div>
                <div className="rounded-lg bg-background p-4 text-center text-md font-bold text-foreground border-2 border-border shadow-hard-sm">Canvas</div>
                <div className="rounded-lg bg-destructive p-4 text-center text-md font-bold text-destructive-foreground shadow-hard-sm">Danger</div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* UI Polish Checklist */}
        <SectionCard title="UI Polish Checklist" description="Visual rhythm and consistency checks.">
          <ul className="space-y-3">
            <li className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <span className="text-sm font-medium">Typography Hierarchy</span>
              <QualityBadge label="Consistent" status="pass" />
            </li>
            <li className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <span className="text-sm font-medium">Vertical Rhythm (space-y-8)</span>
              <QualityBadge label="Standardized" status="pass" />
            </li>
            <li className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <span className="text-sm font-medium">Button States</span>
              <QualityBadge label="Interactive" status="pass" />
            </li>
            <li className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <span className="text-sm font-medium">Empty States</span>
              <QualityBadge label="implemented" status="pass" />
            </li>
             <li className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <span className="text-sm font-medium">Page Transitions</span>
              <QualityBadge label="Smooth" status="pass" />
            </li>
          </ul>
        </SectionCard>

        {/* Accessibility Checklist */}
        <SectionCard title="Accessibility (A11y)" description="WCAG AA compliance verification.">
          <ul className="space-y-3">
            <li className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <span className="text-sm font-medium">Color Contrast (&gt; 4.5:1)</span>
              <QualityBadge label="Verified" status="pass" />
            </li>
            <li className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <span className="text-sm font-medium">Focus Indicators</span>
              <QualityBadge label="Visible" status="pass" />
            </li>
            <li className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <span className="text-sm font-medium">Form Labels</span>
              <QualityBadge label="Linked" status="pass" />
            </li>
            <li className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <span className="text-sm font-medium">Semantic Headings</span>
              <QualityBadge label="Ordered" status="pass" />
            </li>
            <li className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <span className="text-sm font-medium">Skip Navigation</span>
              <QualityBadge label="Added" status="pass" />
            </li>
          </ul>
        </SectionCard>
      </div>
    </div>
  )
}
