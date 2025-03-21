import type {
  AttackType,
  EnergyType,
  GoodsType,
  MonsterCardType,
  MonsterType,
} from "@/domains/card/types";
import type { Card } from "@/generated/messages/card_pb";
import { Element } from "@/generated/messages/common_pb";
import type { Effect } from "@/generated/messages/effect_pb";
import type { Skill } from "@/generated/messages/skill_pb";
import { EnterRoomEventToServerSchema } from "@/generated/websocket/event/gm_pb";
import {
  AbilityEventToServerSchema,
  AttackMonsterEventToServerSchema,
  CoinTossEventToServerSchema,
  ConfirmEnergyEventToServerSchema,
  ConfirmTargetEventToServerSchema,
  DrawEventToServerSchema,
  EvolutionMonsterEventToServerSchema,
  InitialPlacementCompleteEventToServerSchema,
  InitialSummonEventToServerSchema,
  RetreatEventToServerSchema,
  SelectBattlePositionEventToServerSchema,
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
import { create } from "zustand";
import { getUserInfo } from "../auth";

type EventState = {
  selfCard: MonsterCardType[];
  otherCardLength: number;

  selfBattle: MonsterType | null;
  selfBench: (MonsterType | null)[];

  otherBattle: MonsterType | null;
  otherBench: (MonsterType | null)[];

  selfPokemonEnergy: Record<number, EnergyType[]>;
  otherPokemonEnergy: Record<number, EnergyType[]>;

  selfEnergy: [EnergyType | null, EnergyType | null];
  otherEnergy: [EnergyType | null, EnergyType | null];

  selectEnergies: EnergyType[];

  selfId: string | null;
  otherId: string | null;
  currentTurnUser: "self" | "other" | null;

  coinToss: {
    player: "self" | "other" | null;
    result: boolean[];
  };

  firstPlayerId: string | null;

  winnerId: string | null;

  selfPoint: number;
  otherPoint: number;

  isShuffle: "self" | "other" | null;

  selfDeckLength: number;
  otherDeckLength: number;

  currentUsedCard: MonsterCardType | null;
  currentUsedSkill: string | null;
};

type Metadata = {
  actorId: string | null;
};

type State = {
  socketRef: MutableRefObject<WebSocket | undefined> | null;
  eventState: EventState;
  metadata: Metadata;
};

type Action = {
  setSocketRef: (
    socketRef: MutableRefObject<WebSocket | undefined> | null
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
  enterRoom: (
    payload: RequestAnalyze<typeof EnterRoomEventToServerSchema>
  ) => void;
  selectBattleCard: (
    payload: RequestAnalyze<typeof SelectBattlePositionEventToServerSchema>
  ) => void;
  initialSummon: (
    payload: RequestAnalyze<typeof InitialSummonEventToServerSchema>
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
    } as const;
  }
  if (c === "coinToss") {
    const coinToss = effect.value.result;
    return {
      type: "coinToss",
      coinToss,
    } as const;
  }
  if (c === "damage") {
    const damages = effect.value.amount;
    const attackerPosition = effect.value.position;
    return {
      type: "damage",
      damages,
      attackerPosition,
    } as const;
  }
  if (c === "decideFirstOrSecond") {
    const userId = effect.value.userId;
    return {
      type: "decideFirstOrSecond",
      firstUserId: userId,
    } as const;
  }
  if (c === "decideWinOrLose") {
    const userId = effect.value.userId;
    return {
      type: "decideWinOrLose",
      winnerId: userId,
    } as const;
  }
  if (c === "energyTrash") {
    const energies = effect.value.energy.map(typeConverter);
    const position = effect.value.position;
    return {
      type: "energyTrash",
      currentEnergies: energies,
      position,
    } as const;
  }
  if (c === "evolution") {
    const card = effect.value.card;
    const position = effect.value.position;
    return {
      type: "evolution",
      card,
      position,
    } as const;
  }
  if (c === "faint") {
    const position = effect.value.position;
    return {
      type: "faint",
      position,
    } as const;
  }
  if (c === "getPoint") {
    const point = effect.value.point;
    return {
      type: "getPoint",
      point,
    } as const;
  }
  if (c === "putBattleFromBench") {
    const position = effect.value.position;
    return {
      type: "putBattleFromBench",
      position,
    } as const;
  }
  if (c === "recover") {
    const amount = effect.value.amount;
    const position = effect.value.position;
    return {
      type: "recover",
      recovererPosition: position,
      amount,
    } as const;
  }
  if (c === "returnHand") {
    const position = effect.value.position;
    return {
      type: "returnHand",
      position,
    } as const;
  }
  if (c === "shuffle") {
    return {
      type: "shuffle",
    } as const;
  }
  if (c === "summon") {
    const card = effect.value.card;
    const position = effect.value.position;
    return {
      type: "summon",
      card,
      position,
    } as const;
  }
  if (c === "surrender") {
    const userId = effect.value.userId;
    return {
      type: "surrender",
      userId,
    } as const;
  }
  if (c === "swapBattleAndBench") {
    const benchPosition = effect.value.position;
    return {
      type: "swapBattleAndBench",
      benchPosition,
    } as const;
  }
  if (c === "trashDeck") {
    const count = effect.value.count;
    const remain = effect.value.remain;
    return {
      type: "trashDeck",
      count,
      remain,
    } as const;
  }
  if (c === "trashHand") {
    const count = effect.value.count;
    return {
      type: "trashHand",
      count,
    } as const;
  }
  if (c === "useCard") {
    const card = effect.value.card;
    return {
      type: "useCard",
      card,
    } as const;
  }
  if (c === "useSkillOrAbility") {
    const skill = effect.value.name;
    return {
      type: "useSkillOrAbility",
      skill,
    } as const;
  }

  return {
    type: "unknown",
    effect,
  } as const;
};

const cardConverter = (card: Card): MonsterCardType | undefined => {
  console.log(card.id);
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
      isEx: card.masterCard.cardVariant.value.isEx,
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

export const useSocketRefStore = create<State & Action>()((set, get) => ({
  socketRef: null,
  metadata: {
    actorId: null,
  },
  eventState: {
    firstPlayerId: null,
    selfId: null,
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
    coinToss: {
      player: null,
      result: [],
    },
    winnerId: null,
    selfPoint: 0,
    otherPoint: 0,
    isShuffle: null,
    otherDeckLength: 20,
    selfDeckLength: 20,
    currentUsedCard: null,
    currentUsedSkill: null,
  },
  sendEvent: <Event extends EventEnvelope["event"]>(event: Event) => {
    const {
      socketRef,
      metadata: { actorId },
    } = get();
    if (!socketRef || !socketRef.current || !actorId) {
      console.log(actorId);
      console.log(socketRef);
      console.log(socketRef?.current);
      console.log("return");
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

  draw: (payload: RequestAnalyze<typeof DrawEventToServerSchema>) => {
    const { sendEvent } = get();
    sendEvent({
      case: "drawEventToServer",
      value: toProto(DrawEventToServerSchema, {
        payload,
      }),
    });
  },
  enterRoom: (payload: RequestAnalyze<typeof EnterRoomEventToServerSchema>) => {
    const { sendEvent } = get();
    console.log(payload);
    sendEvent({
      case: "enterRoomEventToServer",
      value: toProto(EnterRoomEventToServerSchema, {
        payload,
      }),
    });
  },
  initialSummon: (
    payload: RequestAnalyze<typeof InitialSummonEventToServerSchema>
  ) => {
    const { sendEvent } = get();
    sendEvent({
      case: "initialSummonEventToServer",
      value: toProto(InitialSummonEventToServerSchema, {
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
  surrender: (payload: RequestAnalyze<typeof SurrenderEventToServerSchema>) => {
    const { sendEvent } = get();
    sendEvent({
      case: "surrenderEventToServer",
      value: toProto(SurrenderEventToServerSchema, {
        payload,
      }),
    });
  },
  takeGoods: (payload: RequestAnalyze<typeof TakeGoodsEventToServerSchema>) => {
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
    set((state) => {
      if (payload.position === 0) {
        return {
          ...state,
          eventState: {
            ...state.eventState,
            selfBattle: cardConverter(payload.card as Card) as MonsterType,
            selfCard: state.eventState.selfCard.filter(
              (card) => card.id !== payload.card.id
            ),
          },
        };
      }
      return {
        ...state,
        eventState: {
          ...state.eventState,
          selfBench: state.eventState.selfBench.map((card, index) => {
            if (index === payload.position - 1) {
              return cardConverter(payload.card as Card) as MonsterType;
            }
            return card;
          }),
          selfCard: state.eventState.selfCard.filter(
            (card) => card.id !== payload.card.id
          ),
        },
      };
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
    payload: RequestAnalyze<typeof InitialPlacementCompleteEventToServerSchema>
  ) => {
    const { sendEvent } = get();
    sendEvent({
      case: "initialPlacementCompleteEventToServer",
      value: toProto(InitialPlacementCompleteEventToServerSchema, {
        payload,
      }),
    });
  },
  selectBattleCard: (
    payload: RequestAnalyze<typeof SelectBattlePositionEventToServerSchema>
  ) => {
    const { sendEvent } = get();
    sendEvent({
      case: "selectBattlePositionEventToServer",
      value: toProto(SelectBattlePositionEventToServerSchema, {
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
      console.log(JSON.stringify(res, null, 2));
      const e = res.event;
      switch (e.case) {
        case "abilityEventToActor":
          break;
        case "drawEventToActor": {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          const cards = e.value.payload!.cards;
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          const remain = e.value.payload!.remain;
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          const count = e.value.payload!.count;
          if (!cards) {
            return;
          }
          const currentCard = get().eventState.selfCard;
          const cardsWithIdObject: Record<string, MonsterCardType> = [
            ...(cards || []).map((card) => {
              const cardData = cardConverter(card);
              return cardData;
            }),
            ...currentCard,
          ]
            .filter((card): card is MonsterCardType => card !== undefined)
            .reduce(
              (acc, val) => {
                if (acc[val.id] === undefined) {
                  acc[val.id] = val;
                }
                return acc;
              },
              {} as Record<string, MonsterCardType>
            );
          const cardsWithId = Object.entries(cardsWithIdObject).map(
            ([_, val]) => val
          );
          console.log(cardsWithId);

          set((state) => ({
            ...state,
            eventState: {
              ...state.eventState,
              selfDeckLength: remain,
              otherDeckLength: remain,
              otherCardLength: count,
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
          e.value.payload!.results!;
          // onCoinTossResult(res);

          break;
        }
        case "surrenderEventToActor": {
          // TODO:あとでどうにかする
          // onBattleLose("surrender");
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
            // onBattleWin("surrender");
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
              ...(state.eventState.otherPokemonEnergy[0] ?? []),
              ...battleEnergy,
            ];
            const newBenchMonstersEnergy = benchMonsters.map(
              (monster, index) => {
                if (!monster) {
                  return [];
                }
                return [
                  ...(state.eventState.otherPokemonEnergy[index + 1] ?? []),
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
          for (const { effect } of e.value.payload!.effects) {
            const c = effect.case;
            if (c === "attachEnergy") {
              const energies = effect.value.energies.map(typeConverter);
              const pos = effect.value.position;
              return set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  otherPokemonEnergy: {
                    ...state.eventState.otherPokemonEnergy,
                    [pos]: [
                      ...(state.eventState.otherPokemonEnergy[pos] ?? []),
                      ...energies,
                    ],
                  },
                },
              }));
            }
            if (c === "coinToss") {
              const coinToss = effect.value.result;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  coinToss: {
                    player: "other",
                    result: coinToss,
                  },
                },
              }));
            }
            if (c === "damage") {
              const damages = effect.value.amount;
              const attackerPosition = effect.value.position;
              set((state) => {
                if (attackerPosition === 0) {
                  return {
                    ...state,
                    eventState: {
                      ...state.eventState,
                      otherBattle:
                        state.eventState.otherBattle === null
                          ? null
                          : {
                              ...state.eventState.otherBattle,
                              hp: state.eventState.otherBattle.hp - damages[0],
                            },
                    },
                  };
                }
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    otherBench: state.eventState.otherBench.map(
                      (monster, i) => {
                        if (monster === null) {
                          return null;
                        }
                        return {
                          ...monster,
                          hp: monster.hp - damages[i],
                        };
                      }
                    ),
                  },
                };
              });
            }
            if (c === "decideFirstOrSecond") {
              const userId = effect.value.userId;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  firstPlayerId: userId,
                  currentTurnUser:
                    userId === state.eventState.selfId ? "self" : "other",
                },
              }));
            }
            if (c === "decideWinOrLose") {
              const userId = effect.value.userId;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  winnerId: userId,
                },
              }));
            }
            if (c === "energyTrash") {
              const energies = effect.value.energy.map(typeConverter);
              const position = effect.value.position;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  otherPokemonEnergy: {
                    ...state.eventState.otherPokemonEnergy,
                    [position]: energies,
                  },
                },
              }));
            }
            if (c === "evolution") {
              const card = effect.value.card;
              const position = effect.value.position;
              set((state) => {
                if (position === 0) {
                  return {
                    ...state,
                    eventState: {
                      ...state.eventState,
                      // biome-ignore lint/style/noNonNullAssertion: <explanation>
                      otherBattle: cardConverter(card!)! as MonsterType,
                    },
                  };
                }
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    otherBench: state.eventState.otherBench.map(
                      (monster, i) => {
                        if (i === position - 1) {
                          // biome-ignore lint/style/noNonNullAssertion: <explanation>
                          return cardConverter(card!)! as MonsterType;
                        }
                        return monster;
                      }
                    ),
                  },
                };
              });
            }
            if (c === "faint") {
              const position = effect.value.position;
              set((state) => {
                if (position === 0) {
                  return {
                    ...state,
                    eventState: {
                      ...state.eventState,
                      otherBattle: null,
                    },
                  };
                }
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    otherBench: state.eventState.otherBench.map(
                      (monster, i) => {
                        if (i === position - 1) {
                          return null;
                        }
                        return monster;
                      }
                    ),
                  },
                };
              });
            }
            if (c === "getPoint") {
              const point = effect.value.point;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  otherPoint: state.eventState.otherPoint + point,
                },
              }));
            }
            if (c === "putBattleFromBench") {
              const position = effect.value.position;
              set((state) => {
                const newActorBench = [...state.eventState.otherBench];
                const newActorBattle = newActorBench[position - 1];
                newActorBench[position - 1] = null;
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    otherBattle: newActorBattle,
                    otherBench: newActorBench,
                  },
                };
              });
            }
            if (c === "recover") {
              const amount = effect.value.amount;
              const position = effect.value.position;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  otherBench: state.eventState.otherBench.map((monster, i) => {
                    if (monster === null) {
                      return null;
                    }
                    if (i === position - 1) {
                      return {
                        ...monster,
                        hp: monster.hp + amount[i],
                      };
                    }
                    return monster;
                  }),
                  otherBattle:
                    state.eventState.otherBattle === null
                      ? null
                      : {
                          ...state.eventState.otherBattle,
                          hp: state.eventState.otherBattle.hp + amount[0],
                        },
                },
              }));
            }
            if (c === "returnHand") {
              const position = effect.value.position;
              set((state) => {
                if (position === 0) {
                  return {
                    ...state,
                    eventState: {
                      ...state.eventState,
                      otherBattle: null,
                    },
                  };
                }
                const newActorBench = [...state.eventState.otherBench];
                newActorBench[position - 1] = null;
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    otherBench: newActorBench,
                  },
                };
              });
            }
            if (c === "shuffle") {
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  isShuffle: "other",
                },
              }));
            }
            if (c === "summon") {
              const card = effect.value.card;
              const position = effect.value.position;
              set((state) => {
                if (position === 0) {
                  return {
                    ...state,
                    eventState: {
                      ...state.eventState,
                      // biome-ignore lint/style/noNonNullAssertion: <explanation>
                      otherBattle: cardConverter(card!)! as MonsterType,
                    },
                  };
                }
                const newActorBench = [...state.eventState.otherBench];
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                newActorBench[position - 1] = cardConverter(
                  // biome-ignore lint/style/noNonNullAssertion: <explanation>
                  card!
                )! as MonsterType;
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    otherBench: newActorBench,
                  },
                };
              });
            }
            if (c === "surrender") {
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  winnerId: state.eventState.selfId,
                },
              }));
            }
            if (c === "swapBattleAndBench") {
              const benchPosition = effect.value.position;
              set((state) => {
                const newActorBench = [...state.eventState.otherBench];
                const newActorBattle = newActorBench[benchPosition - 1];
                newActorBench[benchPosition - 1] = state.eventState.otherBattle;
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    otherBattle: newActorBattle,
                    otherBench: newActorBench,
                  },
                };
              });
            }
            if (c === "trashDeck") {
              // const count = effect.value.count;
              const remain = effect.value.remain;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  otherDeckLength: remain,
                },
              }));
            }
            if (c === "trashHand") {
              const count = effect.value.count;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  otherCardLength: state.eventState.otherCardLength - count,
                },
              }));
            }
            if (c === "useCard") {
              const card = effect.value.card;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  // biome-ignore lint/style/noNonNullAssertion: <explanation>
                  currentUsedCard: cardConverter(card!)!,
                },
              }));
            }
            if (c === "useSkillOrAbility") {
              const skill = effect.value.name;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  currentUsedSkill: skill,
                },
              }));
            }
          }

          break;
        }

        case "drawEffectEventToActor": {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          for (const { effect } of e.value.payload!.effects) {
            const c = effect.case;
            if (c === "attachEnergy") {
              const energies = effect.value.energies.map(typeConverter);
              const pos = effect.value.position;
              return set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  selfPokemonEnergy: {
                    ...state.eventState.selfPokemonEnergy,
                    [pos]: [
                      ...(state.eventState.selfPokemonEnergy[pos] ?? []),
                      ...energies,
                    ],
                  },
                },
              }));
            }
            if (c === "coinToss") {
              const coinToss = effect.value.result;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  coinToss: {
                    player: "self",
                    result: coinToss,
                  },
                },
              }));
            }
            if (c === "damage") {
              const damages = effect.value.amount;
              const attackerPosition = effect.value.position;
              set((state) => {
                if (attackerPosition === 0) {
                  return {
                    ...state,
                    eventState: {
                      ...state.eventState,
                      selfBattle:
                        state.eventState.selfBattle === null
                          ? null
                          : {
                              ...state.eventState.selfBattle,
                              hp: state.eventState.selfBattle.hp - damages[0],
                            },
                    },
                  };
                }
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    selfBench: state.eventState.selfBench.map((monster, i) => {
                      if (monster === null) {
                        return null;
                      }
                      return {
                        ...monster,
                        hp: monster.hp - damages[i],
                      };
                    }),
                  },
                };
              });
            }
            if (c === "decideFirstOrSecond") {
              const userId = effect.value.userId;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  firstPlayerId: userId,
                  currentTurnUser:
                    userId === state.eventState.selfId ? "self" : "other",
                },
              }));
            }
            if (c === "decideWinOrLose") {
              const userId = effect.value.userId;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  winnerId: userId,
                },
              }));
            }
            if (c === "energyTrash") {
              const energies = effect.value.energy.map(typeConverter);
              const position = effect.value.position;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  selfPokemonEnergy: {
                    ...state.eventState.selfPokemonEnergy,
                    [position]: energies,
                  },
                },
              }));
            }
            if (c === "evolution") {
              const card = effect.value.card;
              const position = effect.value.position;
              set((state) => {
                if (position === 0) {
                  return {
                    ...state,
                    eventState: {
                      ...state.eventState,
                      // biome-ignore lint/style/noNonNullAssertion: <explanation>
                      selfBattle: cardConverter(card!)! as MonsterType,
                    },
                  };
                }
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    selfBench: state.eventState.selfBench.map((monster, i) => {
                      if (i === position - 1) {
                        // biome-ignore lint/style/noNonNullAssertion: <explanation>
                        return cardConverter(card!)! as MonsterType;
                      }
                      return monster;
                    }),
                  },
                };
              });
            }
            if (c === "faint") {
              const position = effect.value.position;
              set((state) => {
                if (position === 0) {
                  return {
                    ...state,
                    eventState: {
                      ...state.eventState,
                      selfBattle: null,
                    },
                  };
                }
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    selfBench: state.eventState.selfBench.map((monster, i) => {
                      if (i === position - 1) {
                        return null;
                      }
                      return monster;
                    }),
                  },
                };
              });
            }
            if (c === "getPoint") {
              const point = effect.value.point;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  otherPoint: state.eventState.otherPoint + point,
                },
              }));
            }
            if (c === "putBattleFromBench") {
              const position = effect.value.position;
              set((state) => {
                const newActorBench = [...state.eventState.selfBench];
                const newActorBattle = newActorBench[position - 1];
                newActorBench[position - 1] = null;
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    selfBattle: newActorBattle,
                    selfBench: newActorBench,
                  },
                };
              });
            }
            if (c === "recover") {
              const amount = effect.value.amount;
              const position = effect.value.position;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  selfBench: state.eventState.selfBench.map((monster, i) => {
                    if (monster === null) {
                      return null;
                    }
                    if (i === position - 1) {
                      return {
                        ...monster,
                        hp: monster.hp + amount[i],
                      };
                    }
                    return monster;
                  }),
                  selfBattle:
                    state.eventState.selfBattle === null
                      ? null
                      : {
                          ...state.eventState.selfBattle,
                          hp: state.eventState.selfBattle.hp + amount[0],
                        },
                },
              }));
            }
            if (c === "returnHand") {
              const position = effect.value.position;
              set((state) => {
                if (position === 0) {
                  return {
                    ...state,
                    eventState: {
                      ...state.eventState,
                      selfBattle: null,
                    },
                  };
                }
                const newActorBench = [...state.eventState.selfBench];
                newActorBench[position - 1] = null;
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    selfBench: newActorBench,
                  },
                };
              });
            }
            if (c === "shuffle") {
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  isShuffle: "self",
                },
              }));
            }
            if (c === "summon") {
              const card = effect.value.card;
              const position = effect.value.position;
              set((state) => {
                if (position === 0) {
                  return {
                    ...state,
                    eventState: {
                      ...state.eventState,
                      // biome-ignore lint/style/noNonNullAssertion: <explanation>
                      selfBattle: cardConverter(card!)! as MonsterType,
                    },
                  };
                }
                const newActorBench = [...state.eventState.selfBench];
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                newActorBench[position - 1] = cardConverter(
                  // biome-ignore lint/style/noNonNullAssertion: <explanation>
                  card!
                )! as MonsterType;
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    selfBench: newActorBench,
                  },
                };
              });
            }
            if (c === "surrender") {
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  winnerId: state.eventState.otherId,
                },
              }));
            }
            if (c === "swapBattleAndBench") {
              const benchPosition = effect.value.position;
              set((state) => {
                const newActorBench = [...state.eventState.selfBench];
                const newActorBattle = newActorBench[benchPosition - 1];
                newActorBench[benchPosition - 1] = state.eventState.selfBattle;
                return {
                  ...state,
                  eventState: {
                    ...state.eventState,
                    selfBattle: newActorBattle,
                    selfBench: newActorBench,
                  },
                };
              });
            }
            if (c === "trashDeck") {
              // const count = effect.value.count;
              const remain = effect.value.remain;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  selfDeckLength: remain,
                },
              }));
            }
            if (c === "trashHandSecret") {
              // biome-ignore lint/style/noNonNullAssertion: <explanation>
              const card = effect.value.card!;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  selfCard: state.eventState.selfCard.filter(
                    (c) => c.id !== card.id
                  ),
                },
              }));
            }
            if (c === "useCard") {
              const card = effect.value.card;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  // biome-ignore lint/style/noNonNullAssertion: <explanation>
                  currentUsedCard: cardConverter(card!)!,
                },
              }));
            }
            if (c === "useSkillOrAbility") {
              const skill = effect.value.name;
              set((state) => ({
                ...state,
                eventState: {
                  ...state.eventState,
                  currentUsedSkill: skill,
                },
              }));
            }
          }

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
          e.value.payload!.results!;
          // onOtherCoinToss(res);
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
          break;
        }
        case "nextEnergyEventToActor": {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          const energy = typeConverter(e.value.payload!.energy);
          set((state) => ({
            ...state,
            eventState: {
              ...state.eventState,
              selfEnergy: [state.eventState.selfEnergy[1], energy],
            },
          }));
          break;
        }
        case "decideOrderEventToActor": {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          const starter = e.value.payload!.firstUserId!;
          const selfUserId = get().eventState.selfId;
          set((state) => ({
            ...state,
            eventState: {
              ...state.eventState,
              firstPlayerId: starter,
              currentTurnUser: starter === selfUserId ? "self" : "other",
            },
          }));
          break;
        }
        case "matchingCompleteEventToActor": {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          const otherUserId = e.value.payload!.opponentId;

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
    ref.current.onclose = () => {
      console.log("disconnected");
    };
    const actorId = getUserInfo()?.profile.sub ?? "";
    return set((state) => ({
      ...state,
      socketRef: ref,

      metadata: {
        ...state.metadata,
        actorId: actorId,
      },
      eventState: {
        ...state.eventState,
        selfId: actorId,
      },
    }));
  },
}));
