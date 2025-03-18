import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertDialog } from "@/components/ui/dialogs/alertDialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card, ExpandableCard } from "@/domains/card/components/Card";
import { Energy, energyMap } from "@/domains/card/components/Energy";
import {
  type EnergyType,
  type MasterCardType,
  energyTypeList,
} from "@/domains/card/types";
import clsx from "clsx";
import { Pen, Trash2, X } from "lucide-react";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import { DeckCardsEditorView } from "../DeckCardsEditorView";
import { DeckCase } from "../DeckCase";
import { useDeckEdit } from "./hook";
import { Container } from "@/components/ui/container";
import { WithBackCard } from "@/components/ui/withBackCard";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  id: string;
};

export const DeckEditor: FC<Props> = ({ id }) => {
  const {
    deck,
    cards,
    handleAppendCard,
    handleRemoveCard,
    handleClearDeck,
    handleComplete,
    handleChangeDeckName,
    handleChangeEnergies,
    handleDeleteDeck,
  } = useDeckEdit(id);

  // 内側の Dialog（編成する）の表示を state で管理
  const [isEditorOpen, setEditorOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <WithBackCard
      color={deck.color}
      className="max-w-xl mx-auto items-center relative px-12 flex flex-col gap-4 h-screen"
    >
      <div className="flex absolute bottom-1/10 gap-4 left-1/2 -translate-x-1/2 z-50 w-2/3">
        <AlertDialog
          onUnderStand={() => navigate({ to: "/decks" })}
          title="保存せずに戻る"
          message={`デッキを保存していません
          デッキ編集が無効になり
          編集前の状態に戻りますが
          よろしいですか？`}
          className="w-full bg-white text-gray-800 rounded-full text-xl py-2"
        >
          キャンセル
        </AlertDialog>
        <button
          type="button"
          onClick={handleComplete}
          className="rounded-full animate-bg-coloring w-full text-xl text-white border border-white before:absolute relative before:w-full before:h-full before:contents-[''] before:scale-105 before:blur-3xl  before:backdrop-blur-sm before:-z-10 before:left-0 before:top-0 before:rounded-full "
        >
          保存する
        </button>
      </div>
      <div className="flex flex-row gap-2 w-full">
        {/* デッキ名編集用の Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              className="rounded-full shadow-inner bg-white/40 shadow-white z-20 flex flex-row w-full justify-center"
            >
              <p className="w-full">{deck.name}</p>
              <Pen />
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <NameEditorViewer
                name={deck.name}
                onCompleteNameEdit={handleChangeDeckName}
              />
            </DialogContent>
          </DialogPortal>
        </Dialog>

        {/* アラートダイアログ */}
        <AlertDialog
          onUnderStand={handleDeleteDeck}
          title="デッキを削除"
          message="デッキを削除しますか？この操作は取り消せません"
          className="z-20"
        >
          <Trash2 className="text-white" />
        </AlertDialog>
      </div>

      <div>
        <Dialog>
          <DialogTrigger className="flex flex-col gap-4 items-center h-full">
            <DeckCase
              energy={deck?.color}
              thumbnailCard={deck?.thumbnailCard}
            />
            <div className="flex flex-row gap-2 h-1/2">
              <div className="border shadow-inner rounded-xl flex flex-col shadow-slate-700">
                <div className="shadow-inner shadow-slate-500 rounded-t-xl py-1 w-32">
                  <p className="text-xs">エネルギー</p>
                </div>
                <div className="flex px-2 py-1 flex-row gap-2 items-center h-full justify-center border-t border-white">
                  {deck?.energies.map((energy) => {
                    return <Energy key={energy} energy={energy} />;
                  })}
                </div>
              </div>
              <div className="border shadow-inner rounded-xl flex flex-col shadow-slate-700">
                <div className="shadow-inner shadow-slate-500 rounded-t-xl py-1 w-32">
                  <p className="text-xs">メインカード</p>
                </div>
                <div className="scale-[0.35] w-32 h-16 -translate-y-5">
                  <Card card={deck?.thumbnailCard} />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <FixtureEditorViewer
              deckCaseColor={deck.color}
              energies={deck.energies}
              thumbnailCards={deck.thumbnailCard}
              onChangeEnergies={handleChangeEnergies}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative h-full overflow-scroll">
        {/* ボタン部分だけはそのまま配置 */}
        <div className="absolute right-2 top-2 z-10 flex flex-row items-center bg-slate-100 py-2 px-4 rounded-md gap-2">
          <p>{deck.cards.length}/20</p>
          <Button onClick={() => setEditorOpen(true)}>編成する</Button>
        </div>
        <div className="overflow-scroll">
          <div className="grid grid-cols-3 gap-1">
            {deck?.cards.map((card, i) => {
              return (
                <ExpandableCard
                  isMe
                  card={card}
                  key={`viewer-${card.masterCardId}-${i}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 内側の Dialog（編成する）をルートレベルでレンダリング */}
      <Dialog open={isEditorOpen} onOpenChange={setEditorOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="max-w-full sm:max-w-full">
            <DeckCardsEditorView
              cards={cards}
              deckCards={deck.cards}
              onAppendCard={handleAppendCard}
              onRemoveCard={handleRemoveCard}
              onClearCards={handleClearDeck}
              completeButtonRender={() => (
                <DialogClose asChild>
                  <Button className="absolute z-50 px-16 left-1/2 bottom-1/10 -translate-x-1/2 py-2 text-white rounded-full border border-white shadow-sm shadow-slate-500 animate-bg-coloring">
                    OK
                  </Button>
                </DialogClose>
              )}
            />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </WithBackCard>
  );
};

type FixtureEditorViewerProps = {
  deckCaseColor: EnergyType;
  energies: EnergyType[];
  thumbnailCards: MasterCardType;
  onChangeEnergies: (energies: EnergyType[]) => void;
};

const FixtureEditorViewer: FC<FixtureEditorViewerProps> = ({
  deckCaseColor,
  energies,
  thumbnailCards,
  onChangeEnergies,
}) => {
  const [currentEnergies, setCurrentEnergies] = useState(energies);
  return (
    <div className="mx-auto">
      <div className="max-w-xl min-w-md flex flex-col gap-4 items-center">
        <NamePlate className="w-full">
          <p>デッキケース</p>
        </NamePlate>
        <div>
          <DeckCase energy={deckCaseColor} thumbnailCard={thumbnailCards} />
        </div>
        <div className="flex flex-row gap-2 w-full">
          <div className="flex flex-col gap-2 w-full">
            <NamePlate className="w-full">
              <p>エネルギー</p>
            </NamePlate>
            <Drawer>
              <DrawerTrigger asChild className="cursor-pointer">
                <button className="w-full h-full" type="button">
                  <Container>
                    <div className="flex flex-row gap-2 mx-auto">
                      {energies.map((energy) => (
                        <Energy
                          key={energy}
                          energy={energy}
                          className="h-10 w-10"
                        />
                      ))}
                    </div>
                  </Container>
                </button>
              </DrawerTrigger>
              <DrawerContent className="z-[1000] flex flex-col gap-2 items-center">
                <DrawerHeader className="flex flex-col items-center gap-2">
                  <strong className="text-xl">エネルギー</strong>
                  <p className="">バトルで発生するエネルギーを設定できます</p>
                </DrawerHeader>
                <div className="grid grid-cols-2 gap-2 mx-auto w-full max-w-md py-4">
                  {Array.from(energyTypeList).map((energy) => {
                    const isSelected = currentEnergies.includes(energy);
                    const isMaxEnergies = currentEnergies.length > 2;
                    return (
                      <button
                        type="button"
                        key={energy}
                        onClick={() => {
                          setCurrentEnergies((prev) => {
                            if (prev.includes(energy)) {
                              return prev.filter((p) => p !== energy);
                            }
                            if (isMaxEnergies) {
                              return prev;
                            }
                            return [...prev, energy];
                          });
                        }}
                      >
                        <NamePlate
                          className={clsx(
                            "w-full flex justify-center py-3 relative",
                            isSelected
                              ? " bg-gradient-to-t from-slate-600 to-slate-400 "
                              : "",
                            isMaxEnergies ? "text-slate-500" : ""
                          )}
                        >
                          <div className=" absolute left-0 translate-x-1/4 top-1/2 -translate-y-1/2">
                            <Energy energy={energy} className="h-8 w-8" />
                          </div>
                          <strong className={isSelected ? "text-white" : ""}>
                            {energyMap[energy]}
                          </strong>
                        </NamePlate>
                      </button>
                    );
                  })}
                </div>
                <div>
                  <p className="before:contents-['・'] text-xs">
                    設定したタイプのエネルギーがバトル時に発生します
                  </p>
                  <p className="before:contents-['・'] text-xs">
                    複数タイプを設定した場合
                    自分の番ごとに発生するタイプが抽選されます
                  </p>
                </div>
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="rounded-full w-12 h-12"
                    onClick={() => onChangeEnergies(currentEnergies)}
                  >
                    <X />
                  </Button>
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <NamePlate className="w-full">
              <p>メインカード</p>
            </NamePlate>
            <Container>
              <Card card={thumbnailCards} className="scale-75" />
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

const NameEditorViewer: FC<{
  name: string;
  onCompleteNameEdit: (name: string) => Promise<void>;
}> = ({ name, onCompleteNameEdit }) => {
  const [currentName, setCurrentName] = useState(name);
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full">
      <strong>デッキ名</strong>
      <Input
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
        className="rounded-full"
      />
      <div className="flex flex-col gap-1 items-center text-sm w-full">
        <p>22文字まで入力できます</p>
        <p className="text-red-500">本名などの個人情報を使用しないでください</p>
      </div>
      <div className="w-full flex flex-row gap-4 justify-center">
        <DialogClose asChild>
          <Button className="rounded-full w-1/2" variant="outline">
            キャンセル
          </Button>
        </DialogClose>
        <DialogClose asChild onClick={() => onCompleteNameEdit(currentName)}>
          <Button className="rounded-full w-1/2" variant="secondary">
            OK
          </Button>
        </DialogClose>
      </div>
    </div>
  );
};

const NamePlate = ({
  children,
  className = "from-stone-50 to-stone-300",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "bg-gradient-to-r text-center rounded-full  shadow-inner shadow-slate-400",
        className
      )}
    >
      {children}
    </div>
  );
};
