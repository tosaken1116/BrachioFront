import { useQuery } from "../../../lib/api/client";

export const useGetDeckList = () => {
  return useQuery("/decks");
};

export const useGetDeckOne = (id: string) => {
  return useQuery(
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
};
