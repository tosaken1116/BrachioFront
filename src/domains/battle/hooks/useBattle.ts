import { getAccessToken } from "@/lib/auth";
import { useSocketRefStore } from "@/lib/websocket/hooks";
import ReconnectingWebSocket from "reconnecting-websocket";

export const useBattle = () => {
  const {
    socketRef,
    eventState,

    setSocketRef,
    enterRoom,
    draw,
    // confirmEnergy,
    // confirmTarget,
    // attackMonster,
    // ability,
    // retreat,
    // coinToss,
    // surrender,
    // takeGoods,
    // takeSupport,

    // summonMonster,
    // supplyEnergy,
    // evolutionMonster,
  } = useSocketRefStore();
  const handleConnect = () => {
    const token = getAccessToken();
    if (!token) {
      return;
    }
    const socket = new ReconnectingWebSocket(
      `wss://brachio.kurichi.dev/ws?token=${token}`
    );
    socket.binaryType = "arraybuffer";
    console.log(socket);
    setSocketRef({ current: socket });
  };
  return {
    isConnected: socketRef?.current,
    draw,
    handleConnect,
    enterRoom,
    state: eventState,
  };
};
