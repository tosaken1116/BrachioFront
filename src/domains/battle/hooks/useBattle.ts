import { getAccessToken } from "@/lib/auth";
import { useSocketRefStore } from "@/lib/websocket/hooks";

export const useBattle = () => {
  const {
    socketRef,
    eventState,

    setSocketRef,
    enterRoom,
    draw,
    confirmEnergy,
    confirmTarget,

    attackMonster,
    ability,
    retreat,
    coinToss,
    surrender,
    takeGoods,
    takeSupport,
    selectBattleCard,
    summonMonster,
    supplyEnergy,
    evolutionMonster,
    initialPlacementComplete,
    initialSummon,
  } = useSocketRefStore();
  const handleConnect = () => {
    const token = getAccessToken();
    if (!token) {
      return;
    }
    const socket = new WebSocket(`wss://brachio.kurichi.dev/ws?token=${token}`);
    socket.binaryType = "arraybuffer";
    console.log(socket);
    setSocketRef({ current: socket });
  };
  return {
    isConnected: socketRef?.current,
    isMatched: eventState.otherId !== null,
    draw,
    setSocketRef,
    handleConnect,
    enterRoom,
    state: eventState,
    supplyEnergy,
    confirmEnergy,
    retreat,
    evolutionMonster,
    summonMonster,
    takeGoods,
    takeSupport,
    surrender,
    coinToss,
    ability,
    attackMonster,
    confirmTarget,
    selectBattleCard,
    initialPlacementComplete,
    initialSummon,
  };
};
