export function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Help & Documentation
        </h1>
        <p className="text-muted-foreground font-bold opacity-80">
          Find resources, guides, and support for your JLS Stack journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Week 1 Docs */}
        <div className="bg-card border-2 border-border shadow-hard rounded-3xl p-6">
          <h3 className="font-semibold text-xl mb-4">Week 1 Docs</h3>
          <ul className="text-sm text-muted-foreground font-bold opacity-80 list-disc list-inside space-y-2">
            <li>Environment setup</li>
            <li>Stack basics</li>
            <li>Getting started</li>
          </ul>
        </div>

        {/* Card 2: Week 2 UI/UX Docs */}
        <div className="bg-card border-2 border-border shadow-hard rounded-3xl p-6">
          <h3 className="font-semibold text-xl mb-4">Week 2 UI/UX Docs</h3>
          <ul className="text-sm text-muted-foreground font-bold opacity-80 list-disc list-inside space-y-2">
            <li>UI/UX principles</li>
            <li>Layout techniques</li>
            <li>Component styling</li>
          </ul>
        </div>

        {/* Card 3: Mentor Help */}
        <div className="bg-card border-2 border-border shadow-hard rounded-3xl p-6">
          <h3 className="font-semibold text-xl mb-4">Ask for Help</h3>
          <ul className="text-sm text-muted-foreground font-bold opacity-80 list-disc list-inside space-y-2">
            <li>Stuck on a problem?</li>
            <li>Need a code review?</li>
            <li>Ping a mentor!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}