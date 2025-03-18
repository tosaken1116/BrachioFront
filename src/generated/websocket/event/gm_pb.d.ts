// @generated by protoc-gen-es v2.0.0
// @generated from file websocket/event/gm.proto (package websocket.event.gm, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";
import type { CreateRoomEventPayload, DecideOrderEventPayload, EnterRoomEventPayload, ExchangeDeckEventPayload, MatchingCompleteEventPayload } from "../payload/gm_pb";

/**
 * Describes the file websocket/event/gm.proto.
 */
export declare const file_websocket_event_gm: GenFile;

/**
 * //
 * デッキデータ交換イベント(c→sは必要だが、c同士は必要ないかも)
 * //
 *
 * @generated from message websocket.event.gm.ExchangeDeckEventToServer
 */
export declare type ExchangeDeckEventToServer = Message<"websocket.event.gm.ExchangeDeckEventToServer"> & {
  /**
   * @generated from field: websocket.payload.gm.ExchangeDeckEventPayload payload = 1;
   */
  payload?: ExchangeDeckEventPayload;
};

/**
 * Describes the message websocket.event.gm.ExchangeDeckEventToServer.
 * Use `create(ExchangeDeckEventToServerSchema)` to create a new message.
 */
export declare const ExchangeDeckEventToServerSchema: GenMessage<ExchangeDeckEventToServer>;

/**
 * @generated from message websocket.event.gm.ExchangeDeckEventToActor
 */
export declare type ExchangeDeckEventToActor = Message<"websocket.event.gm.ExchangeDeckEventToActor"> & {
  /**
   * @generated from field: websocket.payload.gm.ExchangeDeckEventPayload payload = 1;
   */
  payload?: ExchangeDeckEventPayload;

  /**
   * 交換するユーザーのID
   *
   * @generated from field: string userId = 2;
   */
  userId: string;
};

/**
 * Describes the message websocket.event.gm.ExchangeDeckEventToActor.
 * Use `create(ExchangeDeckEventToActorSchema)` to create a new message.
 */
export declare const ExchangeDeckEventToActorSchema: GenMessage<ExchangeDeckEventToActor>;

/**
 * @generated from message websocket.event.gm.ExchangeDeckEventToRecipient
 */
export declare type ExchangeDeckEventToRecipient = Message<"websocket.event.gm.ExchangeDeckEventToRecipient"> & {
  /**
   * @generated from field: websocket.payload.gm.ExchangeDeckEventPayload payload = 1;
   */
  payload?: ExchangeDeckEventPayload;

  /**
   * 交換するユーザーのID
   *
   * @generated from field: string userId = 2;
   */
  userId: string;
};

/**
 * Describes the message websocket.event.gm.ExchangeDeckEventToRecipient.
 * Use `create(ExchangeDeckEventToRecipientSchema)` to create a new message.
 */
export declare const ExchangeDeckEventToRecipientSchema: GenMessage<ExchangeDeckEventToRecipient>;

/**
 * //
 * ルーム作成イベント
 * //
 *
 * @generated from message websocket.event.gm.CreateRoomEventToServer
 */
export declare type CreateRoomEventToServer = Message<"websocket.event.gm.CreateRoomEventToServer"> & {
  /**
   * @generated from field: websocket.payload.gm.CreateRoomEventPayload payload = 1;
   */
  payload?: CreateRoomEventPayload;
};

/**
 * Describes the message websocket.event.gm.CreateRoomEventToServer.
 * Use `create(CreateRoomEventToServerSchema)` to create a new message.
 */
export declare const CreateRoomEventToServerSchema: GenMessage<CreateRoomEventToServer>;

/**
 * //
 * ルーム入室イベント
 * //
 *
 * @generated from message websocket.event.gm.EnterRoomEventToServer
 */
export declare type EnterRoomEventToServer = Message<"websocket.event.gm.EnterRoomEventToServer"> & {
  /**
   * @generated from field: websocket.payload.gm.EnterRoomEventPayload payload = 1;
   */
  payload?: EnterRoomEventPayload;
};

/**
 * Describes the message websocket.event.gm.EnterRoomEventToServer.
 * Use `create(EnterRoomEventToServerSchema)` to create a new message.
 */
export declare const EnterRoomEventToServerSchema: GenMessage<EnterRoomEventToServer>;

/**
 * //
 * マッチング完了イベント
 * //
 *
 * @generated from message websocket.event.gm.MatchingCompleteEventToActor
 */
export declare type MatchingCompleteEventToActor = Message<"websocket.event.gm.MatchingCompleteEventToActor"> & {
  /**
   * @generated from field: websocket.payload.gm.MatchingCompleteEventPayload payload = 1;
   */
  payload?: MatchingCompleteEventPayload;
};

/**
 * Describes the message websocket.event.gm.MatchingCompleteEventToActor.
 * Use `create(MatchingCompleteEventToActorSchema)` to create a new message.
 */
export declare const MatchingCompleteEventToActorSchema: GenMessage<MatchingCompleteEventToActor>;

/**
 * @generated from message websocket.event.gm.MatchingCompleteEventToRecipient
 */
export declare type MatchingCompleteEventToRecipient = Message<"websocket.event.gm.MatchingCompleteEventToRecipient"> & {
  /**
   * @generated from field: websocket.payload.gm.MatchingCompleteEventPayload payload = 1;
   */
  payload?: MatchingCompleteEventPayload;
};

/**
 * Describes the message websocket.event.gm.MatchingCompleteEventToRecipient.
 * Use `create(MatchingCompleteEventToRecipientSchema)` to create a new message.
 */
export declare const MatchingCompleteEventToRecipientSchema: GenMessage<MatchingCompleteEventToRecipient>;

/**
 * //
 * 先攻後攻決定イベント
 * //
 *
 * @generated from message websocket.event.gm.DecideOrderEventToActor
 */
export declare type DecideOrderEventToActor = Message<"websocket.event.gm.DecideOrderEventToActor"> & {
  /**
   * @generated from field: websocket.payload.gm.DecideOrderEventPayload payload = 1;
   */
  payload?: DecideOrderEventPayload;
};

/**
 * Describes the message websocket.event.gm.DecideOrderEventToActor.
 * Use `create(DecideOrderEventToActorSchema)` to create a new message.
 */
export declare const DecideOrderEventToActorSchema: GenMessage<DecideOrderEventToActor>;

/**
 * @generated from message websocket.event.gm.DecideOrderEventToRecipient
 */
export declare type DecideOrderEventToRecipient = Message<"websocket.event.gm.DecideOrderEventToRecipient"> & {
  /**
   * @generated from field: websocket.payload.gm.DecideOrderEventPayload payload = 1;
   */
  payload?: DecideOrderEventPayload;
};

/**
 * Describes the message websocket.event.gm.DecideOrderEventToRecipient.
 * Use `create(DecideOrderEventToRecipientSchema)` to create a new message.
 */
export declare const DecideOrderEventToRecipientSchema: GenMessage<DecideOrderEventToRecipient>;

