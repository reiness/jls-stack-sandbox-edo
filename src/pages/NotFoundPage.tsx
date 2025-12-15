import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "../components/common/EmptyState";
import { PageHeader } from "../components/common/PageHeader";

export function NotFoundPage() {
  return (
    <div className="space-y-8 p-8 max-w-2xl mx-auto">
      <PageHeader
        title="404 Not Found"
        subtitle="The page you are looking for does not exist."
      />
      <EmptyState
        title="Lost in the Sandbox?"
        description="We couldn't find that page. It might have been moved or deleted."
        action={
          <Button asChild>
            <Link to="/">Back to Dashboard</Link>
          </Button>
        }
      />
    </div>
  );
}