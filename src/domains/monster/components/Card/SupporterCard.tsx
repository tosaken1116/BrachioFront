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
      <div className="flex flex-col h-full bg-gradient-to-r from-orange-200 rounded-xs via-white  to-orange-200">
        <div className="flex flex-row italic justify-between rounded-[3px] bg-gradient-to-r from-orange-300 via-20% via-slate-200 to-slate-200 drop-shadow-sm py-0.25 px-1 border border-slate-300">
          <strong className="text-[6px]">サポート</strong>
          <strong className="text-[6px]">トレーナーズ</strong>
        </div>
        <strong className="text-[7px] py-0.5 rounded-b-md drop-shadow-md bg-slate-200 px-1 border-b border-r border-black">
          {name}
        </strong>
        <div className="bg-slate-100 rounded-b-md mx-1 h-full flex flex-col border border-t-none border-slate-400">
          <div className="px-1 h-full flex flex-col">
            <div className="aspect-[8/5] drop-shadow-md shadow-black w-full overflow-hidden  border-2 border-gray-300 rounded-[3px]">
              <img src={imageUrl} alt={name} className=" object-cover" />
            </div>
            <div className=" grow flex items-center">
              <p className="text-[6px]">{text}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row  h-6 items-center relative">
          <div className="flex flex-row gap-0.5 items-center">
            {Array.from({ length: rarity }).map((_, i) => (
              <div key={`${id}-rarity-${i}`} className=" scale-x-75">
                <div className="h-1.5 w-1.5 border-[0.75px] border-black bg-gradient-to-r from-slate-200 via-slate-500 to-slate-200 rotate-45 rounded-[1px]" />
              </div>
            ))}
          </div>
          <div className="absolute right-0 rounded-[3px] h-4 -top-1 items-center flex bg-gradient-to-r from-orange-400 shadow-inner border  border-r-0 rounded-br-none rounded-tr-none w-3/4 border-slate-300  via-slate-200 to-orange-400 drop-shadow-sm py-0.25 px-1 text-[4px]">
            <p>サポートは、自分の番に1枚しか使えない</p>
          </div>
        </div>
      </div>
    </CardBase>
  );
};
