// types.ts

type CardBase = {
  id: string;
  name: string;

  rarity: number;
  cardNumber: string;
  expansion: string;
  imageUrl: string;
  rules: string[];
};

export type MonsterTypes =
  | "Normal"
  | "Fire"
  | "Water"
  | "Electric"
  | "Grass"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Darkness"
  | "Metal"
  | "Fairy";

export type AbilityType = {
  name: string;
  text: string;
};

export type Weakness = {
  type: MonsterTypes;
  value: string;
};

export type AttackType = {
  name: string;
  cost: MonsterTypes[];
  damage: string;
  text: string;
};

export type MonsterType = {
  supertype: "Monster";
  subtype: "Basic" | "Stage1" | "Stage2";
  type: MonsterTypes;
  hp: number;
  attacks: AttackType[];
  abilities: AbilityType[];
  weaknesses: Weakness;
  retreatCost: number;
} & CardBase;

export type SupporterType = {
  supertype: "Supporter";
  text: string;
} & CardBase;

export type GoodsType = {
  supertype: "Goods";
  text: string;
} & CardBase;

export type MonsterCardType = MonsterType | SupporterType | GoodsType;
