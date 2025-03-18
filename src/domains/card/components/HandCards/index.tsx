import clsx from "clsx";
import type { FC, ReactNode } from "react";
import type { MonsterCardType } from "../../types";
import { Card } from "../Card";

type HandCardsMeProps = {
  cards: MonsterCardType[];
  renderCard: (card: MonsterCardType) => ReactNode;
  grabbingCardId: string | null;
};
export const HandCardsMe: FC<HandCardsMeProps> = ({
  cards,
  renderCard,
  grabbingCardId,
}) => {
  const middle = cards.length / 2;

  return (
    <div className="flex flex-row w-[480px] h-[240px] relative">
      {cards.map((card, i) => {
        return (
          <div
            key={`hands-card-me-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              i
            }`}
            style={{
              rotate:
                grabbingCardId === card.id ? "" : `${(i - middle) * 3}deg`,
              top: `${Math.abs(i - middle) * 8}px`,
              left: `${(i - middle) * 32 + 200}px`,
            }}
            className={clsx(
              "duration-300 absolute",
              grabbingCardId === card.id ? "hover:scale-130" : ""
            )}
          >
            {renderCard(card)}
          </div>
        );
      })}
    </div>
  );
};

type HandCardsOpponentProps = {
  cardLength: number;
};
export const HandCardsOpponent: FC<HandCardsOpponentProps> = ({
  cardLength,
}) => {
  const middle = cardLength / 2;

  return (
    <div className="flex flex-row w-4xl translate-x-64 scale-75">
      {Array.from({ length: cardLength }).map((_, i) => {
        return (
          <div
            key={`hands-card-opponent-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              i
            }`}
            style={{
              rotate: `${(i - middle) * 3}deg`,
              marginTop: `${Math.abs(i - middle) * 8}px`,
            }}
            className={"duration-300 ml-[-192px]"}
          >
            <Card isBack />
          </div>
        );
      })}
    </div>
  );
};
