import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useDeckUsecase } from "../../usecase";

export const NewDeckButton = () => {
  const { newDeck } = useDeckUsecase();
  const navigate = useNavigate();
  const handleNewDeck = async () => {
    const id = await newDeck();
    navigate({ to: `/decks/${id}` });
  };
  return (
    <div className="w-full h-full flex flex-col items-center gap-1">
      <button
        onClick={handleNewDeck}
        type="button"
        className="w-full h-full border rounded-xl border-white shadow-inner shadow-slate-400 flex items-center justify-center text-slate-400"
      >
        <PlusIcon className="w-24 h-24" />
      </button>
      <div>
        <p className="text-slate-600">新規作成</p>
      </div>
    </div>
  );
};
