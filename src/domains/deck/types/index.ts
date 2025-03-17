import type { MonsterCardType, MonsterTypes } from "../../card/types";

export type Deck = {
  id: string;
  name: string;
  energies: MonsterTypes[];
  cards: MonsterCardType[];
};
