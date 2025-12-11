export function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">User Settings</h2>
          <p>Manage your account settings and preferences.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p>Customize the look and feel of the application.</p>
        </div>
      </div>
    </div>
  );
}