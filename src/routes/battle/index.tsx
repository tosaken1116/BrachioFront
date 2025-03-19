import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/battle/")({
  component: Battle,
});

import { TimedRender } from "@/components/functional/timedRenderer";
import { Challenger } from "@/domains/battle/components/Challenger";
import { PasswordInput } from "@/domains/battle/components/PasswordInput";
import { useBattle } from "@/domains/battle/hooks/useBattle";
import { Field } from "@/domains/card/components/Field";
import type { EnergyType } from "@/domains/card/types";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";

function Battle() {
  const {
    supplyEnergy,
    // confirmEnergy,
    // retreat,
    // draw,
    handleConnect,
    initialSummon,
    // initialPlacementComplete,
    isMatched,
    summonMonster,

    state: {
      otherCardLength,
      otherBattle,
      otherEnergy,
      otherBench,

      selfCard: cards,
      selfBattle: battle,
      selfBench: bench,
      selfId,
      otherId,

      selfPokemonEnergy: energies,
    },
  } = useBattle();

  const [grabbedCard, setGrabbedCard] = useState<string | null>(null);
  const [isGrabEnergy, setIsGrabEnergy] = useState(false);

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
        const supplys: {
          energies: EnergyType[];
        }[] = [
          { energies: [] },
          { energies: [] },
          { energies: [] },
          { energies: [] },
        ];
        supplys[benchNum].energies.push(energyType as EnergyType);
        supplyEnergy({
          // @ts-ignore
          supplys: supplys,
        });
      }
      if (over.id.toString() === "battle" && battle !== null) {
        const energyType = active.id.toString();

        const supplys: {
          energies: EnergyType[];
        }[] = [
          { energies: [] },
          { energies: [] },
          { energies: [] },
          { energies: [] },
        ];
        supplys[0].energies.push(energyType as EnergyType);
        supplyEnergy({
          // @ts-ignore
          supplys: supplys,
        });
      }
      return;
    }
    const targetId = active.id;
    if (over.id === "battle") {
      const targetCard = cards.find((card) => card.id === targetId);
      if (targetCard && targetCard.cardType === "monster") {
        summonMonster({
          card: targetCard,
          position: 0,
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

      summonMonster({
        card: targetCard,
        position: benchNum,
      });
    }
  };
  return (
    <div className=" h-screen overflow-hidden">
      {isMatched && (
        <TimedRender duration={700}>
          {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
          <Challenger id={otherId!} />
        </TimedRender>
      )}
      <div className="">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col rotate-180 scale-75 h-[50vh]">
            <Field
              isMe={false}
              cardLength={otherCardLength}
              battle={otherBattle}
              bench={otherBench}
              energies={energies}
              fieldEnergies={otherEnergy}
            />
          </div>
          <PasswordInput />
          <button onClick={handleConnect} type="button">
            connect
          </button>
          {selfId}
          <div>
            <button
              type="button"
              onClick={() =>
                initialSummon({
                  position: 0,
                  card: cards[0],
                })
              }
            >
              send
            </button>
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
