import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { DashboardPage } from "@/pages/DashboardPage"
import { LayoutSandboxPage } from "@/pages/LayoutSandboxPage"
import { HelpPage } from "@/pages/HelpPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { PlaygroundPage } from "@/pages/PlaygroundPage"
import { FormsPage } from "@/pages/playground/FormsPage"
import { ChartsPage } from "@/pages/playground/ChartsPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Index ("/") → Dashboard */}
        <Route index element={<DashboardPage />} />

        {/* "/layout-sandbox" → layout sandbox page */}
        <Route path="layout-sandbox" element={<LayoutSandboxPage />} />

        <Route path="help" element={<HelpPage />} />

        <Route path="settings" element={<SettingsPage />} />
        <Route path="playground" element={<PlaygroundPage />}>
          <Route index element={<Navigate to="forms" replace />} />
          <Route path="forms" element={<FormsPage />} />
          <Route path="charts" element={<ChartsPage />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App