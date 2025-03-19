import { Title } from "@/routes";
import type { FC } from "react";

type Props = {
  gacha: {
    name: string;
    imageUrl: string;
    id: string;
  };
};
export const Pack: FC<Props> = ({ gacha }) => {
  return (
    <div className="scale-[0.4] w-96 rounded-dm overflow-hidden border-2 drop-shadow-lg flex items-center flex-col shadow-black bg-green-600 border-slate-300">
      <div className="scale-[0.3] flex h-28 items-center -translate-y-2">
        <Title />
      </div>
      <div className="w-full h-full ">
        <img src={gacha.imageUrl} className="object-cover" alt={gacha.name} />
      </div>
      <strong className="text-5xl text-white bottom-5 absolute">
        {gacha.name}
      </strong>
    </div>
  );
};
