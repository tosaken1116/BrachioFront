import { useSocketRefStore } from "@/lib/websocket/hooks";
import { useState } from "react";
import { useAuth } from "react-oidc-context";

type FinishState = {
  winner: "me" | "opponent" | null;
  cause: "knockout" | "surrender" | null;
};

type CoinToss = {
  player: "me" | "opponent" | null;
  result: boolean[];
};
export const useBattle = () => {
  const [isFinished, setIsFinished] = useState<FinishState>({
    winner: null,
    cause: null,
  });

  const [coin, setCoin] = useState<CoinToss>({
    player: null,
    result: [],
  });
  const { user } = useAuth();
  const {
    draw,
    // confirmEnergy,
    // confirmTarget,
    // attackMonster,
    // setSocketRef,
    // ability,
    // retreat,
    // coinToss,
    // surrender,
    // takeGoods,
    // takeSupport,

    // summonMonster,
    // supplyEnergy,
    // evolutionMonster,
  } = useSocketRefStore({
    userId: user?.profile.sub ?? "",
    onBattleLose: (data) => {
      setIsFinished({
        winner: "opponent",
        cause: data,
      });
    },
    onBattleWin: (data) => {
      setIsFinished({
        winner: "me",
        cause: data,
      });
    },
    onCoinTossResult: (res) => {
      setCoin({
        player: "opponent",
        result: res,
      });
      setTimeout(() => {
        setCoin({
          player: null,
          result: [],
        });
      }, res.length * 300);
    },
    onOtherCoinToss: (coinToss) => {
      setCoin({
        player: "me",
        result: coinToss,
      });
    },
    onEffects: (effects) => {
      console.log("effects", effects);
    },
  });
  return {
    isFinished,
    coin,
    draw,
  };
};
