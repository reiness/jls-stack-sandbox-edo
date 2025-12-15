import { BadgePill } from "../components/common/BadgePill"
import { InfoRow } from "../components/common/InfoRow"
import { InlineAlert } from "../components/common/InlineAlert"
import { PageHeader } from "../components/common/PageHeader"
import { SectionCard } from "../components/common/SectionCard"
import { Button } from "../components/ui/button"

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your account preferences and application settings."
      />

      {/* Account Status */}
      <InlineAlert
        title="Email Verified"
        message="Your account is fully verified and ready to use."
        tone="success"
      />

      {/* User Settings */}
      <SectionCard title="User Profile" description="Manage your personal information.">
        <div className="px-4">
          <InfoRow label="Display Name" value="Edo" />
          <InfoRow label="Email" value="edo@jls.dev" />
          <InfoRow 
            label="Role" 
            value={<BadgePill label="Admin" tone="default" />} 
          />
        </div>
      </SectionCard>

      {/* App Settings */}
      <SectionCard title="Appearance" description="Customize how the app looks.">
        <div className="px-4">
          <InfoRow 
            label="Theme" 
            value="Light (Yellow/Purple)"
            action={<Button size="sm" variant="outline">Change</Button>}
          />
          <InfoRow 
            label="Compact Mode" 
            value="Off"
            action={<Button size="sm" variant="outline">Toggle</Button>}
          />
        </div>
      </SectionCard>
    </div>
  )
}