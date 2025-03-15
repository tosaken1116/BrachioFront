import clsx from "clsx";
import type { FC, ReactNode } from "react";
import type {
  AbilityType,
  AttackType,
  MonsterType,
  MonsterTypes,
} from "../../types";
import { Energy } from "../Energy";
import { CardBase } from "./Card";
type MonsterCardProps = {
  card: MonsterType;
  className?: string;
};

const typeColorMap: Record<MonsterTypes, string> = {
  Normal: "bg-gray-200",
  Fire: "bg-red-200",
  Water: "bg-blue-200",
  Electric: "bg-[#ffe700]",
  Grass: "bg-green-200",
  Ice: "bg-blue-100",
  Fighting: "bg-red-100",
  Poison: "bg-purple-200",
  Ground: "bg-yellow-100",
  Flying: "bg-blue-300",
  Psychic: "bg-purple-100",
  Bug: "bg-green-100",
  Rock: "bg-yellow-300",
  Ghost: "bg-purple-300",
  Dragon: "bg-blue-400",
  Darkness: "bg-gray-400",
  Metal: "bg-gray-300",
  Fairy: "bg-pink-200",
} as const;

export const MonsterCard: FC<MonsterCardProps> = ({ card, className = "" }) => {
  const {
    id,
    name,
    subtype,
    type,
    hp,
    attacks,
    abilities,
    weaknesses,
    retreatCost,
    imageUrl,
    rarity,
  } = card;

  // subtype = "Basic", "Stage1", "Stage2" など
  // 背景色と枠線色をtypeから決定
  const typeClass = typeColorMap[type] || "bg-gray-100 border-gray-300";

  return (
    <CardBase card={card} className={className}>
      <div
        className={clsx(
          "flex flex-col p-2 w-full h-full rounded-sm relative",
          typeClass
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
            subtype={subtype}
            className="absolute -left-2 top-1 w-8 px-1 text-center tracking-widest"
          />
          <strong className="text-md pl-6 w-full"> {name}</strong>
          <div className="flex flex-row items-end">
            <p className="text-[10px] pb-1">HP</p>
            <strong className="text-md">{hp}</strong>
          </div>
          <div>
            <Energy type={type} />
          </div>
        </div>
        {/* 画像 */}
        <div className="aspect-[5/8] w-full overflow-hidden  border-4 border-slate-100">
          <img src={imageUrl} alt={name} className=" object-cover" />
        </div>
        {/* 技、特性 */}
        <div className="flex flex-col h-full justify-center">
          {abilities.map((ability) => (
            <Ability key={`${id}-${ability.name}`} ability={ability} />
          ))}
          {attacks.map((attack) => (
            <Attack id={id} key={`${id}-${attack.name}`} attack={attack} />
          ))}
        </div>
        {/* 弱点 */}
        <div className="flex flex-row gap-2 w-full">
          <Plate className="flex flex-row w-full px-2 py-0 items-center justify-around">
            <p>弱点</p>
            <div className="flex flex-row items-center">
              <Energy type={weaknesses.type} size="small" />
              <strong className="text-xs">{weaknesses.value}</strong>
            </div>
          </Plate>
          <Plate className="flex flex-row w-full px-2 py-0.5 items-center">
            <p className="px-2">にげる</p>
            <div className="flex flex-row items-center">
              {Array.from({ length: retreatCost }).map((_, i) => (
                <Energy key={`${id}-retreat-${i}`} type="Normal" size="small" />
              ))}
            </div>
          </Plate>
        </div>
        {/* レア度 */}
        <div className="flex flex-row gap-1 h-12 items-center">
          {Array.from({ length: rarity }).map((_, i) => (
            <div key={`${id}-rarity-${i}`} className=" scale-x-75">
              <div className="h-3 w-3 border-[1.5px] border-black bg-gradient-to-r from-slate-200 via-slate-500 to-slate-200 rotate-45 rounded-xs" />
            </div>
          ))}
        </div>
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
        "shadow rounded-sm text-[8px] text-center",
        colorClass,
        className
      )}
    >
      {children}
    </div>
  );
};

const EvolutionBatch: FC<
  Pick<MonsterType, "subtype"> & { className?: string }
> = ({ subtype, className = "" }) => {
  return (
    <Plate className={clsx("italic", className)}>
      {subtype === "Basic" ? (
        <p>たね</p>
      ) : subtype === "Stage1" ? (
        <p>1進化</p>
      ) : (
        <p>2進化</p>
      )}
    </Plate>
  );
};

const Attack: FC<{ attack: AttackType; id: string }> = ({ attack, id }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center w-16 shrink-0">
          {attack.cost.map((type, i) => {
            return <Energy key={`${id}-${attack.name}-${i}`} type={type} />;
          })}
        </div>
        <strong className="text-sm w-full">{attack.name}</strong>
        <strong className="text-sm">{attack.damage}</strong>
      </div>
      <p className="text-[8px]">{attack.text}</p>
    </div>
  );
};

const Ability: FC<{ ability: AbilityType }> = ({ ability }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-2">
        <div>
          <Plate color="red" className="w-12">
            特性
          </Plate>
        </div>
        <strong className="text-sm">{ability.name}</strong>
      </div>
      <p className="text-[8px]">{ability.text}</p>
    </div>
  );
};
