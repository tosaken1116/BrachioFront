import { useCallback } from "react";
import { client, useMutation } from "../../../lib/api/client";
import type { Deck } from "../types";
export const useDeckUsecase = () => {
  const mutate = useMutation();
  const updateDeck = useCallback(
    async (props: Deck) => {
      try {
        const res = await client.PUT("/decks/{deckId}", {
          params: {
            path: {
              deckId: props.id,
            },
          },
          body: {
            masterCardIds: props.cards.map((card) => card.masterCardId),
            thumbnailCardId: props.thumbnailCard.masterCardId,
            energies: props.energies,
            name: props.name,
            color: props.color,
          },
        });
        if (res.response.ok) {
          mutate(["/decks"]);
        }
      } catch (e) {}
    },
    [mutate]
  );

  const deleteDeck = useCallback(
    async (id: string) => {
      try {
        const res = await client.DELETE("/decks/{deckId}", {
          params: {
            path: {
              deckId: id,
            },
          },
        });
        if (res.response.ok) {
          mutate(["/decks"]);
        }
      } catch (e) {}
    },
    [mutate]
  );

  const newDeck = useCallback(async () => {
    const res = await client.POST("/decks");
    if (res.response.ok) {
      mutate(["/decks"]);
    }
    return res.data?.id ?? "";
  }, [mutate]);
  return { updateDeck, deleteDeck, newDeck };
};
