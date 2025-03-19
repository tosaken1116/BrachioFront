import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { WithBackCard } from "@/components/ui/withBackCard";
import { Pack } from "@/domains/card/components/Pack";
import { useGachaUsecase } from "@/domains/gacha/usecase";
import { useGetGachaList, useGetItem } from "@/domains/gacha/usecase/cache";
import { getUserInfo } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";
import { ClipboardPlus, Heart, ShoppingBag } from "lucide-react";
import { Suspense } from "react";

const Inner = () => {
  const { data: items } = useGetItem();
  const user = getUserInfo();
  user?.profile.picture;
  const { data: gachas } = useGetGachaList();
  const { getNewPack } = useGachaUsecase();
  return (
    <WithBackCard color="muscle" className="h-screen max-w-2xl w-fit mx-auto">
      <div className="rounded-full   z-[50] relative mx-auto overflow-hidden h-16 w-16">
        <img src={user?.profile.picture} />
      </div>
      <div className="flex flex-col gap-12 px-8">
        <WithBackCard
          color="money"
          className="bg-slate-300 rounded-xl relative overflow-hidden"
        >
          <div className="flex flex-row h-1/2 items-center justify-center">
            {gachas.map((gacha) => {
              return (
                <Drawer direction="top" key={gacha.imageUrl}>
                  <DrawerTrigger>
                    <Pack gacha={gacha} />
                  </DrawerTrigger>
                  <DrawerContent className="w-full h-screen flex justify-center items-center mx-auto ">
                    <WithBackCard color="money">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 scale-150 -translate-y-1/2">
                        <button
                          type="button"
                          onClick={() => {
                            getNewPack(items[0].count > 100);
                          }}
                        >
                          <Pack gacha={gacha} />
                        </button>
                      </div>
                    </WithBackCard>
                  </DrawerContent>
                </Drawer>
              );
            })}
          </div>
          <div className="rounded-full absolute bottom-0  left-1/2 -translate-x-1/2">
            <div>
              {items.map((item) => {
                return (
                  <div
                    key={item.imageUrl}
                    className="relative w-16 h-16 rounded-md  drop-shadow-2xl overflow-hidden border-4 bg-slate-400"
                  >
                    <div className="absolute bottom-0 right-0 text-md bg-slate-400/70   w-8 h-6 text-center   ">
                      {item.count}
                    </div>

                    <img
                      className="w-full h-full object-cover  border-white"
                      src={item.imageUrl}
                      alt={item.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </WithBackCard>
        <div className="flex flex-row w-full gap-12 h-48">
          <WithBackCard
            className="w-full h-full rounded-xl overflow-hidden bg-slate-200 gap-4 items-center flex  flex-col"
            color="muscle"
          >
            <div className="w-full h-full">
              <ClipboardPlus />
            </div>
            <div className="w-full rounded-full shadow-inner flex flex-row  items-center justify-center">
              {Array.from({ length: 5 }).map((_, i) => {
                return <Heart color="orange" key={`${i}`} />;
              })}
            </div>
          </WithBackCard>
          <WithBackCard
            className="w-full h-full rounded-xl drop-shadow-md bg-slate-200 overflow-hidden"
            color="null"
          >
            <div className="w-full h-full">
              <ShoppingBag />
            </div>
            <p className="w-full  mx-auto">ショップ/交換所</p>
          </WithBackCard>
        </div>
      </div>
    </WithBackCard>
  );
};

const Home = () => {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
};

export const Route = createFileRoute("/home/")({
  component: Home,
});
