import clsx from "clsx";
import type { FC } from "react";
import { Draggable, Droppable } from "../../../../components/functional/dnd";
import type { EnergyType, MonsterCardType, MonsterType } from "../../types";
import { Card } from "../Card";
import { HandCardsMe, HandCardsOpponent } from "../HandCards";

type Props = {
  battle: MonsterType | null;
  bench: (MonsterType | null)[];

  energies: Record<string, EnergyType[]>;
} & (
  | { cardLength: number; isMe: false }
  | {
      isMe: true;
      cards: MonsterCardType[];
      grabbedCard: string | null;
      isGrabEnergy: boolean;
    }
);
const putableClassName =
  "before:animate-ping-small before:scale-105 before:content-[''] before:w-full before:h-full before:border-2 before:outline-2 before:outline-amber-300 before:rounded-md before:border-amber-300 before:absolute relative before:left-0 before:top-0";

export const Field: FC<Props> = (props) => {
  const { battle, bench, energies, isMe } = props;
  const fieldCards = [...bench, battle];

  return (
    <div className="flex flex-col items-center gap-4 justify-start relative ">
      <Droppable id={"battle"} className="w-32">
        {battle !== null ? (
          <Card
            card={battle}
            energy={energies[battle.id]}
            className={clsx(
              isMe && props.grabbedCard === battle.evolvesTo
                ? putableClassName
                : "",
              isMe ? "" : "rotate-180"
            )}
          />
        ) : (
          <div className=" aspect-card border   border-gray-500" />
        )}
      </Droppable>
      <div className="flex flex-row gap-4 h-fit">
        {bench.map((card, i) => {
          return (
            <Droppable
              id={`bench${i}`}
              key={`bench${i}`}
              disabled={
                isMe &&
                card !== null &&
                card.evolvesTo !== props.grabbedCard &&
                !props.isGrabEnergy
              }
            >
              {card == null ? (
                <div className="border w-32 aspect-card  border-gray-500" />
              ) : (
                <Card
                  card={card}
                  className={clsx(
                    isMe && props.grabbedCard === card.evolvesTo
                      ? putableClassName
                      : "",
                    isMe ? "" : "rotate-180"
                  )}
                  energy={energies[card.id]}
                />
              )}
            </Droppable>
          );
        })}
      </div>
      <div className="rounded-full border-2 border-slate-500 p-4 flex items-center justify-center absolute bottom-48 right-48">
        <div className="relative">
          <Draggable id="Electric" label="energy">
            <Energy size="large" type="lightning" />
          </Draggable>
          <div className="absolute -bottom-8 -right-8 p-2 border border-slate-500 rounded-full bg-slate-200">
            <Energy size="medium" type="lightning" />
          </div>
        </div>
      </div>
      <div className={clsx("h-1/4 duration-300 w-[240px]")}>
        {isMe && (
          <HandCardsMe
            grabbingCardId={props.grabbedCard}
            cards={props.cards}
            renderCard={(card) => (
              <Draggable
                key={card.id}
                id={card.id}
                label={"card"}
                disabled={
                  card.cardType === "monster" &&
                  card.subType !== "Basic" &&
                  !fieldCards.some(
                    (fieldCard) => fieldCard?.id === card.evolvesFrom
                  )
                }
              >
                <Card
                  card={card}
                  className={
                    fieldCards.some(
                      (fieldCard) => fieldCard?.evolvesTo === card.id
                    ) ||
                    (card.cardType === "monster" &&
                      card.subType === "Basic" &&
                      bench.includes(null))
                      ? putableClassName
                      : "relative"
                  }
                />
              </Draggable>
            )}
          />
        )}
        {!isMe && <HandCardsOpponent cardLength={props.cardLength} />}
      </div>
    </div>
  );
};
