import type { FC } from "react";
import type { GoodsType } from "../../types";

type Props = {
  card: GoodsType;
};
export const GoodsCard: FC<Props> = ({ card }) => {
  return (
    <div>
      <h2>{card.name}</h2>
      <p>{card.text}</p>
    </div>
  );
};
