import { PresentList } from "@/domains/user/components/PresentList";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/presents/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <Suspense>
        <PresentList />
      </Suspense>
    </div>
  );
}
