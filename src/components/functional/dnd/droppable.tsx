import { useDroppable } from "@dnd-kit/core";
import type { FC, ReactNode } from "react";

type DroppableProps = {
  children: ReactNode;
  id: string;
};

export const Droppable: FC<DroppableProps> = ({ children, id }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return <div ref={setNodeRef}>{children}</div>;
};
