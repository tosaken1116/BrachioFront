import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useBattle } from "../hooks/useBattle";

export const PasswordInput = () => {
  const [password, setPassword] = useState("");
  const { enterRoom } = useBattle();
  return (
    <div>
      {/* TODO:デッキセレクト */}
      <Input value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button
        onClick={() =>
          enterRoom({
            password,
            deckId: "template-deck-1",
          })
        }
      >
        マッチング開始
      </Button>
    </div>
  );
};
