import clsx from "clsx";
import type { FC, ReactNode } from "react";
import type {
	AbilityType,
	AttackType,
	EnergyType,
	MonsterMasterType,
	MonsterType,
} from "../../types";
import { Energy } from "../Energy";
import { CardBase } from "./Card";
type MonsterCardProps = {
	card: MonsterMasterType;
	className?: string;
	energy?: EnergyType[];
};

const typeColorMap: Record<EnergyType, string> = {
	null: "bg-gray-100 border-gray-200",
	muscle: "bg-red-400 border-red-500",
	knowledge: "bg-blue-400 border-blue-500",
	money: "bg-yellow-400 border-yellow-500",
	popularity: "bg-green-400 border-green-500",
	alchohol: "bg-purple-400 border-purple-500",
} as const;

export const MonsterCard: FC<MonsterCardProps> = ({
	card,
	className = "",
	energy,
}) => {
	const {
		masterCardId,
		name,
		subType,
		element: type,
		hp,
		skills: attacks,
		ability,
		weakness,
		retreatCost,
		imageUrl,
		rarity,
	} = card;

	// subType = "basic", "stage1", "stage2" など
	// 背景色と枠線色をtypeから決定
	const typeClass = typeColorMap[type] || "bg-gray-100 border-gray-300";

	return (
		<CardBase card={card} className={className}>
			<div
				className={clsx(
					"flex flex-col p-1 w-full h-full rounded-xs relative",
					typeClass,
				)}
			>
				<img
					src={"/fog.png"}
					alt="fog"
					draggable="false"
					className=" select-none opacity-[15%] absolute left-0 top-0 w-full h-full mix-blend-luminosity"
				/>
				{/* 名前 HP */}
				<div className="relative flex flex-row items-center">
					<EvolutionBatch
						subType={subType}
						className="absolute -left-1 top-0.5 w-4 px-0.5 text-center tracking-widest"
					/>
					<strong className="text-[8px] pl-3 w-full"> {name}</strong>
					<div className="flex flex-row items-end">
						<p className="text-[5px] pb-0.5">HP</p>
						<strong className="text-[8px]">{hp}</strong>
					</div>
					<div>
						<Energy energy={type} size="small" />
					</div>
				</div>
				{/* 画像 */}
				<div className="aspect-[5/8] w-full overflow-hidden  border-2 border-slate-100">
					<img src={imageUrl} alt={name} className=" object-cover" />
				</div>
				{/* 技、特性 */}
				<div className="flex flex-col h-full justify-center">
					{ability && (
						<Ability
							key={`${masterCardId}-${ability.name}`}
							ability={ability}
						/>
					)}
					{attacks.map((attack) => (
						<Attack
							masterCardId={masterCardId}
							key={`${masterCardId}-${attack.name}`}
							attack={attack}
						/>
					))}
				</div>
				{/* 弱点 */}
				<div className="flex flex-row gap-1 w-full">
					<Plate className="flex flex-row w-full px-1 py-0 items-center justify-around">
						<p>弱点</p>
						<div className="flex flex-row items-center">
							<Energy energy={weakness} size="tiny" />
							<strong className="text-[6px]">+20</strong>
						</div>
					</Plate>
					<Plate className="flex flex-row w-full px-1 py-[1px] items-center">
						<p className="px-1">にげる</p>
						<div className="flex flex-row items-center">
							{Array.from({ length: retreatCost }).map((_, i) => (
								<Energy
									key={`${masterCardId}-retreat-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										i
									}`}
									energy="null"
									size="tiny"
								/>
							))}
						</div>
					</Plate>
				</div>
				{/* レア度 */}
				<div className="flex flex-row gap-0.5 h-6 items-center">
					{Array.from({ length: rarity }).map((_, i) => (
						<div
							key={`${masterCardId}-rarity-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								i
							}`}
							className=" scale-x-75"
						>
							<div className="h-1.5 w-1.5 border-[0.75px] border-black bg-gradient-to-r from-slate-200 via-slate-500 to-slate-200 rotate-45 rounded-xs" />
						</div>
					))}
				</div>
			</div>
			<div className="flex flex-row gap-0.5 absolute -bottom-2 left-1">
				{energy?.map((type, i) => (
					<Energy
						key={`${masterCardId}-${type}-energy-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							i
						}`}
						energy={type}
						size="sm"
					/>
				))}
			</div>
		</CardBase>
	);
};

type PlateProps = {
	color?: "white" | "red";
	className?: string;
	children: ReactNode;
};

const Plate: FC<PlateProps> = ({
	color = "white",
	className = "",
	children,
}) => {
	const colorClass = color === "white" ? "bg-white" : "bg-red-100";
	return (
		<div
			className={clsx(
				"shadow rounded-xs text-[4px] text-center",
				colorClass,
				className,
			)}
		>
			{children}
		</div>
	);
};

const EvolutionBatch: FC<
	Pick<MonsterType, "subType"> & { className?: string }
> = ({ subType, className = "" }) => {
	return (
		<Plate className={clsx("italic", className)}>
			{subType === "basic" ? (
				<p>たね</p>
			) : subType === "stage1" ? (
				<p>1進化</p>
			) : (
				<p>2進化</p>
			)}
		</Plate>
	);
};

const Attack: FC<{ attack: AttackType; masterCardId: string }> = ({
	attack,
	masterCardId,
}) => {
	return (
		<div className="flex flex-col">
			<div className="flex flex-row items-center">
				<div className="flex flex-row items-center w-8 shrink-0">
					{attack.cost?.map((type, i) => {
						return (
							<Energy
								key={`${masterCardId}-${attack.name}-${i}`}
								energy={type}
								size="tiny"
							/>
						);
					})}
				</div>
				<strong className="text-[7px] w-full">{attack.name}</strong>
				<strong className="text-[7px]">{attack.damage}</strong>
			</div>
			<p className="text-[4px]">{attack.text}</p>
		</div>
	);
};

const Ability: FC<{ ability: AbilityType }> = ({ ability }) => {
	return (
		<div className="flex flex-col">
			<div className="flex flex-row items-center gap-1">
				<div>
					<Plate color="red" className="w-6">
						特性
					</Plate>
				</div>
				<strong className="text-[7px]">{ability.name}</strong>
			</div>
			<p className="text-[4px]">{ability.text}</p>
		</div>
	);
};
