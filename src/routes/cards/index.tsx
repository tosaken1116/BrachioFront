import { Card } from "@/domains/card/components/Card";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useGetCardList } from "../../domains/card/usecase/cache";

function Cards() {
	const { data: cards } = useGetCardList();
	return (
		<div>
			{cards.map((card) => {
				return (
					<div key={card.masterCard.masterCardId}>
						<Card card={card.masterCard} />
					</div>
				);
			})}
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
