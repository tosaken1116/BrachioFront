import { client, useMutation } from "@/lib/api/client";

export const useGachaUsecase = () => {
  const mutate = useMutation();
  const getNewPack = (isTen: boolean) => {
    client.POST("/gachas/{gachaId}", {
      params: {
        path: {
          gachaId: "1",
        },
      },
      body: {
        isTenDraw: isTen,
      },
    });
    mutate(["/cards"]);
  };
  return {
    getNewPack,
  };
};
