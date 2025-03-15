import clsx from "clsx";
// MonsterCard.tsx
import type { FC } from "react";
import type { MonsterCardType, MonsterTypes } from "../../types";
import { GoodsCard } from "./GoodsCard";
import { MonsterCard } from "./MonsterCard";
import { SupporterCard } from "./SupporterCard";

type CardProps =
  | {
      card: MonsterCardType;
      energy?: MonsterTypes[];
      className?: string;
      isBack?: false;
    }
  | {
      isBack: true;
      className?: string;
    };

export const Card: FC<CardProps> = (props) => {
  if (props.isBack) {
    return (
      <div
        className={clsx(
          "aspect-card w-64 rounded-md bg-blue-400 flex items-center justify-center border-2 border-slate-200",
          props.className
        )}
      >
        <strong>BACK</strong>
      </div>
    );
  }
  switch (props.card.supertype) {
    case "Monster":
      return (
        <MonsterCard
          card={props.card}
          className={props.className}
          energy={props.energy}
        />
      );
    case "Supporter":
      return <SupporterCard card={props.card} />;
    case "Goods":
      return <GoodsCard card={props.card} />;
    default:
      return null;
  }
};
