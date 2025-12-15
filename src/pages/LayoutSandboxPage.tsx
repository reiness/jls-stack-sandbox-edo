import { LayoutSandbox } from "@/components/layout/LayoutSandbox"
import { PageHeader } from "../components/common/PageHeader"

export function LayoutSandboxPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Layout Sandbox" 
        subtitle="A playground for practicing Tailwind layout patterns."
      />

      {/* Reuse the sandbox component from Lesson 2.1a */}
      <div className="bg-card border-2 border-border shadow-hard rounded-3xl p-6 overflow-hidden">
        <LayoutSandbox />
      </div>
    </div>
  )
}