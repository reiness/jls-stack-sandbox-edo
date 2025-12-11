import { NavLink, Outlet } from "react-router-dom";

export function PlaygroundPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Playground</h1>
      <div className="flex gap-4 border-b pb-4 mb-4">
        <NavLink
          to="/playground/forms"
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-lg transition-colors text-sm ${
              isActive ? "bg-slate-800 text-slate-50" : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-50"
            }`
          }
        >
          Forms
        </NavLink>
        <NavLink
          to="/playground/charts"
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-lg transition-colors text-sm ${
              isActive ? "bg-slate-800 text-slate-50" : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-50"
            }`
          }
        >
          Charts
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}