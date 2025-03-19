import { Card } from "@/domains/card/components/Card";
import type { MasterCardType } from "@/domains/card/types";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const cards: MasterCardType[] = [
  {
    masterCardId: "backend-engineer",
    name: "バックエンドエンジニア",
    cardType: "monster",
    rarity: 3,
    imageUrl: "/backend.avif",
    expansion: "",
    hp: 90,
    element: "popularity",
    weakness: "money",
    skills: [
      {
        name: "DB設計",
        text: "このラムモンがダメージを受けているなら、60ダメージ追加",
        damage: 40,
        damageOption: "+",
        cost: ["popularity", "popularity"],
      },
      {
        name: "デザイナーへの悪口",
        text: "",
        damage: 50,
        damageOption: "+",
        cost: ["null", "popularity"],
      },
    ],
    ability: undefined,
    retreatCost: 2,
    evolvesFrom: ["newbie-engineer"],
    isEx: false,
    subType: "stage1",
  },
  {
    masterCardId: "bartender",
    name: "バーテンダー",
    cardType: "supporter",
    rarity: 6,
    imageUrl: "/bar.avif",
    expansion: "",
    text: "自分の[酒]ラムモンを1匹選ぶ。5回コインを投げ、オモテの数ぶんの好きなエネルギーを自分のエネルギーゾーンから出し、そのラムモンにつける。ウラの数1つにつき、そのラムモンに20ダメージ与える。",
  },
  {
    masterCardId: "liberal-arts-engineer",
    name: "文系エンジニア",
    cardType: "monster",
    rarity: 3,
    imageUrl: "/bunkei-engeer.avif",
    expansion: "",
    hp: 80,
    element: "null",
    weakness: "muscle",
    skills: [
      {
        name: "コーディング",
        text: "",
        damage: 80,
        damageOption: "+",
        cost: ["null", "null", "null"],
      },
    ],
    ability: undefined,
    retreatCost: 1,
    isEx: false,
    subType: "basic",
  },
  {
    masterCardId: "credit-card",
    name: "クレカ",
    cardType: "goods",
    rarity: 6,
    imageUrl: "/creditcard.avif",
    expansion: "",

    text: "自分の[金]ラムモン1匹に[金]エネルギーを5つつける。",
  },
  {
    masterCardId: "energy-drink",
    name: "エナジードリンク",
    cardType: "goods",
    rarity: 5,
    imageUrl: "/energy-drink.avif",
    expansion: "",
    text: "次の相手のターンに受けるダメージを全て無効にし、その分のダメージを次の自分の番の終わりに受ける。",
  },
  {
    masterCardId: "flaming-project",
    name: "炎上プロジェクト",
    cardType: "supporter",
    rarity: 3,
    imageUrl: "/enjou.avif",
    expansion: "",
    text: "お互いのバトルラムモンについているエネルギーを1つずつトラッシュする。",
  },
  {
    masterCardId: "firewall",
    name: "ファイヤーウォール",
    cardType: "supporter",
    rarity: 3,
    imageUrl: "/Ferris.avif",
    expansion: "",

    text: "次の相手の番、自分のラムモン全員が、相手のラムモンから受けるダメージを-20する。",
  },
  {
    masterCardId: "security-soft",
    name: "セキュリティソフト",
    cardType: "supporter",
    rarity: 3,
    imageUrl: "/Ferris.avif",
    expansion: "",

    text: "相手の手札を全て山札に戻す。相手は相手自身の勝つために必要なポイントの数分山札を引く。",
  },
  {
    masterCardId: "freelance-engineer",
    name: "フリーランスエンジニア",
    cardType: "monster",
    rarity: 2,
    imageUrl: "/free-eng.avif",
    expansion: "",
    hp: 100,
    element: "null",
    weakness: "money",
    skills: [
      {
        name: "業務委託",
        text: "",
        damage: 50,
        damageOption: "+",
        cost: ["null", "null"],
      },
    ],
    ability: undefined,
    retreatCost: 2,
    isEx: false,
    subType: "basic",
  },
  {
    masterCardId: "full-stack-engineer",
    name: "フルスタックエンジニア",
    cardType: "monster",
    rarity: 3,
    imageUrl: "/fullstuck.avif",
    expansion: "",
    hp: 130,
    element: "null",
    weakness: "null",
    skills: [
      {
        name: "全知全能",
        text: "自分の山札からラムモンをランダムに1枚、手札に加える。",
        damage: 20,
        damageOption: "+",
        cost: ["null", "null"],
      },
    ],
    ability: {
      name: "広く浅く",
      text: "このラムモンがたねラムモンから受けるワザのダメージを-20、2進化ラムモンから受けるワザのダメージを+10する。",
    },
    retreatCost: 2,
    evolvesFrom: ["newbie-engineer"],
    isEx: false,
    subType: "stage1",
  },
  {
    masterCardId: "garigari",
    name: "ガリガリエンジニア",
    cardType: "monster",
    rarity: 2,
    imageUrl: "/garigari.avif",
    expansion: "",
    hp: 50,
    element: "muscle",
    weakness: "alchohol",
    skills: [
      {
        name: "筋トレ",
        text: "",
        damage: 10,
        damageOption: "+",
        cost: ["muscle"],
      },
    ],
    ability: undefined,
    retreatCost: 1,
    evolvesTo: ["muchimuchi"],
    isEx: false,
    subType: "basic",
  },
  {
    masterCardId: "gopher",
    name: "Gopher",
    cardType: "monster",
    rarity: 5,
    imageUrl: "/gopher.avif",
    expansion: "",
    hp: 100,
    element: "alchohol",
    weakness: "knowledge",
    skills: [
      {
        name: "ビンタ",
        text: "",
        damage: 50,
        damageOption: "+",
        cost: ["alchohol", "alchohol"],
      },
    ],
    ability: {
      name: "Goroutineの追撃",
      text: "このラムモンが、相手のバトルラムモンにワザを使ったとき、ウラが出るまでコインを投げ、オモテの数x10ダメージ追加",
    },
    retreatCost: 2,
    isEx: false,
    subType: "basic",
  },
  {
    masterCardId: "hhkb",
    name: "HHKB",
    cardType: "goods",
    rarity: 2,
    imageUrl: "/hhkb.avif",
    expansion: "",

    text: "自分の山札から「駆け出しエンジニア」の進化先のラムモンをランダムに1枚、手札に加える。",
  },
  {
    masterCardId: "hot-reload",
    name: "ホットリロード",
    cardType: "goods",
    rarity: 2,
    imageUrl: "/hotreload.avif",
    expansion: "",

    text: "自分の手札をすべて山札に戻し、山札から同じ枚数のカードを引く。",
  },
];
export const Background: FC<Props> = ({ children }) => {
  return (
    <div className="h-screen">
      <div className="w-full absolute left-0 top-0 overflow-hidden h-screen z-0">
        {cards.map((card, i) => {
          return (
            <div
              key={card.masterCardId}
              className="absolute"
              style={{
                left: `${
                  i % 2 === 0
                    ? Math.floor(Math.random() * 31)
                    : 70 + Math.floor(Math.random() * 31)
                }vw`,
                top: `${Math.random() * 100}vh`,
                transform: `rotate(${Math.random() * 360}deg)`,
                opacity: Math.random() * 0.5 + 0.3,
                zIndex: 0,
              }}
            >
              <Card card={card} />
            </div>
          );
        })}
      </div>
      <div className="z-[1] relative">{children}</div>
    </div>
  );
};
