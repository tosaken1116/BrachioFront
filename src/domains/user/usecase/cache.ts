import { useQuery } from "@/lib/api/client";
import type { UserType } from "../types";

export const useGetUser = (id: string) => {
  const { data } = useQuery("/users/{userId}", {
    params: {
      path: {
        userId: id,
      },
    },
  });
  return {
    data,
  } as {
    data: UserType;
  };
};
