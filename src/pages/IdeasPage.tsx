import { useState } from "react"
import { Button } from "@/components/ui/button"
import { seedProductIdeas } from "@/lib/firestore/productIdeas"
import { PageHeader } from "@/components/common/PageHeader"
import { IdeasList } from "@/components/playground/IdeasList"
import { useUser } from "@/lib/context/UserContext"

export default function IdeasPage() {
  const [seeding, setSeeding] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { userId } = useUser()

  const handleSeed = async () => {
    if (!userId) {
      alert("Please sign in to seed data.")
      return
    }

    setSeeding(true)
    try {
      await seedProductIdeas(userId)
      setRefreshKey(prev => prev + 1)
      alert("Database seeded successfully!")
    } catch (error) {
      console.error(error)
      alert("Failed to seed database.")
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Ideas"
        subtitle="Browse, filter, and manage product ideas submitted by the team."
        actions={
          <Button
            onClick={handleSeed}
            disabled={seeding || !userId}
            variant="default"
            size="sm"
            className="cursor-pointer border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all rounded-lg font-black tracking-wide"
          >
            {seeding ? "Seeding..." : "Seed Data"}
          </Button>
        }
      />
      
      <div className="container mx-auto">
        <IdeasList key={refreshKey} />
      </div>
    </div>
  )
}
