import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { QualityBadge } from "../components/common/QualityBadge"
import { InlineAlert } from "../components/common/InlineAlert"
import { PageHeader } from "../components/common/PageHeader"
import { StatsRow } from "../components/dashboard/StatsRow"
import { SectionCard } from "../components/common/SectionCard"
import { EmptyState } from "../components/common/EmptyState"
import { Button } from "../components/ui/button"
import { BadgePill } from "../components/common/BadgePill"
import { subscribeToActiveIdeas, type ProductIdea } from "@/lib/firestore/productIdeas"
import { useRealTime } from "@/lib/context/RealTimeContext"

export function DashboardPage() {
  const [ideas, setIdeas] = useState<ProductIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setStatus } = useRealTime()

  useEffect(() => {
    console.log("🔌 Dashboard: Subscribing to ideas")
    const unsubscribe = subscribeToActiveIdeas(
      (nextIdeas) => {
        setStatus("active")
        setIdeas(nextIdeas.slice(0, 5))
        setLoading(false)
      },
      (err) => {
        setStatus("error")
        setError("Failed to load ideas in real time.")
        setLoading(false)
        console.error(err)
      }
    )

    return () => {
      console.log("🔌 Dashboard: Unsubscribing from ideas")
      setStatus("off")
      unsubscribe()
    }
  }, [setStatus])

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard" 
        subtitle="Your JLS Stack Sandbox command center." 
      />
      
      <InlineAlert 
        title="Welcome Back!" 
        message="You have 3 new notifications." 
        tone="info" 
      />

      <StatsRow 
        stats={[
          { label: "Routes", value: "3+" },
          { label: "Shell", value: <QualityBadge label="Online" status="pass" /> },
          { label: "UI System", value: <QualityBadge label="Polished" status="pass" /> },
        ]} 
      />

      <SectionCard title="Quick Actions" description="Jumpstart your workflow.">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Button variant="outline" className="h-24 flex-col gap-2 border-2 border-dashed border-border/60 hover:border-primary hover:bg-primary/5" asChild>
            <a href="/create-tool">
              <span className="text-2xl">🛠️</span>
              <span className="font-bold">New Tool</span>
            </a>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 border-2 border-dashed border-border/60 hover:border-accent hover:bg-accent/5" asChild>
            <a href="/quality">
              <span className="text-2xl">💎</span>
              <span className="font-bold">Quality Check</span>
            </a>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 border-2 border-dashed border-border/60 hover:border-destructive hover:bg-destructive/5" asChild>
            <a href="/settings">
              <span className="text-2xl">⚙️</span>
              <span className="font-bold">Settings</span>
            </a>
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2 border-2 border-dashed border-border/60 hover:border-secondary hover:bg-secondary/5" asChild>
            <a href="/help">
              <span className="text-2xl">📚</span>
              <span className="font-bold">Docs</span>
            </a>
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Product Ideas"
        description="Latest active ideas from the team."
        actions={
          <Button asChild size="sm" variant="default">
            <Link to="/ideas/new">New Idea</Link>
          </Button>
        }
      >
        {loading ? (
          <div className="p-8 text-center animate-pulse text-muted-foreground font-bold">
            Loading ideas...
          </div>
        ) : error ? (
          <div className="p-4">
            <InlineAlert tone="danger" title="Error" message={error} />
          </div>
        ) : ideas.length > 0 ? (
          <div className="divide-y divide-border border-2 border-border rounded-xl overflow-hidden bg-background shadow-hard-sm">
            {ideas.map((idea) => (
              <Link
                key={idea.id}
                to={`/ideas/${idea.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted transition-colors group"
              >
                <div className="space-y-1">
                  <h4 className="font-black group-hover:text-primary transition-colors">{idea.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map(tag => (
                      <BadgePill key={tag} label={tag} variant="secondary" />
                    ))}
                  </div>
                </div>
                <BadgePill
                  label={idea.status.toUpperCase()}
                  variant={idea.status === "shipped" ? "success" : "outline"}
                />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Ideas Found"
            description="Start by creating your first product idea."
            action={
              <Button asChild size="sm">
                <Link to="/ideas/new">Create Idea</Link>
              </Button>
            }
          />
        )}
      </SectionCard>

      <SectionCard title="Tools Overview" description="Manage your custom utilities.">
        <EmptyState
          title="No Tools Found"
          description="You haven't created any custom tools yet. Start building your workspace toolkit."
          action={
            <Button asChild size="sm">
              <a href="/create-tool">Create Tool</a>
            </Button>
          }
        />
      </SectionCard>
    </div>
  )
}
