import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";

function DeckListPage() {
	return (
		<Dialog>
			<DialogTrigger>外側のダイアログを開く</DialogTrigger>
			<DialogContent>
				<p>これは外側のダイアログの内容です。</p>

				{/* 内側のダイアログ */}
				<Dialog>
					<DialogTrigger>内側のダイアログを開く</DialogTrigger>
					<DialogContent>
						<p>これは内側のダイアログの内容です。</p>
					</DialogContent>
				</Dialog>
			</DialogContent>
		</Dialog>
	);
}

export const Route = createFileRoute("/decks/")({
	component: DeckListPage,
});
