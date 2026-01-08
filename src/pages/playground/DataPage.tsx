import { useState } from "react"
import { Button } from "@/components/ui/button"
import { seedProductIdeas, clearProductIdeas, getProductIdeasByStatus } from "@/lib/firestore/productIdeas"
import { InlineAlert } from "@/components/common/InlineAlert"
import { IdeasList } from "@/components/playground/IdeasList"

export function DataPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSeed = async () => {
    setLoading(true)
    setSuccess(false)
    setError(null)
    try {
      await seedProductIdeas()
      setSuccess(true)
      setRefreshKey(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to seed database")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    if (!confirm("Are you sure you want to delete ALL product ideas and notes? This cannot be undone.")) {
      return
    }

    setLoading(true)
    setSuccess(false)
    setError(null)
    try {
      await clearProductIdeas()
      setSuccess(true)
      setRefreshKey(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear database")
    } finally {
      setLoading(false)
    }
  }

  const handleTestQuery = async () => {
    console.log("🔍 Fetching active product ideas...")
    try {
      const activeIdeas = await getProductIdeasByStatus("active")
      console.log("✅ Query successful. Results:", activeIdeas)
      alert(`Found ${activeIdeas.length} active ideas. Check the console for details!`)
    } catch (err) {
      console.error("❌ Query failed:", err)
      setError(err instanceof Error ? err.message : "Query failed")
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Data Management</h2>
        <p className="text-muted-foreground">
          Use these tools to manage your Firestore data for testing and development.
        </p>
      </div>

      <div className="p-4 border rounded-lg bg-card space-y-4 shadow-sm">
        <h3 className="font-medium">Database Actions</h3>
        <p className="text-sm text-muted-foreground">
          Seed the database with sample data or clear all existing records.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Button onClick={handleSeed} disabled={loading}>
            {loading ? "Processing..." : "Seed Product Ideas"}
          </Button>

          <Button variant="outline" onClick={handleTestQuery} disabled={loading}>
            Test Query: Active Ideas
          </Button>

          <Button variant="destructive" onClick={handleClear} disabled={loading}>
            {loading ? "Processing..." : "Clear Database"}
          </Button>
        </div>

        {success && (
          <InlineAlert 
            tone="success" 
            title="Success" 
            message="Action completed successfully!" 
          />
        )}

        {error && (
          <InlineAlert 
            tone="danger" 
            title="Error" 
            message={error} 
          />
        )}
      </div>

      <IdeasList key={refreshKey} />
    </div>
  )
}
