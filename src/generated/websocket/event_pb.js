// @generated by protoc-gen-es v2.0.0
// @generated from file websocket/event.proto (package event, syntax proto3)
/* eslint-disable */

import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import { file_google_protobuf_timestamp } from "@bufbuild/protobuf/wkt";
import { file_websocket_event_playing } from "./event/playing_pb";

/**
 * Describes the file websocket/event.proto.
 */
export const file_websocket_event = /*@__PURE__*/
  fileDesc("ChV3ZWJzb2NrZXQvZXZlbnQucHJvdG8SBWV2ZW50InEKDUV2ZW50TWV0YWRhdGESCgoCaWQYASABKAkSEQoJc2VuZGVyX2lkGAIgASgJEhEKCWJhdHRsZV9pZBgDIAEoCRIuCgpjcmVhdGVkX2F0GAQgASgLMhouZ29vZ2xlLnByb3RvYnVmLlRpbWVzdGFtcCKyHgoNRXZlbnRFbnZlbG9wZRImCghtZXRhZGF0YRgBIAEoCzIULmV2ZW50LkV2ZW50TWV0YWRhdGESXQoeYXR0YWNrX21vbnN0ZXJfZXZlbnRfdG9fc2VydmVyGAIgASgLMjMud2Vic29ja2V0LmV2ZW50LnBsYXlpbmcuQXR0YWNrTW9uc3RlckV2ZW50VG9TZXJ2ZXJIABJbCh1hdHRhY2tfbW9uc3Rlcl9ldmVudF90b19hY3RvchgDIAEoCzIyLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLkF0dGFja01vbnN0ZXJFdmVudFRvQWN0b3JIABJjCiFhdHRhY2tfbW9uc3Rlcl9ldmVudF90b19yZWNpcGllbnQYBCABKAsyNi53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5BdHRhY2tNb25zdGVyRXZlbnRUb1JlY2lwaWVudEgAEl0KHnN1bW1vbl9tb25zdGVyX2V2ZW50X3RvX3NlcnZlchgFIAEoCzIzLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlN1bW1vbk1vbnN0ZXJFdmVudFRvU2VydmVySAASWwodc3VtbW9uX21vbnN0ZXJfZXZlbnRfdG9fYWN0b3IYBiABKAsyMi53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5TdW1tb25Nb25zdGVyRXZlbnRUb0FjdG9ySAASYwohc3VtbW9uX21vbnN0ZXJfZXZlbnRfdG9fcmVjaXBpZW50GAcgASgLMjYud2Vic29ja2V0LmV2ZW50LnBsYXlpbmcuU3VtbW9uTW9uc3RlckV2ZW50VG9SZWNpcGllbnRIABJjCiFldm9sdXRpb25fbW9uc3Rlcl9ldmVudF90b19zZXJ2ZXIYCCABKAsyNi53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5Fdm9sdXRpb25Nb25zdGVyRXZlbnRUb1NlcnZlckgAEmEKIGV2b2x1dGlvbl9tb25zdGVyX2V2ZW50X3RvX2FjdG9yGAkgASgLMjUud2Vic29ja2V0LmV2ZW50LnBsYXlpbmcuRXZvbHV0aW9uTW9uc3RlckV2ZW50VG9BY3RvckgAEmkKJGV2b2x1dGlvbl9tb25zdGVyX2V2ZW50X3RvX3JlY2lwaWVudBgKIAEoCzI5LndlYnNvY2tldC5ldmVudC5wbGF5aW5nLkV2b2x1dGlvbk1vbnN0ZXJFdmVudFRvUmVjaXBpZW50SAASWQocdGFrZV9zdXBwb3J0X2V2ZW50X3RvX3NlcnZlchgLIAEoCzIxLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlRha2VTdXBwb3J0RXZlbnRUb1NlcnZlckgAElcKG3Rha2Vfc3VwcG9ydF9ldmVudF90b19hY3RvchgMIAEoCzIwLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlRha2VTdXBwb3J0RXZlbnRUb0FjdG9ySAASXwofdGFrZV9zdXBwb3J0X2V2ZW50X3RvX3JlY2lwaWVudBgNIAEoCzI0LndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlRha2VTdXBwb3J0RXZlbnRUb1JlY2lwaWVudEgAElUKGnRha2VfZ29vZHNfZXZlbnRfdG9fc2VydmVyGA4gASgLMi8ud2Vic29ja2V0LmV2ZW50LnBsYXlpbmcuVGFrZUdvb2RzRXZlbnRUb1NlcnZlckgAElMKGXRha2VfZ29vZHNfZXZlbnRfdG9fYWN0b3IYDyABKAsyLi53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5UYWtlR29vZHNFdmVudFRvQWN0b3JIABJbCh10YWtlX2dvb2RzX2V2ZW50X3RvX3JlY2lwaWVudBgQIAEoCzIyLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlRha2VHb29kc0V2ZW50VG9SZWNpcGllbnRIABJQChdyZXRyZWF0X2V2ZW50X3RvX3NlcnZlchgRIAEoCzItLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlJldHJlYXRFdmVudFRvU2VydmVySAASTgoWcmV0cmVhdF9ldmVudF90b19hY3RvchgSIAEoCzIsLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlJldHJlYXRFdmVudFRvQWN0b3JIABJWChpyZXRyZWF0X2V2ZW50X3RvX3JlY2lwaWVudBgTIAEoCzIwLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlJldHJlYXRFdmVudFRvUmVjaXBpZW50SAASWwodc3VwcGx5X2VuZXJneV9ldmVudF90b19zZXJ2ZXIYFCABKAsyMi53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5TdXBwbHlFbmVyZ3lFdmVudFRvU2VydmVySAASWQocc3VwcGx5X2VuZXJneV9ldmVudF90b19hY3RvchgVIAEoCzIxLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlN1cHBseUVuZXJneUV2ZW50VG9BY3RvckgAEmEKIHN1cHBseV9lbmVyZ3lfZXZlbnRfdG9fcmVjaXBpZW50GBYgASgLMjUud2Vic29ja2V0LmV2ZW50LnBsYXlpbmcuU3VwcGx5RW5lcmd5RXZlbnRUb1JlY2lwaWVudEgAElQKGXN1cnJlbmRlcl9ldmVudF90b19zZXJ2ZXIYFyABKAsyLy53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5TdXJyZW5kZXJFdmVudFRvU2VydmVySAASUgoYc3VycmVuZGVyX2V2ZW50X3RvX2FjdG9yGBggASgLMi4ud2Vic29ja2V0LmV2ZW50LnBsYXlpbmcuU3VycmVuZGVyRXZlbnRUb0FjdG9ySAASWgocc3VycmVuZGVyX2V2ZW50X3RvX3JlY2lwaWVudBgZIAEoCzIyLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlN1cnJlbmRlckV2ZW50VG9SZWNpcGllbnRIABJQChdhYmlsaXR5X2V2ZW50X3RvX3NlcnZlchgaIAEoCzItLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLkFiaWxpdHlFdmVudFRvU2VydmVySAASTgoWYWJpbGl0eV9ldmVudF90b19hY3RvchgbIAEoCzIsLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLkFiaWxpdHlFdmVudFRvQWN0b3JIABJWChphYmlsaXR5X2V2ZW50X3RvX3JlY2lwaWVudBgcIAEoCzIwLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLkFiaWxpdHlFdmVudFRvUmVjaXBpZW50SAASSgoUZHJhd19ldmVudF90b19zZXJ2ZXIYHSABKAsyKi53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5EcmF3RXZlbnRUb1NlcnZlckgAEkgKE2RyYXdfZXZlbnRfdG9fYWN0b3IYHiABKAsyKS53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5EcmF3RXZlbnRUb0FjdG9ySAASUAoXZHJhd19ldmVudF90b19yZWNpcGllbnQYHyABKAsyLS53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5EcmF3RXZlbnRUb1JlY2lwaWVudEgAElsKHWNvbmZpcm1fYWN0aW9uX2V2ZW50X3RvX2FjdG9yGCAgASgLMjIud2Vic29ja2V0LmV2ZW50LnBsYXlpbmcuQ29uZmlybUFjdGlvbkV2ZW50VG9BY3RvckgAEnQKKmluaXRpYWxfcGxhY2VtZW50X2NvbXBsZXRlX2V2ZW50X3RvX3NlcnZlchghIAEoCzI+LndlYnNvY2tldC5ldmVudC5wbGF5aW5nLkluaXRpYWxQbGFjZW1lbnRDb21wbGV0ZUV2ZW50VG9TZXJ2ZXJIABJXChtzdGFydF9nYW1lX2V2ZW50X3RvX2NsaWVudHMYIiABKAsyMC53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5TdGFydEdhbWVFdmVudFRvQ2xpZW50c0gAElcKG3R1cm5fc3RhcnRfZXZlbnRfdG9fY2xpZW50cxgjIAEoCzIwLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlR1cm5TdGFydEV2ZW50VG9DbGllbnRzSAASUwoZdHVybl9lbmRfZXZlbnRfdG9fY2xpZW50cxgkIAEoCzIuLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLlR1cm5FbmRFdmVudFRvQ2xpZW50c0gAElMKGWNvaW5fdG9zc19ldmVudF90b19zZXJ2ZXIYJSABKAsyLi53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5Db2luVG9zc0V2ZW50VG9TZXJ2ZXJIABJRChhjb2luX3Rvc3NfZXZlbnRfdG9fYWN0b3IYJiABKAsyLS53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5Db2luVG9zc0V2ZW50VG9BY3RvckgAEmYKI2NvaW5fdG9zc19yZXN1bHRfZXZlbnRfdG9fcmVjaXBpZW50GCcgASgLMjcud2Vic29ja2V0LmV2ZW50LnBsYXlpbmcuQ29pblRvc3NSZXN1bHRFdmVudFRvUmVjaXBpZW50SAASXQoeY29uZmlybV9lbmVyZ3lfZXZlbnRfdG9fc2VydmVyGCggASgLMjMud2Vic29ja2V0LmV2ZW50LnBsYXlpbmcuQ29uZmlybUVuZXJneUV2ZW50VG9TZXJ2ZXJIABJbCh1jb25maXJtX2VuZXJneV9ldmVudF90b19hY3RvchgpIAEoCzIyLndlYnNvY2tldC5ldmVudC5wbGF5aW5nLkNvbmZpcm1FbmVyZ3lFdmVudFRvQWN0b3JIABJdCh5jb25maXJtX3RhcmdldF9ldmVudF90b19zZXJ2ZXIYKiABKAsyMy53ZWJzb2NrZXQuZXZlbnQucGxheWluZy5Db25maXJtVGFyZ2V0RXZlbnRUb1NlcnZlckgAElsKHWNvbmZpcm1fdGFyZ2V0X2V2ZW50X3RvX2FjdG9yGCsgASgLMjIud2Vic29ja2V0LmV2ZW50LnBsYXlpbmcuQ29uZmlybVRhcmdldEV2ZW50VG9BY3RvckgAQgcKBWV2ZW50QnwKCWNvbS5ldmVudEIKRXZlbnRQcm90b1ABWi9naXRodWIuY29tL3lhbWF0bzAyMTEvYnJhY2hpby1iYWNrZW5kL3dlYnNvY2tldKICA0VYWKoCBUV2ZW50ygIFRXZlbnTiAhFFdmVudFxHUEJNZXRhZGF0YeoCBUV2ZW50YgZwcm90bzM", [file_google_protobuf_timestamp, file_websocket_event_playing]);

/**
 * Describes the message event.EventMetadata.
 * Use `create(EventMetadataSchema)` to create a new message.
 */
export const EventMetadataSchema = /*@__PURE__*/
  messageDesc(file_websocket_event, 0);

/**
 * Describes the message event.EventEnvelope.
 * Use `create(EventEnvelopeSchema)` to create a new message.
 */
export const EventEnvelopeSchema = /*@__PURE__*/
  messageDesc(file_websocket_event, 1);

