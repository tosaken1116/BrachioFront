import { ExpandableCard } from "@/domains/card/components/Card";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useGetCardList } from "../../domains/card/usecase/cache";

function Cards() {
  const { data: cards } = useGetCardList();
  return (
    <div className="flex items-center flex-col min-h-screen max-h-screen m">
      <div className="mx-auto py-8">
        <strong className="text-3xl">マイカード</strong>
      </div>
      <div className="h-full overflow-scroll">
        <div className="grid grid-cols-3 w-fit">
          {cards.map((card) => {
            return (
              <div key={card.masterCard.masterCardId}>
                <ExpandableCard isMe card={card.masterCard} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <Suspense>
      <Cards />
    </Suspense>
  );
};

export const Route = createFileRoute("/cards/")({
  component: App,
});
