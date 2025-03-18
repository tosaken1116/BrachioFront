import type {
  AttackType,
  CardBaseType,
  EnergyType,
  GoodsType,
  MonsterCardType,
  MonsterType,
} from "@/domains/card/types";
import type { Card } from "@/generated/messages/card_pb";
import { Element } from "@/generated/messages/common_pb";
import type { Effect, EffectWithSecret } from "@/generated/messages/effect_pb";
import type { Skill } from "@/generated/messages/skill_pb";
import {
  AbilityEventToServerSchema,
  AttackMonsterEventToServerSchema,
  CoinTossEventToServerSchema,
  ConfirmEnergyEventToServerSchema,
  ConfirmTargetEventToServerSchema,
  DrawEventToServerSchema,
  EvolutionMonsterEventToServerSchema,
  InitialPlacementCompleteEventToServerSchema,
  RetreatEventToServerSchema,
  SummonMonsterEventToServerSchema,
  SupplyEnergyEventToServerSchema,
  SurrenderEventToServerSchema,
  TakeGoodsEventToServerSchema,
  TakeSupportEventToServerSchema,
} from "@/generated/websocket/event/playing_pb";
import {
  type EventEnvelope,
  EventEnvelopeSchema,
  EventMetadataSchema,
} from "@/generated/websocket/event_pb";
import { fromBinary, toBinary, create as toProto } from "@bufbuild/protobuf";
import type { MutableRefObject } from "react";
import type ReconnectingWebSocket from "reconnecting-websocket";
import { create } from "zustand";

type EventState = {
  selfCard: CardBaseType[];
  otherCardLength: number;

  selfBattle: MonsterType | null;
  selfBench: (MonsterType | null)[];

  otherBattle: MonsterType | null;
  otherBench: (MonsterType | null)[];

  selfPokemonEnergy: Record<MonsterCardType["id"], EnergyType[]>;
  otherPokemonEnergy: Record<MonsterCardType["id"], EnergyType[]>;

  selfEnergy: [EnergyType | null, EnergyType | null];
  otherEnergy: [EnergyType | null, EnergyType | null];

  selectEnergies: EnergyType[];

  selfId: string;
  otherId: string | null;
  currentTurnUser: "self" | "other" | null;
};

type Metadata = {
  actorId: string | null;
};

type State = {
  socketRef: MutableRefObject<ReconnectingWebSocket | undefined> | null;
  eventState: EventState;
  metadata: Metadata;
};

type Action = {
  setSocketRef: (
    socketRef: MutableRefObject<ReconnectingWebSocket | undefined> | null
  ) => void;
  sendEvent: <Event extends EventEnvelope["event"]>(event: Event) => void;
  draw: (payload: RequestAnalyze<typeof DrawEventToServerSchema>) => void;
  attackMonster: (
    payload: RequestAnalyze<typeof AttackMonsterEventToServerSchema>
  ) => void;
  ability: (payload: RequestAnalyze<typeof AbilityEventToServerSchema>) => void;
  retreat: (payload: RequestAnalyze<typeof RetreatEventToServerSchema>) => void;
  coinToss: (
    payload: RequestAnalyze<typeof CoinTossEventToServerSchema>
  ) => void;
  surrender: (
    payload: RequestAnalyze<typeof SurrenderEventToServerSchema>
  ) => void;
  takeGoods: (
    payload: RequestAnalyze<typeof TakeGoodsEventToServerSchema>
  ) => void;
  takeSupport: (
    payload: RequestAnalyze<typeof TakeSupportEventToServerSchema>
  ) => void;
  supplyEnergy: (
    payload: RequestAnalyze<typeof SupplyEnergyEventToServerSchema>
  ) => void;
  confirmEnergy: (
    payload: RequestAnalyze<typeof ConfirmEnergyEventToServerSchema>
  ) => void;
  confirmTarget: (
    payload: RequestAnalyze<typeof ConfirmTargetEventToServerSchema>
  ) => void;
  summonMonster: (
    payload: RequestAnalyze<typeof SummonMonsterEventToServerSchema>
  ) => void;
  evolutionMonster: (
    payload: RequestAnalyze<typeof EvolutionMonsterEventToServerSchema>
  ) => void;
  initialPlacementComplete: (
    payload: RequestAnalyze<typeof InitialPlacementCompleteEventToServerSchema>
  ) => void;
};

