import clsx from "clsx";
// MonsterCard.tsx
import type { FC } from "react";
import type { EnergyType, MasterCardType } from "../../types";
import { GoodsCard } from "./GoodsCard";
import { MonsterCard } from "./MonsterCard";
import { SupporterCard } from "./SupporterCard";

type CardProps =
  | {
      card: MasterCardType;
      energy?: EnergyType[];
      className?: string;
      isBack?: false;
      isEmpty?: false;
    }
  | {
      isBack: true;
      isEmpty?: false;
      className?: string;
    }
  | {
      isEmpty: true;
      isBack?: false;
      className?: string;
    };

export const Card: FC<CardProps> = (props) => {
  if (props.isBack) {
    return (
      <div
        className={clsx(
          "aspect-card select-none w-32 rounded-md bg-blue-400 flex items-center justify-center border-2 border-slate-200",
          props.className
        )}
      >
        <strong>BACK</strong>
      </div>
    );
  }
  if (props.isEmpty) {
    return (
      <div
        className={clsx(
          "aspect-card select-none w-32 rounded-md bg-slate-400 flex items-center justify-center border-2 border-slate-200 border-dotted",
          props.className
        )}
      />
    );
  }
  switch (props.card.cardType) {
    case "monster":
      return (
        <MonsterCard
          card={props.card}
          className={props.className}
          energy={props.energy}
        />
      );
    case "supporter":
      return <SupporterCard card={props.card} />;
    case "goods":
      return <GoodsCard card={props.card} />;
    default:
      return null;
  }
};
