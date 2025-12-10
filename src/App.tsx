import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { DashboardPage } from "@/pages/DashboardPage"
import { LayoutSandboxPage } from "@/pages/LayoutSandboxPage"
import { HelpPage } from "@/pages/HelpPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Index ("/") → Dashboard */}
        <Route index element={<DashboardPage />} />

        {/* "/layout-sandbox" → layout sandbox page */}
        <Route path="layout-sandbox" element={<LayoutSandboxPage />} />

        <Route path="help" element={<HelpPage />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App