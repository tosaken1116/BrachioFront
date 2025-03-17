import { useQuery } from "../../../lib/api/client";

export const useGetCardOne = (id: string) => {
  return useQuery("/cards/{cardNumber}", {
    params: {
      path: {
        cardNumber: id,
      },
    },
  });
};

export const useGetCardList = () => {
  return useQuery("/cards", {});
};
