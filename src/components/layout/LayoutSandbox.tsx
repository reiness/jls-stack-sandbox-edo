export function LayoutSandbox() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 py-10">
      <div className="max-w-5xl mx-auto space-y-12 px-4">
        {/* Section 0: Page Title */}
        <section className="space-y-2 border-b border-slate-700 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-50">
            Tailwind Layout Sandbox
          </h1>
          <p className="text-base text-slate-400">
            A showcase of responsive patterns using utility-first CSS.
          </p>
        </section>

        {/* Section 1: Vertical Stack (“Feature List”) */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Modern CSS Principles</h2>
          <div className="space-y-4">
            {/* Item 1 */}
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700/50 shadow-lg">
              <h3 className="text-lg font-semibold text-sky-400 mb-2">Mobile-First Architecture</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Start by designing for smaller screens, then progressively enhance the layout for larger devices using min-width media queries.
              </p>
            </div>

            {/* Item 2 */}
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700/50 shadow-lg">
              <h3 className="text-lg font-semibold text-sky-400 mb-2">Utility-First Workflow</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Build complex components rapidly by composing primitive utility classes, ensuring consistency and reducing custom CSS files.
              </p>
            </div>

            {/* Item 3 */}
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700/50 shadow-lg">
              <h3 className="text-lg font-semibold text-sky-400 mb-2">Responsive Alignments</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Utilize Flexbox and Grid to manage spacing and alignment dynamically, ensuring content looks great on any screen size.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Sidebar Layout */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">App Shell Layout</h2>
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Sidebar Panel */}
            <aside className="md:w-1/3 lg:w-1/4 space-y-4">
              <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 shadow-inner">
                <div className="font-semibold text-slate-100 mb-4 pb-3 border-b border-slate-600">
                  Settings Menu
                </div>
                <nav className="space-y-1">
                  <button className="w-full text-left px-3 py-2 rounded bg-sky-500/10 text-sky-400 text-sm font-medium">
                    General
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-sm transition-colors">
                    Notifications
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-sm transition-colors">
                    Security
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content Panel */}
            <main className="flex-1 bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-inner">
              <h3 className="text-xl font-semibold text-slate-50 mb-2">General Settings</h3>
              <p className="text-slate-400 text-sm mb-6">
                Manage your account preferences and workspace settings below.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Workspace Name</label>
                  <input
                    type="text"
                    defaultValue="My Awesome Project"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="pt-4">
                    <button className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                        Save Changes
                    </button>
                </div>
              </div>
            </main>

          </div>
        </section>

        {/* Section 3: Responsive Grid ("Cards / Stats / Modules") */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Platform Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="bg-emerald-950/50 border border-emerald-800/50 p-5 rounded-lg shadow-lg">
              <div className="text-emerald-300 text-sm font-medium mb-1">Total Revenue</div>
              <div className="text-3xl font-bold text-emerald-100">$45,231.89</div>
              <div className="text-emerald-300 text-sm mt-2 flex items-center font-semibold">
                <span className="mr-1.5">↑</span> +20.1%
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-emerald-950/50 border border-emerald-800/50 p-5 rounded-lg shadow-lg">
              <div className="text-emerald-300 text-sm font-medium mb-1">Active Users</div>
              <div className="text-3xl font-bold text-emerald-100">+2,350</div>
              <div className="text-emerald-300 text-sm mt-2 flex items-center font-semibold">
                <span className="mr-1.5">↑</span> +180.1%
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-emerald-950/50 border border-emerald-800/50 p-5 rounded-lg shadow-lg">
              <div className="text-emerald-300 text-sm font-medium mb-1">Sales</div>
              <div className="text-3xl font-bold text-emerald-100">+12,234</div>
              <div className="text-emerald-300 text-sm mt-2 flex items-center font-semibold">
                <span className="mr-1.5">↑</span> +19%
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-rose-950/50 border border-rose-800/50 p-5 rounded-lg shadow-lg">
              <div className="text-rose-300 text-sm font-medium mb-1">Active Now</div>
              <div className="text-3xl font-bold text-rose-100">+573</div>
              <div className="text-rose-300 text-sm mt-2 flex items-center font-semibold">
                <span className="mr-1.5">↓</span> -35.1%
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}
