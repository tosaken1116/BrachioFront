// MonsterCard.tsx
import type { FC } from "react";
import type { MonsterCardType } from "../../types";
import { GoodsCard } from "./GoodsCard";
import { MonsterCard } from "./MonsterCard";
import { SupporterCard } from "./SupporterCard";

type CardProps = {
  card: MonsterCardType;
  className?: string;
};

export const Card: FC<CardProps> = ({ card, className }) => {
  switch (card.supertype) {
    case "Monster":
      return <MonsterCard card={card} className={className} />;
    case "Supporter":
      return <SupporterCard card={card} />;
    case "Goods":
      return <GoodsCard card={card} />;
    default:
      return null;
  }
};
