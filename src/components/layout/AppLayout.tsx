import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUser } from "@/lib/context/UserContext"
import { useRealTime } from "@/lib/context/RealTimeContext"
import { SkipToMain } from "../common/SkipToMain"
import { PageTransition } from "./PageTransition"

const navGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", to: "/" },
      { label: "Ideas", to: "/ideas", badge: "New" },
      { label: "Activity", to: "/activity", badge: "3" },
    ],
  },
  {
    label: "Sandbox",
    items: [
      { label: "Layout Sandbox", to: "/layout-sandbox", badge: "Beta" },
      { label: "Playground", to: "/playground", badge: "New" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Create Tool", to: "/create-tool", badge: "New" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", to: "/settings" },
      { label: "Components", to: "/components", badge: "Dev" },
      { label: "Quality", to: "/quality" },
      { label: "Help", to: "/help" },
    ],
  },
]

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { setUserId, user } = useUser()
  const { status } = useRealTime()

  const getUserKey = () => {
    if (user?.email === "user123@example.com") return "user-123"
    if (user?.email === "someone@example.com") return "someone-else"
    return "anonymous"
  }

  const currentUserKey = getUserKey()

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground font-['Fredoka']">
      <SkipToMain />
      {/* Topbar - Fixed height, no scroll */}
      <header className="z-30 flex min-h-16 h-auto shrink-0 items-center justify-between border-b-2 border-border bg-card/80 backdrop-blur px-4 py-2 lg:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-border bg-primary text-lg font-black text-primary-foreground shadow-hard-sm">
            J
          </span>
          <div className="flex flex-col leading-none justify-center">
            <span className="text-sm sm:text-lg font-bold tracking-tight">JLS Stack Sandbox</span>
            <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">
              Week 2 – UI/UX & Layout
            </span>
          </div>
        </div>

        {/* Center/Right: Desktop nav shortcuts + user placeholder */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Enhancement 1: Fake Search Input */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-64 rounded-lg border-2 border-border bg-background px-9 py-1 text-sm font-bold shadow-hard-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              readOnly
            />
          </div>

          {/* Enhancement 2: Styled Environment Indicator */}
          <div className="inline-flex h-8 items-center rounded-full border-2 border-border bg-secondary px-3 text-xs font-bold text-secondary-foreground shadow-hard-sm">
            Environment: Dev
          </div>

          {/* Live Updating Indicator */}
          <div
            className={`inline-flex h-8 items-center rounded-full border-2 px-3 text-xs font-bold shadow-hard-sm transition-colors ${
              status === "active"
                ? "border-emerald-600 bg-emerald-100 text-emerald-800"
                : status === "error"
                ? "border-destructive bg-destructive text-destructive-foreground"
                : "border-border bg-muted text-muted-foreground"
            }`}
          >
            Live: {status === "active" ? "On" : status === "error" ? "Error" : "Off"}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 border-2 border-border text-xs font-bold shadow-hard-sm hover:translate-y-px hover:shadow-none active:translate-y-0.5"
          >
            Feedback
          </Button>

          <Select value={currentUserKey} onValueChange={setUserId}>
            <SelectTrigger className="relative z-50 cursor-pointer h-9 w-auto px-3 border-2 border-border shadow-hard-sm bg-background data-[state=open]:bg-accent font-bold">
              <SelectValue className="hidden" />
              <span>
                {currentUserKey === "user-123" ? "(U1)" :
                 currentUserKey === "someone-else" ? "(SE)" : "(Anon)"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user-123">User 123</SelectItem>
              <SelectItem value="someone-else">Someone Else</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border-2 border-border bg-card px-2 py-1 text-sm font-bold shadow-hard-sm active:translate-y-0.5 active:shadow-none md:hidden outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          Menu
        </button>
      </header>

      {/* Shell body: flexible container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – desktop (scrollable) */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r-2 border-border bg-sidebar py-6 md:block" aria-label="Sidebar">
          <nav className="flex flex-col gap-6 px-4" aria-label="Main Navigation">
            {navGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-2">
                <div className="px-2 text-sm uppercase tracking-wider text-foreground font-bold ">
                  {group.label}
                </div>
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      [
                        "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold transition-all border-2 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        isActive
                          ? "bg-primary text-primary-foreground border-border shadow-hard -translate-y-0.5"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border",
                      ].join(" ")
                    }
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center rounded-full bg-background border-2 border-border px-2 py-0.5 text-xs font-bold text-foreground group-hover:bg-background">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Sidebar – mobile (overlay) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            {/* Backdrop */}
            <div
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Panel */}
            <aside className="w-64 border-l-2 border-border bg-sidebar p-6 shadow-2xl overflow-y-auto" aria-label="Mobile Menu">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-black uppercase tracking-wider text-foreground">
                  Menu
                </span>
                <button
                  type="button"
                  className="rounded border-2 border-transparent px-2 py-1 text-xs font-bold text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground"
                  onClick={() => setSidebarOpen(false)}
                >
                  Close
                </button>
              </div>

              <nav className="flex flex-col gap-6" aria-label="Mobile Navigation">
                {navGroups.map((group) => (
                  <div key={group.label} className="flex flex-col gap-2">
                    <div className="px-2 text-sm uppercase tracking-wider text-foreground font-bold ">
                      {group.label}
                    </div>
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                          [
                            "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold transition-all border-2 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            isActive
                              ? "bg-primary text-primary-foreground border-border shadow-hard -translate-y-0.5"
                              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border",
                          ].join(" ")
                        }
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="inline-flex items-center justify-center rounded-full bg-background border-2 border-border px-2 py-0.5 text-xs font-bold text-foreground">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main content (scrollable) */}
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6 lg:p-10">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  )
}