import { useDroppable } from "@dnd-kit/core";
import type { FC, ReactNode } from "react";

type DroppableProps = {
	children: ReactNode;
	id: string;
	disabled?: boolean;
	className?: string;
};

export const Droppable: FC<DroppableProps> = ({
	children,
	id,
	disabled = false,
	className,
}) => {
	const { setNodeRef } = useDroppable({
		id,
		disabled,
	});

	return (
		<div ref={setNodeRef} className={className}>
			{children}
		</div>
	);
};
