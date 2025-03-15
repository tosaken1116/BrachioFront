import type { FC } from "react";
import type { SupporterType } from "../../types";
import { CardBase } from "./Card";

type Props = {
  card: SupporterType;
};

export const SupporterCard: FC<Props> = ({ card }) => {
  const { id, name, text, imageUrl, rarity } = card;
  return (
    <CardBase card={card}>
      <div className="flex flex-col h-full bg-gradient-to-r from-orange-200 rounded-sm via-white  to-orange-200">
        <div className="flex flex-row italic justify-between rounded-md bg-gradient-to-r from-orange-300 via-20% via-slate-200 to-slate-200 drop-shadow-sm py-0.5 px-2 border border-slate-300">
          <strong className="text-xs">サポート</strong>
          <strong className="text-xs">トレーナーズ</strong>
        </div>
        <div className=" rounded-b-md drop-shadow-md bg-slate-200 px-2 border-b border-r border-black">
          <strong className="text-sm"> {name}</strong>
        </div>
        <div className="bg-slate-100 rounded-b-md mx-2 h-full flex flex-col border border-t-none border-slate-400">
          <div className="px-2 h-full flex flex-col">
            <div className="aspect-[8/5] drop-shadow-md shadow-black w-full overflow-hidden  border-4 border-gray-300 rounded-md">
              <img src={imageUrl} alt={name} className=" object-cover" />
            </div>
            <div className=" grow flex items-center">
              <p className="text-xs">{text}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row  h-12 items-center relative">
          <div className="flex flex-row gap-1 items-center">
            {Array.from({ length: rarity }).map((_, i) => (
              <div key={`${id}-rarity-${i}`} className=" scale-x-75">
                <div className="h-3 w-3 border-[1.5px] border-black bg-gradient-to-r from-slate-200 via-slate-500 to-slate-200 rotate-45 rounded-xs" />
              </div>
            ))}
          </div>
          <div className="absolute right-0 rounded-md h-8 -top-2 items-center flex bg-gradient-to-r from-orange-400 shadow-inner border  border-r-0 rounded-br-none rounded-tr-none w-3/4 border-slate-300  via-slate-200 to-orange-400 drop-shadow-sm py-0.5 px-2 text-[8px]">
            <p>サポートは、自分の番に1枚しか使えない</p>
          </div>
        </div>
      </div>
    </CardBase>
  );
};
