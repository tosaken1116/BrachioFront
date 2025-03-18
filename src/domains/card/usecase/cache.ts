import { useQuery } from "../../../lib/api/client";

export const useGetCardList = () => {
  return useQuery("/cards", {}, { suspense: true });
};
