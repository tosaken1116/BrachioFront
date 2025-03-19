import { useQuery } from "../../../lib/api/client";

export const useGetGachaList = () => {
  return useQuery("/gachas", {}, { suspense: true });
};

export const useGetGachaPower = () => {
  const { data } = useQuery("/gachas/power");
  return { data };
};

export const useGetItem = () => {
  return useQuery("/items");
};
