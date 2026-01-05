import { useState } from "react"
import { Button } from "@/components/ui/button"
import { seedProductIdeas } from "@/lib/firestore/productIdeas"
import { InlineAlert } from "@/components/common/InlineAlert"

export function DataPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = async () => {
    setLoading(true)
    setSuccess(false)
    setError(null)
    try {
      await seedProductIdeas()
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to seed database")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Data Management</h2>
        <p className="text-muted-foreground">
          Use these tools to manage your Firestore data for testing and development.
        </p>
      </div>

      <div className="p-4 border rounded-lg bg-card space-y-4">
        <h3 className="font-medium">Seed Database</h3>
        <p className="text-sm text-muted-foreground">
          This will add 5 sample product ideas to the <code>productIdeas</code> collection, plus sample notes for the first two ideas.
        </p>
        
        <Button onClick={handleSeed} disabled={loading}>
          {loading ? "Seeding..." : "Seed Product Ideas"}
        </Button>

        {success && (
          <InlineAlert 
            tone="success" 
            title="Success" 
            message="Database seeded successfully!" 
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
    </div>
  )
}
