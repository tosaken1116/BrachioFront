import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import type { EnergyType, MasterCardType } from "../../../card/types";
import { useGetCardList } from "../../../card/usecase/cache";
import type { Deck } from "../../types";
import { useDeckUsecase } from "../../usecase";
import { useGetDeckOne } from "../../usecase/cache";

export const useDeckEdit = (id: string) => {
  const { data: deck } = useGetDeckOne(id);
  const { data: cards } = useGetCardList();
  const [deckCards, setDeckCards] = useState<Deck>(deck);
  const navigate = useNavigate({
    from: "/decks/$id",
  });

  const { updateDeck, deleteDeck } = useDeckUsecase();
  const handleAppendCard = useCallback((card: MasterCardType) => {
    setDeckCards((prev) => ({ ...prev, cards: [...prev.cards, card] }));
  }, []);

  const handleRemoveCard = useCallback((card: MasterCardType) => {
    // masterCardIdが一致するものを`1枚だけ`削除する
    setDeckCards((prev) => {
      const index = prev.cards.findIndex(
        (c) => c.masterCardId === card.masterCardId
      );
      if (index === -1) return prev;
      const copy = [...prev.cards];
      copy.splice(index, 1);
      return { ...prev, cards: copy };
    });
  }, []);

  const handleClearDeck = useCallback(() => {
    setDeckCards((prev) => ({
      ...prev,
      cards: [],
    }));
  }, []);

  const handleChangeDeckName = useCallback(async (name: string) => {
    setDeckCards((prev) => ({
      ...prev,
      name: name,
    }));
  }, []);
  const handleChangeEnergies = useCallback((energies: EnergyType[]) => {
    setDeckCards((prev) => ({
      ...prev,
      energies: energies,
    }));
  }, []);
  const handleComplete = useCallback(async () => {
    await updateDeck(deck);
    navigate({ to: "/decks" });
  }, [deck, updateDeck, navigate]);

  const handleDeleteDeck = useCallback(async () => {
    await deleteDeck(deck.id);
    navigate({ to: "/decks" });
  }, [deleteDeck, deck.id, navigate]);

  return {
    deck: deckCards,
    cards: cards,

    handleAppendCard,
    handleRemoveCard,
    handleClearDeck,
    handleComplete,
    handleChangeDeckName,
    handleChangeEnergies,
    handleDeleteDeck,
  };
};
