import clsx from "clsx";
import type { FC } from "react";
import { Draggable, Droppable } from "../../../../components/functional/dnd";
import type { EnergyType, MonsterCardType, MonsterType } from "../../types";
import { ExpandableCard } from "../Card";
import { Energy } from "../Energy";
import { HandCardsMe, HandCardsOpponent } from "../HandCards";

type Props = {
  battle: MonsterType | null;
  bench: (MonsterType | null)[];
  fieldEnergies: (EnergyType | null)[];

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
  const { battle, bench, energies, isMe, fieldEnergies } = props;
  const fieldCards = [...bench, battle];

  return (
    <div className="flex flex-col items-center gap-4 justify-start relative w-fit mx-auto">
      <Droppable id={"battle"} className="w-32">
        {battle !== null ? (
          <ExpandableCard
            isMe={isMe}
            card={battle}
            enabledUsable
            energy={energies[battle.id]}
            className={clsx(
              isMe &&
                props.grabbedCard !== null &&
                battle.evolvesTo?.includes(props.grabbedCard)
                ? putableClassName
                : ""
            )}
            onClickSkill={(skill) => {
              console.log("skill", skill);
            }}
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
              key={`bench${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                i
              }`}
              disabled={
                isMe &&
                card !== null &&
                props.grabbedCard !== null &&
                card.evolvesTo?.includes(props.grabbedCard) &&
                !props.isGrabEnergy
              }
            >
              {card == null ? (
                <div className="border w-32 aspect-card  border-gray-500" />
              ) : (
                <ExpandableCard
                  isMe={isMe}
                  card={card}
                  enabledUsable
                  className={clsx(
                    isMe &&
                      props.grabbedCard !== null &&
                      card.evolvesTo?.includes(props.grabbedCard)
                      ? putableClassName
                      : ""
                  )}
                  energy={energies[card.id]}
                />
              )}
            </Droppable>
          );
        })}
      </div>
      <div className="rounded-full border-2 w-20 h-20 border-slate-500 p-4 flex items-center justify-center absolute top-1/3 right-0 translate-x-[120%]">
        <div className="relative">
          {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
          <Draggable id={fieldEnergies[0]!} label="energy">
            {fieldEnergies[0] !== null && (
              <Energy size="large" energy={fieldEnergies[0]} />
            )}
          </Draggable>
          <div className="absolute -bottom-8 w-12 h-12 -right-8 p-2 border border-slate-500 rounded-full bg-slate-200">
            {fieldEnergies[1] !== null && (
              <Energy size="medium" energy={fieldEnergies[1]} />
            )}
          </div>
        </div>
      </div>
      <div className={clsx("h-1/4 duration-300 w-[240px] -translate-y-16")}>
        {isMe && (
          <HandCardsMe
            grabbingCardId={props.grabbedCard}
            cards={props.cards}
            renderCard={(card) => (
              <Draggable
                key={card.id}
                id={`${card.id}`}
                label={"card"}
                disabled={
                  card.cardType === "monster" &&
                  card.subType !== "basic" &&
                  !fieldCards.some(
                    (fieldCard) => fieldCard?.id === card.evolvesFrom
                  )
                }
              >
                <ExpandableCard
                  isMe={isMe}
                  card={card}
                  className={
                    fieldCards.some((fieldCard) =>
                      fieldCard?.evolvesTo?.includes(card.id)
                    ) ||
                    (card.cardType === "monster" &&
                      card.subType === "basic" &&
                      bench.includes(null))
                      ? putableClassName
                      : "relative"
                  }
                  energy={energies[card.id]}
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
