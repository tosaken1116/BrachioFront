import type { FC } from "react";
import type { SupporterType } from "../../types";

type Props = {
  card: SupporterType;
};

export const SupporterCard: FC<Props> = ({ card }) => {
  return (
    <div>
      <h2>{card.name}</h2>
      <p>{card.text}</p>
    </div>
  );
};
