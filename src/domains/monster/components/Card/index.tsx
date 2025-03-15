// MonsterCard.tsx
import type { FC } from "react";
import type { MonsterCardType, MonsterTypes } from "../../types";
import { GoodsCard } from "./GoodsCard";
import { MonsterCard } from "./MonsterCard";
import { SupporterCard } from "./SupporterCard";

type CardProps = {
  card: MonsterCardType;
  energy?: MonsterTypes[];
  className?: string;
};

export const Card: FC<CardProps> = ({ card, ...rest }) => {
  switch (card.supertype) {
    case "Monster":
      return <MonsterCard card={card} {...rest} />;
    case "Supporter":
      return <SupporterCard card={card} />;
    case "Goods":
      return <GoodsCard card={card} />;
    default:
      return null;
  }
};
