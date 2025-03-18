import type { FC, ReactNode } from "react";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../dialog";
import { Button } from "../button";

type Props = {
	title: string;
	message: string;
	onUnderStand: () => void;
	children: ReactNode;
};
export const AlertDialog: FC<Props> = ({
	title,
	message,
	onUnderStand,
	children,
}) => {
	return (
		<Dialog>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent className=" flex flex-col items-center px-4 justify-center">
				<strong> {title}</strong>
				<p> {message}</p>
				<div className="w-full flex flex-row gap-4 items-center  justify-between">
					<div className="w-full">
						<DialogClose asChild>
							<Button variant={"outline"} className="rounded-full w-full">
								キャンセル
							</Button>
						</DialogClose>
					</div>
					<div className="w-full">
						<DialogClose asChild>
							<Button
								variant={"outline"}
								onClick={onUnderStand}
								className="rounded-full w-full bg-red-600 text-white hover:bg-red-400"
							>
								了解
							</Button>
						</DialogClose>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
