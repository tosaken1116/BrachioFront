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
  onCoinTossResult: (coinToss: boolean[]) => void;
  onBattleWin: (cause: "knockout" | "surrender") => void;
  onBattleLose: (cause: "knockout" | "surrender") => void;
  onOtherCoinToss: (coinToss: boolean[]) => void;
};
export const useSocketRefStore = ({
  onCoinTossResult,
  onBattleWin,
  onBattleLose,
  onOtherCoinToss,
}: Props) =>
  create<State & Action>()((set, get) => ({
    socketRef: null,
    metadata: {
      actorId: null,
    },
    eventState: {
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
            const card = cardConverter(e.value.payload!.card!);
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            const energies = e.value.payload!.energies.map(typeConverter);

            if (!card) {
              return;
            }
            set((state) => {
              return {
                ...state,
                eventState: {
                  ...state.eventState,
                  otherPokemonEnergy: {
                    ...state.eventState.otherPokemonEnergy,
                    [card.id]: [
                      ...(state.eventState.otherPokemonEnergy[card.id] ?? []),
                      ...energies,
                    ],
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
  }));
