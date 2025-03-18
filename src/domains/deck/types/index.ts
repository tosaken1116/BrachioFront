import type { EnergyType, MonsterCardType } from "../../card/types";

export type Deck = {
  id: string;
  name: string;
  energies: EnergyType[];
  cards: MonsterCardType[];
};