type RequestAnalyze<T extends Parameters<typeof toProto>[0]> =
  Required<Exclude<Parameters<typeof toProto<T>>[1], undefined>> extends {
    payload: infer P;
  }
    ? Required<Omit<P, "$typeName">>
    : never;

const typeConverter = (energy: Element) => {
  switch (energy) {
    case Element.MONEY:
      return "money";
    case Element.KNOWLEDGE:
      return "knowledge";
    case Element.MUSCLE:
      return "muscle";
    case Element.ALCHOHOL:
      return "alchohol";
    case Element.POPULARITY:
      return "popularity";
    case Element.NULL:
      return "null";
    default:
      return "null";
  }
};
const skillConverter = (skill: Skill): AttackType => {
  return {
    name: skill.name,
    text: skill.text,
    damage: skill.damage,
    cost: skill.cost.map(typeConverter),
  };
};

export type EffectType = ReturnType<typeof effectConverter>;
const effectConverter = (effect: Effect["effect"]) => {
  const c = effect.case;
  if (c === "attachEnergy") {
    const energies = effect.value.energies.map(typeConverter);
    const pos = effect.value.position;
    return {
      type: "attachEnergy",
      energies,
      position: pos,
    };
  }
  if (c === "coinToss") {
    const coinToss = effect.value.result;
    return {
      type: "coinToss",
      coinToss,
    };
  }
  if (c === "damage") {
    const damages = effect.value.amount;
    const attackerPosition = effect.value.position;
    return {
      type: "damage",
      damages,
      attackerPosition,
    };
  }
  if (c === "decideFirstOrSecond") {
    const userId = effect.value.userId;
    return {
      type: "decideFirstOrSecond",
      firstUserId: userId,
    };
  }
  if (c === "decideWinOrLose") {
    const userId = effect.value.userId;
    return {
      type: "decideWinOrLose",
      winnerId: userId,
    };
  }
  if (c === "energyTrash") {
    const energies = effect.value.energy.map(typeConverter);
    const position = effect.value.position;
    return {
      type: "energyTrash",
      currentEnergies: energies,
      position,
    };
  }
  if (c === "evolution") {
    const card = effect.value.card;
    const position = effect.value.position;
    return {
      type: "evolution",
      card,
      position,
    };
  }
  if (c === "faint") {
    const position = effect.value.position;
    return {
      type: "faint",
      position,
    };
  }
  if (c === "getPoint") {
    const point = effect.value.point;
    return {
      type: "getPoint",
      point,
    };
  }
  if (c === "putBattleFromBench") {
    const position = effect.value.position;
    return {
      type: "putBattleFromBench",
      position,
    };
  }
  if (c === "recover") {
    const amount = effect.value.amount;
    const position = effect.value.position;
    return {
      type: "recover",
      recovererPosition: position,
      amount,
    };
  }
  if (c === "returnHand") {
    const position = effect.value.position;
    return {
      type: "returnHand",
      position,
    };
  }
  if (c === "shuffle") {
    return {
      type: "shuffle",
    };
  }
  if (c === "summon") {
    const card = effect.value.card;
    const position = effect.value.position;
    return {
      type: "summon",
      card,
      position,
    };
  }
  if (c === "surrender") {
    const userId = effect.value.userId;
    return {
      type: "surrender",
      userId,
    };
  }
  if (c === "swapBattleAndBench") {
    const benchPosition = effect.value.position;
    return {
      type: "swapBattleAndBench",
      benchPosition,
    };
  }
  if (c === "trashDeck") {
    const count = effect.value.count;
    const remain = effect.value.remain;
    return {
      type: "trashDeck",
      count,
      remain,
    };
  }
  if (c === "trashHand") {
    const count = effect.value.count;
    return {
      type: "trashHand",
      count,
    };
  }
  if (c === "useCard") {
    const card = effect.value.card;
    return {
      type: "useCard",
      card,
    };
  }
  if (c === "useSkillOrAbility") {
    const skill = effect.value.name;
    return {
      type: "useSkillOrAbility",
      skill,
    };
  }

  return {};
};

