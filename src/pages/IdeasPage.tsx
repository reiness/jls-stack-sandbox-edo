import { useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { seedProductIdeas } from "@/lib/firestore/productIdeas"
import { PageHeader } from "@/components/common/PageHeader"
import { IdeasList } from "@/components/playground/IdeasList"
import { useUser } from "@/lib/context/UserContext"

export default function IdeasPage() {
  const [seeding, setSeeding] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { userId } = useUser()
  const location = useLocation()
  const isArchived = location.pathname.includes("/archived")

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
        title={isArchived ? "Archived Ideas" : "Product Ideas"}
        subtitle={
          isArchived
            ? "View and restore previously archived product ideas."
            : "Browse, filter, and manage product ideas submitted by the team."
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="cursor-pointer border-2 border-border shadow-hard-sm hover:translate-y-[1px] hover:shadow-none transition-all rounded-lg font-bold"
            >
              <Link to={isArchived ? "/ideas" : "/ideas/archived"}>
                {isArchived ? "Back to Active" : "View Archived"}
              </Link>
            </Button>

            {!isArchived && (
              <Button
                onClick={handleSeed}
                disabled={seeding || !userId}
                variant="default"
                size="sm"
                className="cursor-pointer border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all rounded-lg font-black tracking-wide"
              >
                {seeding ? "Seeding..." : "Seed Data"}
              </Button>
            )}
          </div>
        }
      />

      <div className="container mx-auto">
        <IdeasList key={`${refreshKey}-${isArchived}`} isArchived={isArchived} />
      </div>
    </div>
  )
}
