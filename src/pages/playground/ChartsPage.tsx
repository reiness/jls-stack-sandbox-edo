export function ChartsPage() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent w-fit">
          Visual Analytics
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Live system performance and key metrics.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: "$45,231.89", trend: "+20.1%", trendUp: true, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-900" },
          { label: "Subscriptions", value: "+2,350", trend: "+180.1%", trendUp: true, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-200 dark:border-blue-900" },
          { label: "Sales", value: "+12,234", trend: "+19%", trendUp: true, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-200 dark:border-violet-900" },
          { label: "Active Now", value: "+573", trend: "-24 since last hour", trendUp: false, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-200 dark:border-amber-900" },
        ].map((item, i) => (
          <div key={i} className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:bg-slate-950 ${item.border}`}>
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${item.bg} opacity-50 blur-2xl transition-all group-hover:opacity-100`} />
            <div className="relative">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</span>
              </div>
              <div className={`mt-2 flex items-center text-xs font-medium ${item.trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {item.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7 2xl:grid-cols-12">
        {/* Main Chart Section */}
        <div className="col-span-4 2xl:col-span-9 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
            <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
              <option>Lifetime</option>
            </select>
          </div>
          
          <div className="relative h-[250px] w-full pt-4">
             {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400">
                <div className="border-b border-slate-100 dark:border-slate-800/50 w-full h-0"></div>
                <div className="border-b border-slate-100 dark:border-slate-800/50 w-full h-0"></div>
                <div className="border-b border-slate-100 dark:border-slate-800/50 w-full h-0"></div>
                <div className="border-b border-slate-100 dark:border-slate-800/50 w-full h-0"></div>
            </div>

            <div className="relative flex h-full items-end justify-between gap-2 px-2">
              {[35, 65, 40, 80, 55, 90, 45, 70, 50, 60, 85, 40].map((height, i) => (
                <div key={i} className="group relative w-full h-full flex items-end">
                    <div
                        className="w-full rounded-t-sm transition-all duration-500 ease-out group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400 bg-indigo-200 dark:bg-indigo-900/50"
                        style={{ height: `${height}%` }}
                    ></div>
                     {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-10">
                        ${height}k
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity / Sales */}
        <div className="col-span-3 2xl:col-span-3 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col">
          <div className="border-b border-slate-100 p-6 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            <p className="text-sm text-slate-500">Latest financial activity.</p>
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-6">
              {[
                { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", initials: "OM", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
                { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", initials: "JL", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
                { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", initials: "IN", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
                { name: "William Kim", email: "will@email.com", amount: "+$99.00", initials: "WK", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
              ].map((user, i) => (
                <div key={i} className="flex items-center group cursor-default">
                  <div className={`h-10 w-10 flex items-center justify-center rounded-full font-bold transition-transform group-hover:scale-110 ${user.color}`}>
                    {user.initials}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{user.name}</p>
                    <p className="text-xs text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                      {user.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-slate-900 dark:text-white">{user.amount}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 p-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl">
              <button className="w-full text-center text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                  View All Transactions →
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