const effectWithSecretConverter = (
  effectWithSecret: EffectWithSecret["effect"]
) => {
  const c = effectWithSecret.case;
  if (c === "trashHandSecret") {
    const count = effectWithSecret.value.count;
    return {
      type: "trashHandSecret",
      count,
    };
  }
  return effectConverter(effectWithSecret);
};
const cardConverter = (card: Card): MonsterCardType | undefined => {
  if (card.masterCard?.cardVariant.case === "masterGoodsCard") {
    const goods: GoodsType = {
      id: card.id,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      name: card.masterCard.cardVariant.value.base!.name,
      cardType: "goods",
      text: card.masterCard.cardVariant.value.text,
      masterCardId:
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        card.masterCard.cardVariant.value.base!.masterCardId,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      rarity: card.masterCard.cardVariant.value.base!.rarity,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      expansion: card.masterCard.cardVariant.value.base!.expansion,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      imageUrl: card.masterCard.cardVariant.value.base!.imageUrl,
    };
    return goods;
  }
  if (card.masterCard?.cardVariant.case === "masterMonsterCard") {
    const monster: MonsterCardType = {
      id: card.id,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      name: card.masterCard.cardVariant.value.base!.name,
      cardType: "monster",
      masterCardId:
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        card.masterCard.cardVariant.value.base!.masterCardId,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      rarity: card.masterCard.cardVariant.value.base!.rarity,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      expansion: card.masterCard.cardVariant.value.base!.expansion,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      imageUrl: card.masterCard.cardVariant.value.base!.imageUrl,
      element: typeConverter(card.masterCard.cardVariant.value.element),
      hp: card.masterCard.cardVariant.value.hp,
      weakness: typeConverter(card.masterCard.cardVariant.value.weakness),
      retreatCost: card.masterCard.cardVariant.value.retreatCost,
      skills: card.masterCard.cardVariant.value.skills.map(skillConverter),
      subType: "basic",
    };
    return monster;
  }
  if (card.masterCard?.cardVariant.case === "masterSupporterCard") {
    const support: MonsterCardType = {
      id: card.id,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      name: card.masterCard.cardVariant.value.base!.name,
      text: card.masterCard.cardVariant.value.text,
      cardType: "supporter",
      masterCardId:
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        card.masterCard.cardVariant.value.base!.masterCardId,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      rarity: card.masterCard.cardVariant.value.base!.rarity,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      expansion: card.masterCard.cardVariant.value.base!.expansion,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      imageUrl: card.masterCard.cardVariant.value.base!.imageUrl,
    };
    return support;
  }
  return;
};
type Props = {
  userId: string;
  onCoinTossResult: (coinToss: boolean[]) => void;
  onBattleWin: (cause: "knockout" | "surrender") => void;
  onBattleLose: (cause: "knockout" | "surrender") => void;
  onOtherCoinToss: (coinToss: boolean[]) => void;
  onEffects: (props: { effects: EffectType[]; isSelf: boolean }) => void;
};
export const useSocketRefStore = ({
  userId,
  onCoinTossResult,
  onBattleWin,
  onBattleLose,
  onOtherCoinToss,
  onEffects,
}: Props) =>
  create<State & Action>()((set, get) => ({
    socketRef: null,
    metadata: {
      actorId: null,
    },
    eventState: {
      selfId: userId,
      otherId: null,
      currentTurnUser: null,
      selfCard: [],
      otherCardLength: 0,
      selfBattle: null,
      selfBench: [],
      otherBattle: null,
      otherBench: [],
      selfEnergy: [null, null],
      otherEnergy: [null, null],
      selfPokemonEnergy: {},
      otherPokemonEnergy: {},

      selectEnergies: [],
    },
    sendEvent: <Event extends EventEnvelope["event"]>(event: Event) => {
      const {
        socketRef,
        metadata: { actorId },
      } = get();
      if (!socketRef || !socketRef.current || !actorId) {
        return;
      }

      socketRef.current.send(
        toBinary(
          EventEnvelopeSchema,
          toProto(EventEnvelopeSchema, {
            metadata: toProto(EventMetadataSchema, {}),
            event: event,
          })
        )
      );
    },
    receiveEvent: () => {},

    draw: (payload: RequestAnalyze<typeof DrawEventToServerSchema>) => {
      const { sendEvent } = get();
      sendEvent({
        case: "drawEventToServer",
        value: toProto(DrawEventToServerSchema, {
          payload,
        }),
      });
    },
    attackMonster: (
      payload: RequestAnalyze<typeof AttackMonsterEventToServerSchema>
    ) => {
      const { sendEvent } = get();
      sendEvent({
        case: "attackMonsterEventToServer",
        value: toProto(AttackMonsterEventToServerSchema, {
          payload,
        }),
      });
    },
    ability: (payload: RequestAnalyze<typeof AbilityEventToServerSchema>) => {
      const { sendEvent } = get();
      sendEvent({
        case: "abilityEventToServer",
        value: toProto(AbilityEventToServerSchema, {
          payload,
        }),
      });
    },
    retreat: (payload: RequestAnalyze<typeof RetreatEventToServerSchema>) => {
      const { sendEvent } = get();
      sendEvent({
        case: "retreatEventToServer",
        value: toProto(RetreatEventToServerSchema, {
          payload,
        }),
      });
    },
    coinToss: (payload: RequestAnalyze<typeof CoinTossEventToServerSchema>) => {
      const { sendEvent } = get();
      sendEvent({
        case: "coinTossEventToServer",
        value: toProto(CoinTossEventToServerSchema, {
          payload,
        }),
      });
    },
    surrender: (
      payload: RequestAnalyze<typeof SurrenderEventToServerSchema>
    ) => {
      const { sendEvent } = get();
      sendEvent({
        case: "surrenderEventToServer",
        value: toProto(SurrenderEventToServerSchema, {
          payload,
        }),
      });
    },
    takeGoods: (
      payload: RequestAnalyze<typeof TakeGoodsEventToServerSchema>
    ) => {
      const { sendEvent } = get();
      sendEvent({
        case: "takeGoodsEventToServer",
        value: toProto(TakeGoodsEventToServerSchema, {
          payload,
        }),
      });
    },
    takeSupport: (
      payload: RequestAnalyze<typeof TakeSupportEventToServerSchema>
    ) => {
      const { sendEvent } = get();
      sendEvent({
        case: "takeSupportEventToServer",
        value: toProto(TakeSupportEventToServerSchema, {
          payload,
        }),
      });
    },
    supplyEnergy: (
      payload: RequestAnalyze<typeof SupplyEnergyEventToServerSchema>
    ) => {
      const { sendEvent } = get();
      sendEvent({
        case: "supplyEnergyEventToServer",
        value: toProto(SupplyEnergyEventToServerSchema, {
          payload,
        }),
      });
    },
    confirmEnergy: (
      payload: RequestAnalyze<typeof ConfirmEnergyEventToServerSchema>
    ) => {
      const { sendEvent } = get();
      sendEvent({
        case: "confirmEnergyEventToServer",
        value: toProto(ConfirmEnergyEventToServerSchema, {
          payload,
        }),
      });
    },
    confirmTarget: (
      payload: RequestAnalyze<typeof ConfirmTargetEventToServerSchema>
    ) => {
      const { sendEvent } = get();
      sendEvent({
        case: "confirmTargetEventToServer",
        value: toProto(ConfirmTargetEventToServerSchema, {
          payload,
        }),
      });
    },
    summonMonster: (
      payload: RequestAnalyze<typeof SummonMonsterEventToServerSchema>
    ) => {
      const { sendEvent } = get();
      sendEvent({
        case: "summonMonsterEventToServer",
        value: toProto(SummonMonsterEventToServerSchema, {
          payload,
        }),
      });
    },
    evolutionMonster: (
      payload: RequestAnalyze<typeof EvolutionMonsterEventToServerSchema>
    ) => {
      const { sendEvent } = get();
      sendEvent({
        case: "evolutionMonsterEventToServer",
        value: toProto(EvolutionMonsterEventToServerSchema, {
          payload,
        }),
      });
    },
    initialPlacementComplete: (
      payload: RequestAnalyze<
        typeof InitialPlacementCompleteEventToServerSchema
      >
    ) => {
      const { sendEvent } = get();
      sendEvent({
        case: "initialPlacementCompleteEventToServer",
        value: toProto(InitialPlacementCompleteEventToServerSchema, {
          payload,
        }),
      });
    },
    setSocketRef: (ref) => {
      if (!ref || !ref.current) {
        return;
      }
      ref.current.onopen = () => {
        console.log("connected");
      };

      ref.current.onmessage = (event) => {
        const res = fromBinary(EventEnvelopeSchema, new Uint8Array(event.data));
        const e = res.event;
        switch (e.case) {
          case "abilityEventToActor":
            break;
          case "drawEventToActor": {
            const cards = e.value.payload?.cards;
            if (!cards) {
              return;
            }
            const cardsWithId: MonsterCardType[] = (cards || [])
              .map((card) => {
                const cardData = cardConverter(card);
                return cardData;
              })
              .filter((card): card is MonsterCardType => card !== undefined);

            set((state) => ({
              ...state,
              eventState: {
                ...state.eventState,
                selfCard: [...state.eventState.selfCard, ...cardsWithId],
              },
            }));
            break;
          }
          case "retreatEventToActor": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const retreatPosition = e.value.payload!.position! as 1 | 2 | 3;
            set((state) => {
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              const battleCard = cardConverter(e.value.payload!.card!);
              if (!battleCard) {
                return state;
              }

              const newActorBench = [...state.eventState.selfBench];
              newActorBench[retreatPosition - 1] = state.eventState.selfBattle;
              const newActorBattle = battleCard as MonsterType;
              return {
                ...state,
                eventState: {
                  ...state.eventState,
                  selfBattle: newActorBattle,
                  selfBench: newActorBench,
                },
              };
            });
            break;
          }
          case "coinTossEventToActor": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const res = e.value.payload!.results!;
            onCoinTossResult(res);

            break;
          }
          case "surrenderEventToActor": {
            // TODO:あとでどうにかする
            onBattleLose("surrender");
            break;
          }

          case "takeGoodsEventToActor": {
            break;
          }

          case "takeSupportEventToActor": {
            break;
          }

          case "supplyEnergyEventToActor": {
            break;
          }

          case "confirmTargetEventToActor": {
            break;
          }
          case "attackMonsterEventToActor": {
            // TODO: あとでどうにかする
            break;
          }
          case "confirmActionEventToActor": {
            // TODO: あとでどうにかする
            break;
          }
          case "confirmEnergyEventToActor": {
            set((state) => ({
              ...state,
              eventState: {
                ...state.eventState,
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                selectEnergies: e.value.payload!.energies.map(typeConverter),
              },
            }));
            break;
          }
          case "summonMonsterEventToActor": {
            break;
          }
          case "evolutionMonsterEventToActor": {
            break;
          }

          case "drawEventToRecipient": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const cardCount = e.value.payload!.count!;
            set((state) => ({
              ...state,
              eventState: {
                ...state.eventState,
                otherCardLength: cardCount ?? 0,
              },
            }));
            break;
          }

          case "abilityEventToRecipient": {
            // TODO: あとでどうにかする
            break;
          }

          case "retreatEventToRecipient": {
            // TODO: あとでどうにかする
            break;
          }

          case "surrenderEventToRecipient": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const res = e.value.payload!.userId;
            if (res === get().metadata.actorId) {
              onBattleWin("surrender");
            }
            break;
          }
          case "takeGoodsEventToRecipient": {
            break;
          }

          case "takeSupportEventToRecipient": {
            break;
          }

          case "supplyEnergyEventToRecipient": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const energies = e.value.payload!.supplys.map((e) =>
              e.energies.map(typeConverter)
            );

            const battleEnergy = energies[0];
            const benchEnergies = energies.slice(1);
            set((state) => {
              const battleMonster = state.eventState.otherBattle;
              if (!battleMonster) {
                return state;
              }
              const benchMonsters = state.eventState.otherBench;
              const newBattleMonsterEnergy = [
                ...(state.eventState.otherPokemonEnergy[battleMonster.id] ??
                  []),
                ...battleEnergy,
              ];
              const newBenchMonstersEnergy = benchMonsters.map(
                (monster, index) => {
                  if (!monster) {
                    return [];
                  }
                  return [
                    ...(state.eventState.otherPokemonEnergy[monster.id] ?? []),
                    ...(benchEnergies[index] ?? []),
                  ];
                }
              );
              const assertBenchMonstersEnergy = newBenchMonstersEnergy
                .map((energy, index) => {
                  const monster = benchMonsters[index];
                  if (!monster) {
                    return null;
                  }
                  return {
                    [monster.id]: energy,
                  };
                })
                .filter((energy) => energy !== null);

              return {
                ...state,
                eventState: {
                  ...state.eventState,
                  otherPokemonEnergy: {
                    ...state.eventState.otherPokemonEnergy,
                    [battleMonster.id]: newBattleMonsterEnergy,
                    ...Object.assign({}, ...assertBenchMonstersEnergy),
                  },
                },
              };
            });
            break;
          }

          case "attackMonsterEventToRecipient": {
            // TODO: あとでどうにかする
            break;
          }

          case "drawEffectEventToRecipient": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const effects = e.value.payload!.effects.map((effect) => {
              return effectConverter(effect.effect);
            });
            onEffects({ effects, isSelf: false });

            break;
          }

          case "drawEffectEventToActor": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const effects = e.value.payload!.effects.map((effect) => {
              return effectWithSecretConverter(effect.effect);
            });
            onEffects({ effects, isSelf: true });

            break;
          }

          case "summonMonsterEventToRecipient": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const monster = cardConverter(e.value.payload!.card!);

            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const position = e.value.payload!.position! as 1 | 2 | 3;
            if (!monster) {
              return;
            }
            set((state) => {
              const newActorBench = [...state.eventState.otherBench];
              newActorBench[position - 1] = monster as MonsterType;
              return {
                ...state,
                eventState: {
                  ...state.eventState,
                  otherBench: newActorBench,
                },
              };
            });
            break;
          }
          case "coinTossResultEventToRecipient": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const res = e.value.payload!.results!;
            onOtherCoinToss(res);
            break;
          }
          case "turnEndEventToClients": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const res = e.value.payload!.userId;
            const selfUserId = get().eventState.selfId;
            set((state) => ({
              ...state,
              eventState: {
                ...state.eventState,
                currentTurnUser: res === selfUserId ? "other" : "self",
              },
            }));
            break;
          }
          case "startGameEventToClients": {
            // TODO: ゲーム開始
            break;
          }
          case "decideOrderEventToActor": {
            const starter = e.value.payload?.firstUserId;
            const selfUserId = get().eventState.selfId;
            set((state) => ({
              ...state,
              eventState: {
                ...state.eventState,
                currentTurnUser: starter === selfUserId ? "self" : "other",
              },
            }));
            break;
          }
          case "matchingCompleteEventToActor": {
            // TODO:あとでなおす
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const otherUserId = e.value.payload!.users as unknown as string;

            set((state) => ({
              ...state,
              eventState: {
                ...state.eventState,
                otherId: otherUserId,
              },
            }));

            break;
          }
          case "turnStartEventToClients": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const res = e.value.payload!.userId;
            const selfUserId = get().eventState.selfId;
            set((state) => ({
              ...state,
              eventState: {
                ...state.eventState,
                currentTurnUser: res === selfUserId ? "self" : "other",
              },
            }));
            break;
          }

          case "evolutionMonsterEventToRecipient": {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const evolveCard = cardConverter(e.value.payload!.card!);
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const position = e.value.payload!.position! as 0 | 1 | 2 | 3;
            if (!evolveCard) {
              return;
            }
            set((state) => {
              if (position === 0) {
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    otherBattle: evolveCard as MonsterType,
                  },
                };
              }
              const newActorBench = [...state.eventState.otherBench];
              newActorBench[position - 1] = evolveCard as MonsterType;
              return {
                ...state,
                eventState: {
                  ...state.eventState,
                  otherBench: newActorBench,
                },
              };
            });
            break;
          }
        }
      };
    },
  }))();
