import { DeckEditor } from "@/domains/deck/components/DeckEditor";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

const DeckOnePage = () => {
	const { id } = Route.useParams();
	return (
		<Suspense>
			<DeckEditor id={id} />
		</Suspense>
	);
};

export const Route = createFileRoute("/decks/$id/")({
	component: DeckOnePage,
});
