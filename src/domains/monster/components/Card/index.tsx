// MonsterCard.tsx
import type { FC } from "react";
import type { MonsterCardType } from "../../types";
import { GoodsCard } from "./GoodsCard";
import { MonsterCard } from "./MonsterCard";
import { SupporterCard } from "./SupporterCard";

type CardProps = {
  card: MonsterCardType;
};

export const Card: FC<CardProps> = ({ card }) => {
  switch (card.supertype) {
    case "Monster":
      return <MonsterCard card={card} />;
    case "Supporter":
      return <SupporterCard card={card} />;
    case "Goods":
      return <GoodsCard card={card} />;
    default:
      return null;
  }
};
