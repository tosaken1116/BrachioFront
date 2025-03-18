import { Card } from "@/domains/card/components/Card";
import { Energy } from "@/domains/card/components/Energy";
import type { EnergyType, MonsterCardType } from "@/domains/card/types";
import type { FC } from "react";

type Props = {
  energy: EnergyType;
  thumbnailCard: MonsterCardType;
};

const colorToken: Record<EnergyType, Record<string, string>> = {
  NULL: {
    front: "#cccccc",
    top: "#a9a9a9",
    side: "#898989",
  },
  ALCOHOL: {
    front: "#420089",
    top: "#390077",
    side: "#1c003a",
  },
  POPULARITY: {
    front: "#0f5014",
    top: "#0d3c0f",
    side: "#06200a",
  },
  MUSCLE: {
    front: "#b65050",
    top: "#a63b3b",
    side: "#7d2b2b",
  },
  MONEY: {
    front: "#f2e100",
    top: "#e6c300",
    side: "#b38b00",
  },
  KNOWLEDGE: {
    front: "#00a2e8",
    top: "#0088cc",
    side: "#005b80",
  },
} as const;
export const DeckCase: FC<Props> = ({ energy, thumbnailCard }) => {
  return (
    <div className="relative w-fit">
      <div className="absolute top-[70%] left-0 -translate-y-1/2 z-20 skew-y-6 scale-50">
        <Card card={thumbnailCard} />
      </div>
      <div className="absolute top-[63%] right-1/12 -translate-y-1/2 z-20 -skew-y-[20deg] scale-y-75 scale-x-50">
        <Energy energy={energy} />
      </div>

      <svg width="150" height="200" xmlns="http://www.w3.org/2000/svg">
        <title>deck case</title>

        <polygon
          points="110,135 130,115 130,60 110,70"
          fill={colorToken[energy].side}
          stroke-width="2"
        />
        <polygon
          points="110,200 130,175 130,115 110,140"
          fill="#898989"
          stroke-width="2"
        />
        <polygon
          points="20,190 110,200 110,140 20,130"
          fill="#d9d9d9"
          stroke-width="2"
        />
        <polygon
          points="20,130 110,140 110,130 20,120"
          fill={"#626262"}
          stroke-width="2"
        />
        <polygon
          points="110,140 130,120 130,115 110,135"
          fill={"#434343"}
          stroke-width="2"
        />

        <polygon
          points="20,125 110,135 110,80 20,70"
          fill={colorToken[energy].front}
          stroke-width="2"
        />
        <polygon
          points="20,70 110,80 130,60 40,50"
          fill={colorToken[energy].top}
          stroke-width="2"
        />
      </svg>
    </div>
  );
};
