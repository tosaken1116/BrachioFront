import type { EnergyType } from "@/domains/card/types";
import clsx from "clsx";
import type { FC, ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
  color?: EnergyType;
};

const colorMap: Record<EnergyType, string> = {
  null: "before:from-gray-600 before:to-gray-300",
  muscle: "before:from-red-600 before:to-red-300",
  knowledge: "before:from-blue-600 before:to-blue-300",
  money: "before:from-yellow-600 before:to-yellow-300",
  popularity: "before:from-green-600 before:to-green-300",
  alchohol: "before:from-purple-600 before:to-purple-300",
} as const;
export const WithBackCard: FC<Props> = ({
  className,
  children,
  color = "null",
}) => {
  return (
    <div
      className={clsx(
        `w-full h-full relative before:absolute before:left-0 before:top-0 before:bg-gradient-to-l before:contents-[''] before:w-full before:h-1/4 before:[clip-path:polygon(0%_0%,100%_0%,100%_50%,0%_100%)] `,
        colorMap[color],
        className
      )}
    >
      {children}
    </div>
  );
};
