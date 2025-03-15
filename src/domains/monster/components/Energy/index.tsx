import clsx from "clsx";
import type { FC } from "react";
import type { MonsterTypes } from "../../types";

type Props = {
  type: MonsterTypes;
  className?: string;
  size?: "small" | "medium" | "large" | "huge";
};

const colorMap: Record<MonsterTypes, string> = {
  Normal: "bg-gray-100 border-gray-300",
  Fire: "bg-red-100 border-red-300",
  Water: "bg-blue-100 border-blue-300",
  Electric: "bg-yellow-100 border-yellow-300",
  Grass: "bg-green-100 border-green-300",
  Ice: "bg-blue-200 border-blue-400",
  Fighting: "bg-red-200 border-red-400",
  Poison: "bg-purple-100 border-purple-300",
  Ground: "bg-yellow-200 border-yellow-400",
  Flying: "bg-blue-300 border-blue-500",
  Psychic: "bg-purple-200 border-purple-400",
  Bug: "bg-green-200 border-green-400",
  Rock: "bg-gray-200 border-gray-400",
  Ghost: "bg-indigo-100 border-indigo-300",
  Dragon: "bg-red-300 border-red-500",
  Darkness: "bg-indigo-200 border-indigo-400",
  Metal: "bg-gray-300 border-gray-500",
  Fairy: "bg-pink-100 border-pink-300",
} as const;

const sizeMap: Record<"small" | "medium" | "large" | "huge", string> = {
  small: "w-3 h-3",
  medium: "w-4 h-4",
  large: "w-8 h-8",
  huge: "w-12 h-12",
} as const;
export const Energy: FC<Props> = ({ type, className, size = "medium" }) => {
  return (
    <div
      className={clsx(
        "rounded-full  border",
        sizeMap[size],
        colorMap[type],
        className
      )}
    />
  );
};
