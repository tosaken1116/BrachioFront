import { useDraggable } from "@dnd-kit/core";
import type { FC, ReactNode } from "react";

type DraggableProps = {
  id: string;
  label: string;
  children: ReactNode;
  disabled?: boolean;
};
export const Draggable: FC<DraggableProps> = ({
  id,
  label,
  children,
  disabled = false,
}) => {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id,
    data: {
      label,
      id: id,
    },
    disabled,
  });

  const transformStyle = transform
    ? `translate(${transform.x}px, ${transform.y}px)`
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: transformStyle,
        height: "fit-content",
      }}
    >
      {children}
    </div>
  );
};
