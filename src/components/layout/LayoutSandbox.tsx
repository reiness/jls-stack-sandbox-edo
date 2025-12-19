import { Button } from "@/components/ui/button"

export function LayoutSandbox() {
  return (
    <div className="min-h-screen text-slate-900 py-10 font-['Fredoka']">
      <div className="max-w-5xl mx-auto space-y-12 px-4">
        {/* Section 0: Page Title */}
        {/* Section 0: Page Title */}
        <section className="space-y-2 border-b-2 border-black pb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Tailwind Layout Sandbox
          </h1>
          <p className="text-base text-slate-500 font-bold">
            A showcase of responsive patterns using utility-first CSS.
          </p>
        </section>

        {/* Section 1: Vertical Stack (“Feature List”) */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Modern CSS Principles</h2>
          <div className="space-y-6">
            {/* Item 1 */}
            <div className="p-6 bg-card border-2 border-border shadow-hard rounded-3xl">
              <h3 className="text-lg font-bold text-primary mb-2">Mobile-First Architecture</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Start by designing for smaller screens, then progressively enhance the layout for larger devices using min-width media queries.
              </p>
            </div>

            {/* Item 2 */}
            <div className="p-6 bg-card border-2 border-border shadow-hard rounded-3xl">
              <h3 className="text-lg font-bold text-primary mb-2">Utility-First Workflow</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Build complex components rapidly by composing primitive utility classes, ensuring consistency and reducing custom CSS files.
              </p>
            </div>

            {/* Item 3 */}
            <div className="p-6 bg-card border-2 border-border shadow-hard rounded-3xl">
              <h3 className="text-lg font-bold text-primary mb-2">Responsive Alignments</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Utilize Flexbox and Grid to manage spacing and alignment dynamically, ensuring content looks great on any screen size.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Sidebar Layout */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">App Shell Layout</h2>
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Sidebar Panel */}
            <aside className="md:w-1/3 lg:w-1/4 space-y-4">
              <div className="bg-card p-5 rounded-3xl border-2 border-border shadow-hard-sm">
                <div className="font-bold text-foreground mb-4 pb-3 border-b-2 border-border">
                  Settings Menu
                </div>
                <nav className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-xl bg-primary/10 border-2 border-border text-primary text-sm font-bold shadow-hard-sm">
                    General
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent border-2 border-transparent hover:border-border text-sm font-bold transition-all">
                    Notifications
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent border-2 border-transparent hover:border-border text-sm font-bold transition-all">
                    Security
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content Panel */}
            <main className="flex-1 bg-card p-6 rounded-3xl border-2 border-border shadow-hard-sm">
              <h3 className="text-xl font-bold text-foreground mb-2">General Settings</h3>
              <p className="text-muted-foreground text-sm font-medium mb-6">
                Manage your account preferences and workspace settings below.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Workspace Name</label>
                  <input
                    type="text"
                    defaultValue="My Awesome Project"
                    className="w-full bg-input border-2 border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary font-medium"
                  />
                </div>
                <div className="pt-4">
                    <Button>
                        Save Changes
                    </Button>
                </div>
              </div>
            </main>

          </div>
        </section>

        {/* Section 3: Responsive Grid ("Cards / Stats / Modules") */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Platform Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="bg-emerald-100 border-2 border-border p-5 rounded-3xl shadow-hard">
              <div className="text-emerald-800 text-sm font-bold mb-1">Total Revenue</div>
              <div className="text-3xl font-black text-foreground">$45,231.89</div>
              <div className="text-emerald-700 text-sm mt-2 flex items-center font-black">
                <span className="mr-1.5">↑</span> +20.1%
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-emerald-100 border-2 border-border p-5 rounded-3xl shadow-hard">
              <div className="text-emerald-800 text-sm font-bold mb-1">Active Users</div>
              <div className="text-3xl font-black text-foreground">+2,350</div>
              <div className="text-emerald-700 text-sm mt-2 flex items-center font-black">
                <span className="mr-1.5">↑</span> +180.1%
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-emerald-100 border-2 border-border p-5 rounded-3xl shadow-hard">
              <div className="text-emerald-800 text-sm font-bold mb-1">Sales</div>
              <div className="text-3xl font-black text-foreground">+12,234</div>
              <div className="text-emerald-700 text-sm mt-2 flex items-center font-black">
                <span className="mr-1.5">↑</span> +19%
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-rose-100 border-2 border-border p-5 rounded-3xl shadow-hard">
              <div className="text-rose-800 text-sm font-bold mb-1">Active Now</div>
              <div className="text-3xl font-black text-foreground">+573</div>
              <div className="text-rose-700 text-sm mt-2 flex items-center font-black">
                <span className="mr-1.5">↓</span> -35.1%
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}
