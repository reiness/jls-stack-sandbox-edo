import { NavLink, Outlet } from "react-router-dom"

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground font-medium font-['Fredoka']">
      {/* Top bar */}
      <header className="border-b-2 border-border bg-card">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-border bg-primary text-primary-foreground text-lg font-black shadow-hard-sm">
              J
            </span>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight leading-none">JLS Stack Sandbox</span>
              <span className="text-xs text-muted-foreground font-bold">Week 2 – UI/UX & Layout</span>
            </div>
          </div>

          <nav className="flex items-center gap-3 text-sm font-bold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                [
                  "px-4 py-2 rounded-lg transition-all border-2",
                  isActive
                    ? "bg-primary text-primary-foreground border-border shadow-hard translate-y-[-2px]"
                    : "border-transparent text-muted-foreground hover:text-accent-foreground hover:bg-accent",
                ].join(" ")
              }
              end
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/layout-sandbox"
              className={({ isActive }) =>
                [
                  "px-4 py-2 rounded-lg transition-all border-2",
                  isActive
                    ? "bg-primary text-primary-foreground border-border shadow-hard translate-y-[-2px]"
                    : "border-transparent text-muted-foreground hover:text-accent-foreground hover:bg-accent",
                ].join(" ")
              }
            >
              Layout Sandbox
            </NavLink>

            <NavLink
              to="/help"
              className={({ isActive }) =>
                [
                  "px-4 py-2 rounded-lg transition-all border-2",
                  isActive
                    ? "bg-primary text-primary-foreground border-border shadow-hard translate-y-[-2px]"
                    : "border-transparent text-muted-foreground hover:text-accent-foreground hover:bg-accent",
                ].join(" ")
              }
            >
              Help
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                [
                  "px-4 py-2 rounded-lg transition-all border-2",
                  isActive
                    ? "bg-primary text-primary-foreground border-border shadow-hard translate-y-[-2px]"
                    : "border-transparent text-muted-foreground hover:text-accent-foreground hover:bg-accent",
                ].join(" ")
              }
            >
              Settings
            </NavLink>

            <NavLink
              to="/playground"
              className={({ isActive }) =>
                [
                  "px-4 py-2 rounded-lg transition-all border-2",
                  isActive
                    ? "bg-primary text-primary-foreground border-border shadow-hard translate-y-[-2px]"
                    : "border-transparent text-muted-foreground hover:text-accent-foreground hover:bg-accent",
                ].join(" ")
              }
            >
              Playground
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-screen-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}