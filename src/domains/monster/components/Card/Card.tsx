import clsx from "clsx";
import type { FC, ReactNode } from "react";
import type { CardBaseType } from "../../types";

type CardProps = {
  card: CardBaseType;
  children: ReactNode;
  className?: string;
};
export const CardBase: FC<CardProps> = ({ card, className, children }) => {
  const { rarity } = card;
  return (
    <div
      className={clsx(
        "w-64 aspect-card rounded-md p-2 ",
        rarity === 3
          ? "bg-[url(/horogram.png)]"
          : rarity === 4
          ? "bg-[url(/horogram2.png)]"
          : "bg-slate-100",

        className
      )}
    >
      {children}
    </div>
  );
};
