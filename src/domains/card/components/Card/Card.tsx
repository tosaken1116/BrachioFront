import clsx from "clsx";
import type { FC, ReactNode } from "react";
import type { MasterCardType } from "../../types";

type CardProps = {
  card: MasterCardType;
  children: ReactNode;
  className?: string;
};

export const CardBase: FC<CardProps> = ({ card, className, children }) => {
  const { rarity } = card;
  return (
    <div
      className={clsx(
        "w-32 aspect-card rounded-sm select-none p-1 relative",
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
