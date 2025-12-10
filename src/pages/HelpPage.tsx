export function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">
          Help & Documentation
        </h1>
        <p className="text-slate-400">
          Find resources, guides, and support for your JLS Stack journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Week 1 Docs */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-50">Week 1 Docs</h3>
          <ul className="mt-2 text-sm text-slate-400 list-disc list-inside space-y-1">
            <li>Environment setup</li>
            <li>Stack basics</li>
            <li>Getting started</li>
          </ul>
        </div>

        {/* Card 2: Week 2 UI/UX Docs */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-50">Week 2 UI/UX Docs</h3>
          <ul className="mt-2 text-sm text-slate-400 list-disc list-inside space-y-1">
            <li>UI/UX principles</li>
            <li>Layout techniques</li>
            <li>Component styling</li>
          </ul>
        </div>

        {/* Card 3: Mentor Help */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-50">Ask for Help</h3>
          <ul className="mt-2 text-sm text-slate-400 list-disc list-inside space-y-1">
            <li>Stuck on a problem?</li>
            <li>Need a code review?</li>
            <li>Ping a mentor!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}