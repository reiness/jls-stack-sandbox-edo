import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { ActivityPage } from "./pages/ActivityPage"
import { ComponentsPage } from "./pages/ComponentsPage"
import { DashboardPage } from "./pages/DashboardPage"
import { LayoutSandboxPage } from "@/pages/LayoutSandboxPage"
import { HelpPage } from "@/pages/HelpPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { PlaygroundPage } from "@/pages/PlaygroundPage"
import { CreateToolPage } from "@/pages/CreateToolPage"
import { FormsPage } from "@/pages/playground/FormsPage"
import { ChartsPage } from "@/pages/playground/ChartsPage"
import { DataPage } from "@/pages/playground/DataPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { QualityPage } from "@/pages/QualityPage"
import IdeasPage from "./pages/IdeasPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Index ("/") → Dashboard */}
        <Route index element={<DashboardPage />} />
        
        {/* "ideas" list route */}
        <Route path="ideas" element={<IdeasPage />} />
        
        {/* "create-tool" new form route */}
        <Route path="create-tool" element={<CreateToolPage />} />

        {/* "/layout-sandbox" → layout sandbox page */}
        <Route path="layout-sandbox" element={<LayoutSandboxPage />} />

        <Route path="help" element={<HelpPage />} />

        <Route path="activity" element={<ActivityPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="quality" element={<QualityPage />} />
        <Route path="playground" element={<PlaygroundPage />}>
          <Route index element={<Navigate to="forms" replace />} />
          <Route path="forms" element={<FormsPage />} />
          <Route path="charts" element={<ChartsPage />} />
          <Route path="data" element={<DataPage />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
