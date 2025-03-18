import clsx from "clsx";
import type { FC, ReactNode } from "react";
import type { EnergyType, MasterCardType } from "../../types";
import { GoodsCard } from "./GoodsCard";
import { MonsterCard, type Skill } from "./MonsterCard";
import { SupporterCard } from "./SupporterCard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

type UsualCard = {
  card: MasterCardType;
  energy?: EnergyType[];
  className?: string;
  isBack?: false;
  isEmpty?: false;
  skillWrapper?: (props: { children: ReactNode; skill: Skill }) => ReactNode;
};
type CardProps =
  | UsualCard
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
          skillWrapper={props.skillWrapper}
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

type Props = UsualCard & {
  onClickSkill?: (skill: Skill) => void;
};

const isUsableSkill = (skill: Skill, energies: EnergyType[]) => {
  if (skill.type === "ability") {
    return true;
  }
  if (skill.skill.cost === null) {
    return true;
  }
  const currentEneries = energies.reduce(
    (acc, energy) => {
      acc[energy] = (acc[energy] || 0) + 1;
      return acc;
    },
    {} as Record<EnergyType, number>
  );
  const isUsable = skill.skill.cost.every((c) => {
    if (currentEneries[c] > 0) {
      currentEneries[c] -= 1;
      return true;
    }
    return false;
  });
  return isUsable;
};
export const ExpandableCard: FC<Props & { isMe: boolean }> = (props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Card
          {...props}
          className={clsx(props.className, props.isMe ? "" : "rotate-180")}
        />
      </DialogTrigger>
      <DialogContent className="h-4/5 mx-auto ">
        <div className={clsx("scale-[365%] origin-top-left w-fit h-fit")}>
          <Card
            {...props}
            skillWrapper={({ skill, children }) => {
              const isUsable = isUsableSkill(skill, props.energy ?? []);
              const Elm = isUsable ? DialogClose : "div";
              return (
                <Elm
                  className={clsx(
                    "relative w-full before:absolute before:top-0 before:opacity-20 before:left-0 before:w-full before:h-full  before:rounded-sm px-2 py-1",
                    isUsable
                      ? "before:bg-slate-50 before:animate-pulse"
                      : "before:bg-black",
                    props.isMe ? "" : " rotate-0",
                    props.className
                  )}
                  onClick={() => {
                    props.onClickSkill?.(skill);
                  }}
                >
                  {children}
                </Elm>
              );
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
