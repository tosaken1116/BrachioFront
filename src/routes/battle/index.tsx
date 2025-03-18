import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/battle/")({
  component: Battle,
});

import { Field } from "@/domains/card/components/Field";
import type { EnergyType, MonsterType } from "@/domains/card/types";
import type { BattleDeck } from "@/domains/deck/types";
import { useGetDeckOne } from "@/domains/deck/usecase/cache";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";

function Battle() {
  const { data } = useGetDeckOne("1");
  const [cards, setCards] = useState(data.cards as BattleDeck["cards"]);
  const [grabbedCard, setGrabbedCard] = useState<string | null>(null);
  const [isGrabEnergy, setIsGrabEnergy] = useState(false);
  const [battle, setBattle] = useState<MonsterType | null>(null);
  const [bench, setBench] = useState<
    [MonsterType | null, MonsterType | null, MonsterType | null]
  >([null, null, null]);
  const [energies, setEnergies] = useState<Record<string, EnergyType[]>>({});
  const handleDragEnd = (event: DragEndEvent) => {
    setGrabbedCard(null);
    setIsGrabEnergy(false);
    const { over, active } = event;
    if (over == null) {
      return;
    }
    if (active.data.current?.label === "energy") {
      if (over.id.toString().startsWith("bench")) {
        const benchNum = Number(over.id.toString().slice(-1));
        if (bench[benchNum] === null) {
          return;
        }
        const benchCardId = bench[benchNum]?.id;
        if (benchCardId == null) {
          return;
        }

        const energyType = active.id.toString();
        setEnergies((prev) => {
          const newEnergies = prev[benchCardId] ?? [];
          newEnergies.push(energyType as EnergyType);
          prev[benchCardId] = newEnergies;
          return prev;
        });
      }
      if (over.id.toString() === "battle" && battle !== null) {
        const energyType = active.id.toString();

        setEnergies((prev) => {
          prev[battle.id ?? ""] = prev[battle?.id ?? ""] ?? [];
          prev[battle.id ?? ""].push(energyType as EnergyType);
          return prev;
        });
      }
      return;
    }
    const targetId = active.id;
    if (over.id === "battle") {
      const targetCard = cards.find((card) => card.id === targetId);
      if (targetCard && targetCard.cardType === "monster") {
        setBattle(targetCard);
        setCards((prev) => {
          const newCards = prev.filter((card) => card.id !== targetId);
          return newCards;
        });
      }
      return;
    }
    if (over.id.toString().startsWith("bench")) {
      const targetCard = cards.find((card) => card.id === targetId);
      if (targetCard == null || targetCard.cardType !== "monster") {
        return;
      }
      const benchNum = Number(over.id.toString().slice(-1));
      if (
        (bench[benchNum] !== null &&
          !bench[benchNum].evolvesTo?.includes(targetCard.id)) ||
        (bench[benchNum] === null && targetCard.subType !== "basic")
      ) {
        return;
      }
      setBench((prev) => {
        prev[benchNum] = targetCard;
        return prev;
      });
      setCards((prev) => {
        const newCards = prev.filter((card) => card.id !== targetId);
        return newCards;
      });
    }
  };
  return (
    <div className=" h-screen overflow-hidden">
      <div className="">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col rotate-180 scale-75 h-[50vh]">
            <Field
              isMe={false}
              cardLength={4}
              battle={battle}
              bench={bench}
              energies={energies}
              fieldEnergies={["alchohol", "knowledge"]}
            />
          </div>
          <DndContext
            onDragStart={(e) => {
              if (e.active.data.current?.label === "energy") {
                setIsGrabEnergy(true);
                return;
              }
              setGrabbedCard(e.active.id.toString());
            }}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-col h-[50vh] -translate-y-10">
              <Field
                isMe
                battle={battle}
                bench={bench}
                cards={cards}
                grabbedCard={grabbedCard}
                isGrabEnergy={isGrabEnergy}
                energies={energies}
                fieldEnergies={["alchohol", "knowledge"]}
              />
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
