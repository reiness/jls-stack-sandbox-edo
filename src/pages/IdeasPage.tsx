import { PageHeader } from "@/components/common/PageHeader"
import { IdeasList } from "@/components/playground/IdeasList"

export default function IdeasPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Product Ideas" 
        subtitle="Browse, filter, and manage product ideas submitted by the team."
      />
      
      <div className="container mx-auto">
        <IdeasList />
      </div>
    </div>
  )
}
