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
  energy?: MonsterTypes[];
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

export const MonsterCard: FC<MonsterCardProps> = ({
  card,
  className = "",
  energy,
}) => {
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
          "flex flex-col p-1 w-full h-full rounded-xs relative",
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
            className="absolute -left-1 top-0.5 w-4 px-0.5 text-center tracking-widest"
          />
          <strong className="text-[8px] pl-3 w-full"> {name}</strong>
          <div className="flex flex-row items-end">
            <p className="text-[5px] pb-0.5">HP</p>
            <strong className="text-[8px]">{hp}</strong>
          </div>
          <div>
            <Energy type={type} size="small" />
          </div>
        </div>
        {/* 画像 */}
        <div className="aspect-[5/8] w-full overflow-hidden  border-2 border-slate-100">
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
        <div className="flex flex-row gap-1 w-full">
          <Plate className="flex flex-row w-full px-1 py-0 items-center justify-around">
            <p>弱点</p>
            <div className="flex flex-row items-center">
              <Energy type={weaknesses.type} size="tiny" />
              <strong className="text-[6px]">{weaknesses.value}</strong>
            </div>
          </Plate>
          <Plate className="flex flex-row w-full px-1 py-[1px] items-center">
            <p className="px-1">にげる</p>
            <div className="flex flex-row items-center">
              {Array.from({ length: retreatCost }).map((_, i) => (
                <Energy key={`${id}-retreat-${i}`} type="Normal" size="tiny" />
              ))}
            </div>
          </Plate>
        </div>
        {/* レア度 */}
        <div className="flex flex-row gap-0.5 h-6 items-center">
          {Array.from({ length: rarity }).map((_, i) => (
            <div key={`${id}-rarity-${i}`} className=" scale-x-75">
              <div className="h-1.5 w-1.5 border-[0.75px] border-black bg-gradient-to-r from-slate-200 via-slate-500 to-slate-200 rotate-45 rounded-xs" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row gap-0.5 absolute -bottom-2 left-1">
        {energy?.map((type, i) => (
          <Energy key={`${id}-${type}-energy-${i}`} type={type} size="sm" />
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
        <div className="flex flex-row items-center w-8 shrink-0">
          {attack.cost.map((type, i) => {
            return (
              <Energy
                key={`${id}-${attack.name}-${i}`}
                type={type}
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
