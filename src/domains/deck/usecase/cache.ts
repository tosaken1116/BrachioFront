import { useQuery } from "../../../lib/api/client";
import type { Deck } from "../types";

export const useGetDeckList = () => {
  const { data } = useQuery("/decks");
  return { data } as {
    data: Pick<Deck, "id" | "color" | "thumbnailCard" | "name">[];
  };
};

export const useGetDeckOne = (id: string) => {
  const { data } = useQuery(
    "/decks/{deckId}",
    {
      params: {
        path: {
          deckId: id,
        },
      },
    },
    {
      suspense: true,
    }
  );
  return { data } as { data: Deck };
};
