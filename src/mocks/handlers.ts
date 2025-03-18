import type { Deck } from "@/domains/deck/types";
import { HttpResponse } from "msw";
import { createOpenApiHttp } from "openapi-msw";
import type { MasterCardType } from "../domains/card/types";
import type { paths } from "../lib/api/type";
import cards from "./cards.json";
const http = createOpenApiHttp<paths>({
  baseUrl: "http://localhost:8080",
});
function getRandomElements(n: number): (typeof energyElements)[number][] {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(getRandomElement(energyElements as unknown as unknown[]));
  }
  // @ts-ignore
  return result as unknown as (typeof energyElements)[number];
}
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
const allCards: MasterCardType[] = cards as unknown as MasterCardType[];

const energyElements = [
  "muscle",
  "knowledge",
  "money",
  "popularity",
  "alchohol",
  "null",
] as const;

function getRandomGachas(n: number) {
  const gachas = [];
  for (let i = 0; i < n; i++) {
    gachas.push({
      id: `GACHA-${i + 1}`,
      name: `ガチャ ${i + 1}`,
      imageUrl: `http://example.com/gacha/GACHA-${i + 1}.png`,
    });
  }
  return gachas;
}

// アイテム一覧（Item スキーマ: id, name, count）
function getRandomItems(n: number) {
  const items = [];
  for (let i = 0; i < n; i++) {
    items.push({
      id: `ITEM-${i + 1}`,
      name: `アイテム ${i + 1}`,
      count: Math.floor(Math.random() * 5) + 1,
    });
  }
  return items;
}

function getRandomCards(n: number) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(getRandomElement(allCards));
  }
  return result;
}

export const handlers = [
  // GET /cards - ランダムなカード一覧を返す
  http.get("/cards", () => {
    // 例として 10 枚のランダムなカードを返却
    const cards = getRandomCards(10);
    const res = cards.map((card) => {
      return {
        masterCard: card,
        count: Math.floor(Math.random() * 5) + 1,
      };
    });
    return HttpResponse.json(res);
  }),

  // GET /decks - ランダムなデッキ一覧を返す
  http.get("/decks", () => {
    // 例として 3 つのランダムなデッキを生成
    const decks = Array.from({ length: 3 }).map((_, i) => ({
      id: `deck-${i + 1}`,
      name: `ランダムデッキ ${i + 1}`,
      elements: getRandomElements(2),
      cards: getRandomCards(5).map((card, i) => ({
        ...card,
        id: `${card.masterCardId}-${i}`,
      })),
      thumbnailCard: { ...getRandomCards(1)[0], id: "1" },
      color: getRandomElements(1)[0],
    }));
    return HttpResponse.json(decks);
  }),

  // POST /decks - 新しいデッキを作成
  http.post("/decks", async (a) => {
    const deck = a.request.json() as Deck;
    // 新しいIDを付与して返す（例: deck-ランダム数字）
    deck.id = `deck-${Math.floor(Math.random() * 1000)}`;
    return HttpResponse.json(deck);
  }),

  // GET /decks/{deckId} - 指定されたデッキを返す
  http.get("/decks/{deckId}", ({ params }) => {
    const e = [...getRandomElements(2)] as (
      | "muscle"
      | "knowledge"
      | "money"
      | "popularity"
      | "alchohol"
      | "null"
    )[];
    const deck = {
      id: params.deckId,
      name: `ランダムデッキ ${params.deckId}`,
      cards: getRandomCards(20).map((card, i) => ({
        ...card,
        id: `${card.masterCardId}-${i}`,
      })),
      energies: e,
      thumbnailCard: { ...getRandomCards(1)[0], id: "1" },
      color: e[0],
    };
    return HttpResponse.json(deck);
  }),

  // PUT /decks/{deckId} - デッキの更新
  http.put("/decks/{deckId}", async () => {
    // 更新処理をエミュレーションとして、そのまま返す
    return HttpResponse.json();
  }),

  // GET /gachas - ランダムなガチャ一覧を返す
  http.get("/gachas", () => {
    return HttpResponse.json(getRandomGachas(3));
  }),

  // POST /gachas/{gachaId} - ガチャを引く
  http.post("/gachas/{gachaId}", async ({ request }) => {
    const drawRequest = await request.json();
    // isTenDraw が true なら 2 セット、そうでなければ 1 セットのパック（各パックは 5 枚）
    const packCount = drawRequest.isTenDraw ? 2 : 1;
    const packs = Array.from({ length: packCount }).map(() => ({
      cards: getRandomCards(5),
    }));
    return HttpResponse.json(packs);
  }),

  // GET /items - ランダムなアイテム一覧を返す
  http.get("/items", () => {
    return HttpResponse.json(getRandomItems(3));
  }),

  // GET /pack-power - パックパワーの状況を返す
  http.get("/gachas/power", () => {
    return HttpResponse.json({
      next: Math.floor(Math.random() * 90) + 30, // 30～120秒
      charged: Math.floor(Math.random() * 6), // 0～5
    });
  }),
];
