import { NavLink, Outlet } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";

export function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Playground" 
        subtitle="Experiment with components and layouts here."
      />
      <div className="flex gap-4 border-b-2 border-border pb-4">
        <NavLink
          to="/playground/forms"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all border-2 text-sm font-bold ${
              isActive 
                ? "bg-primary text-primary-foreground border-border shadow-hard translate-y-[-2px]" 
                : "border-transparent text-muted-foreground hover:text-accent-foreground hover:bg-accent"
            }`
          }
        >
          Forms
        </NavLink>
        <NavLink
          to="/playground/charts"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all border-2 text-sm font-bold ${
              isActive 
                ? "bg-primary text-primary-foreground border-border shadow-hard translate-y-[-2px]" 
                : "border-transparent text-muted-foreground hover:text-accent-foreground hover:bg-accent"
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