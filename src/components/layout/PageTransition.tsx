import { useLocation } from "react-router-dom"
import { type ReactNode } from "react"

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <div
      key={location.pathname}
      className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out"
    >
      {children}
    </div>
  )
}
