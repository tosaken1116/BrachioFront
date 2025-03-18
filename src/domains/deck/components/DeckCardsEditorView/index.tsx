import type { FC, JSX } from "react";
import { Card } from "../../../card/components/Card";
import type { MasterCardType } from "../../../card/types";

type Props = {
  onAppendCard: (card: MasterCardType) => void;
  onRemoveCard: (card: MasterCardType) => void;
  onClearCards: () => void;
  deckCards: MasterCardType[];
  cards: { masterCard: MasterCardType; count: number }[];
  completeButtonRender?: () => JSX.Element;
};

export const DeckCardsEditorView: FC<Props> = ({
  deckCards,
  cards,
  onRemoveCard,
  onAppendCard,
  onClearCards,
  completeButtonRender = () => (
    <button
      type="button"
      className="absolute z-50 px-16 left-1/2 bottom-1/10 -translate-x-1/2 py-2 text-white rounded-full border border-white shadow-sm shadow-slate-500 animate-bg-coloring"
    >
      OK
    </button>
  ),
}) => {
  const selectedCardId = deckCards.flatMap((card) => card.masterCardId);
  return (
    <div className="h-screen flex flex-col relative  w-screen overflow-x-hidden">
      {completeButtonRender()}
      <div className="z-50">
        <button
          type="reset"
          onClick={onClearCards}
          className="rounded-full shadow-sm px-6 py-1 shadow-black text-red-500"
        >
          すべて外す
        </button>
      </div>
      <div className="overflow-x-scroll p-8 w-full h-full overflow-y-hidden -translate-y-8">
        <div className="grid grid-cols-16 grid-rows-2  gap-2 w-max scale-75 origin-top-left -mr-[50%]">
          {Array.from({ length: 30 }).map((_, i) => {
            if (deckCards.length <= i) {
              return <Card isEmpty />;
            }
            const card = deckCards[i];
            return (
              <button
                key={`${card.masterCardId}-${i}`}
                onClick={() => onRemoveCard(card)}
                type="button"
                className=" animate-small-expand"
              >
                <Card
                  card={card}
                  className={
                    i > 20
                      ? "before:contents-[''] before:w-full before:h-full before:bg-slate-500/50 before:absolute before:top-0 before:left-0 before:z-50"
                      : ""
                  }
                />
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex w-full justify-center h-5/9">
        <div className="flex justify-center  overflow-scroll w-fit">
          <div className="grid grid-cols-3 gap-2 w-fit relative">
            {cards.map(({ masterCard: card, count }, i) => {
              const disabledPlusButton =
                deckCards.filter((c) => c.masterCardId === card.masterCardId)
                  .length >= count ||
                deckCards.length >= 30 ||
                selectedCardId.filter((id) => id === card.masterCardId)
                  .length >= 2;

              return (
                <div
                  key={`${card.masterCardId}-${i}`}
                  className="relative w-fit h-fit"
                >
                  <Card card={card} />
                  <button
                    type="button"
                    onClick={() => onAppendCard(card)}
                    disabled={disabledPlusButton}
                    className="z-20 w-full h-full absolute top-0 left-0"
                  />
                  {selectedCardId.includes(card.masterCardId) ? (
                    <>
                      <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-slate-500/60 flex justify-center items-center">
                        <strong className="text-xl text-white">
                          {
                            deckCards.filter(
                              (c) => c.masterCardId === card.masterCardId
                            ).length
                          }
                          /{count}
                        </strong>
                      </div>
                      <div className="absolute z-30 top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-600 text-white w-2/3 flex justify-between px-4 rounded-full items-center">
                        <button
                          type="button"
                          onClick={() => onRemoveCard(card)}
                        >
                          <strong className="text-xl">-</strong>
                        </button>
                        <button
                          type="button"
                          className={disabledPlusButton ? "opacity-50" : ""}
                          onClick={() => onAppendCard(card)}
                          disabled={disabledPlusButton}
                        >
                          <strong className="text-xl">+</strong>
                        </button>
                      </div>
                    </>
                  ) : (
                    <strong className="text-xs absolute left-0 bottom-0 w-1/2 bg-slate-500 text-white z-20 text-center">
                      {count}
                    </strong>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
