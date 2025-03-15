import { useDroppable } from "@dnd-kit/core";
import type { FC, ReactNode } from "react";

type DroppableProps = {
  children: ReactNode;
  id: string;
  disabled?: boolean;
};

export const Droppable: FC<DroppableProps> = ({
  children,
  id,
  disabled = false,
}) => {
  const { setNodeRef } = useDroppable({
    id,
    disabled,
  });

  return <div ref={setNodeRef}>{children}</div>;
};
