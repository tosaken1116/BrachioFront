import clsx from "clsx";
import {
  AsteriskIcon,
  BeerIcon,
  BicepsFlexedIcon,
  BookTextIcon,
  DollarSignIcon,
  SparklesIcon,
} from "lucide-react";
import type { FC, ReactNode } from "react";
import type { EnergyType } from "../../types";

type Props = {
  energy: EnergyType;
  className?: string;
  size?: "tiny" | "small" | "sm" | "medium" | "large" | "huge";
};

export const energyMap: Record<EnergyType, string> = {
  null: "NULL",
  muscle: "筋肉",
  money: "金",
  knowledge: "知識",
  alchohol: "酒",
  popularity: "人気",
};
const colorMap: Record<EnergyType, string> = {
  null: "bg-gray-100 border-gray-300",
  muscle: "bg-red-500 border-red-600",
  knowledge: "bg-blue-500 border-blue-600",
  money: "bg-yellow-500 border-yellow-600",
  popularity: "bg-green-500 border-green-600",
  alchohol: "bg-purple-500 border-purple-600",
} as const;

const sizeMap: Record<
  "tiny" | "small" | "sm" | "medium" | "large" | "huge",
  string
> = {
  tiny: "w-2 h-2",
  small: "w-3 h-3",
  sm: "w-4 h-4",
  medium: "w-8 h-8",
  large: "w-16 h-16",
  huge: "w-32 h-32",
} as const;

const iconMap: Record<EnergyType, ReactNode> = {
  null: <AsteriskIcon />,
  muscle: <BicepsFlexedIcon />,
  money: <DollarSignIcon />,
  knowledge: <BookTextIcon />,
  alchohol: <BeerIcon />,
  popularity: <SparklesIcon />,
};
export const Energy: FC<Props> = ({ energy, className, size = "medium" }) => {
  return (
    <div
      className={clsx(
        "rounded-full border flex items-center justify-center shadow-inner shadow-white drop-shadow-sm",
        sizeMap[size],
        colorMap[energy],
        className
      )}
    >
      {iconMap[energy]}
    </div>
  );
};
