import { createContext, useContext, useState, type ReactNode } from "react"

export type RealTimeStatus = "off" | "active" | "error"

interface RealTimeContextType {
  status: RealTimeStatus
  setStatus: (status: RealTimeStatus) => void
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined)

export function RealTimeProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<RealTimeStatus>("off")

  return (
    <RealTimeContext.Provider value={{ status, setStatus }}>
      {children}
    </RealTimeContext.Provider>
  )
}

export function useRealTime() {
  const context = useContext(RealTimeContext)
  if (context === undefined) {
    throw new Error("useRealTime must be used within a RealTimeProvider")
  }
  return context
}
