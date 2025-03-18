import { getAccessToken } from "@/lib/auth";
import { useSocketRefStore } from "@/lib/websocket/hooks";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import ReconnectingWebSocket from "reconnecting-websocket";

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
    eventState: {
      selectEnergies,
      selfBattle,
      selfBench,
      selfCard,
      selfEnergy,
      selfId,
      selfPokemonEnergy,
      currentTurnUser,
    },

    draw,
    confirmEnergy,
    confirmTarget,
    attackMonster,
    setSocketRef,
    ability,
    retreat,
    coinToss,
    surrender,
    takeGoods,
    takeSupport,

    summonMonster,
    supplyEnergy,
    evolutionMonster,
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
  const handleConnect = () => {
    const token = getAccessToken();
    if (!token) {
      return;
    }
    const socket = new ReconnectingWebSocket(
      `wss://brachio.kurichi.dev/ws?token=${token}`
    );
    socket.binaryType = "arraybuffer";
    setSocketRef({ current: socket });
  };
  return {
    isFinished,
    coin,
    draw,
    handleConnect,
  };
};
