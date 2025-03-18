import { DeckList } from "@/domains/deck/components/DeckList";
import { createFileRoute } from "@tanstack/react-router";

function DeckListPage() {
  return (
    <div className="flex flex-col w-fit mx-auto h-screen">
      <div className="mx-auto py-8">
        <strong className="text-3xl">マイデッキ</strong>
      </div>
      <div className="h-full overflow-scroll">
        <DeckList />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/decks/")({
  component: DeckListPage,
});
