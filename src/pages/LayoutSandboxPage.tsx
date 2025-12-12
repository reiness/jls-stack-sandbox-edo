import { LayoutSandbox } from "@/components/layout/LayoutSandbox"

export function LayoutSandboxPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Layout Sandbox
        </h1>
        <p className="text-sm text-slate-500 font-bold opacity-80">
          A playground for practicing Tailwind layout patterns.
        </p>
      </div>

      {/* Reuse the sandbox component from Lesson 2.1a */}
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-6 overflow-hidden">
        <LayoutSandbox />
      </div>
    </div>
  )
}