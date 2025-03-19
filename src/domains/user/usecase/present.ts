import { useQuery } from "@/lib/api/client";
import { client } from "@/lib/api/client";

export const useGetPresent = () => {
  const { data } = useQuery("/presents");
  return {
    data,
  };
};

export const usePresentUsecase = () => {
  //   const mutate = useMutation();
  const takePresent = (id: string) => {
    client.POST("/presents/{presentId}", {
      params: {
        path: {
          presentId: id,
        },
      },
    });
    // mutate(["/cards"]);
  };
  return {
    takePresent,
  };
};
