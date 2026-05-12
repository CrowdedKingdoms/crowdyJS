/**
 * Type definitions for Crowded Kingdoms SDK
 */

// BigInt is represented as string in GraphQL
export type BigInt = string;

// Chunk coordinates
export interface ChunkCoordinates {
  x: BigInt;
  y: BigInt;
  z: BigInt;
}

export interface ChunkCoordinatesInput {
  x: number;
  y: number;
  z: number;
}

// Voxel coordinates
export interface VoxelCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface VoxelCoordinatesInput {
  x: number;
  y: number;
  z: number;
}

// Error codes - re-exported from the codegen-derived enum so the SDK has
// exactly one canonical UdpErrorCode shape. The hand-written enum that
// used to live here drifted from the schema (`AppNotFound` etc.); see
// generated/graphql.ts for the source of truth.
export { UdpErrorCode } from './generated/graphql.js';
import type { UdpErrorCode } from './generated/graphql.js';

// User types
export interface User {
  userId: BigInt;
  email?: string;
  gamertag?: string;
  disambiguation?: string;
  state?: string;
  isConfirmed: boolean;
  createdAt: string;
  grantEarlyAccess: boolean;
  grantEarlyAccessOverride: boolean;
  orgId?: BigInt;
  externalId?: string;
  userType: string;
}

export interface AuthResponse {
  token: string;
  gameTokenId: string;
  user: User;
}

// UDP Proxy Connection Status
export interface UdpProxyConnectionStatus {
  connected: boolean;
  serverIp6?: string;
  serverClientPort?: number;
  lastMessageTime?: string;
}

// Actor Update Request
export interface ActorUpdateRequestInput {
  appId: number;
  chunk: ChunkCoordinatesInput;
  uuid: string;
  state: string;
  distance?: number;
  decayRate?: number;
  sequenceNumber?: number;
}

// Voxel Update Request
export interface VoxelUpdateRequestInput {
  appId: number;
  chunk: ChunkCoordinatesInput;
  uuid: string;
  voxel: VoxelCoordinatesInput;
  voxelType: number;
  voxelState: string;
  distance?: number;
  decayRate?: number;
  sequenceNumber?: number;
}

// Client Audio Packet
export interface ClientAudioPacketInput {
  appId: number;
  chunk: ChunkCoordinatesInput;
  uuid: string;
  audioData: string;
  distance?: number;
  decayRate?: number;
  sequenceNumber?: number;
}

// Client Text Packet
export interface ClientTextPacketInput {
  appId: number;
  chunk: ChunkCoordinatesInput;
  uuid: string;
  text: string;
  distance?: number;
  decayRate?: number;
  sequenceNumber?: number;
}

// Client Event Notification
export interface ClientEventNotificationInput {
  appId: number;
  chunk: ChunkCoordinatesInput;
  uuid: string;
  eventType: number;
  state: string;
  distance?: number;
  decayRate?: number;
  sequenceNumber?: number;
}

// Notification Types (from GraphQL union)
//
// All spatial types share a uniform header:
//   appId, chunkX/Y/Z, distance, decayRate, uuid, sequenceNumber, epochMillis
// Only GenericErrorResponse has a minimal 3-field format.

export interface ActorUpdateNotification {
  __typename: 'ActorUpdateNotification';
  appId: BigInt;
  chunkX: BigInt;
  chunkY: BigInt;
  chunkZ: BigInt;
  distance: number;
  decayRate: number;
  uuid: string;
  state: string;
  sequenceNumber: number;
  epochMillis: BigInt;
}

export interface ActorUpdateResponse {
  __typename: 'ActorUpdateResponse';
  appId: BigInt;
  chunkX: BigInt;
  chunkY: BigInt;
  chunkZ: BigInt;
  distance: number;
  decayRate: number;
  uuid: string;
  sequenceNumber: number;
  epochMillis: BigInt;
}

export interface VoxelUpdateNotification {
  __typename: 'VoxelUpdateNotification';
  appId: BigInt;
  chunkX: BigInt;
  chunkY: BigInt;
  chunkZ: BigInt;
  distance: number;
  decayRate: number;
  uuid: string;
  voxelX: number;
  voxelY: number;
  voxelZ: number;
  voxelType: number;
  voxelState: string;
  sequenceNumber: number;
  epochMillis: BigInt;
}

export interface VoxelUpdateResponse {
  __typename: 'VoxelUpdateResponse';
  appId: BigInt;
  chunkX: BigInt;
  chunkY: BigInt;
  chunkZ: BigInt;
  distance: number;
  decayRate: number;
  uuid: string;
  sequenceNumber: number;
  epochMillis: BigInt;
}

export interface ClientAudioNotification {
  __typename: 'ClientAudioNotification';
  appId: BigInt;
  chunkX: BigInt;
  chunkY: BigInt;
  chunkZ: BigInt;
  distance: number;
  decayRate: number;
  uuid: string;
  audioData: string;
  sequenceNumber: number;
  epochMillis: BigInt;
}

export interface ClientTextNotification {
  __typename: 'ClientTextNotification';
  appId: BigInt;
  chunkX: BigInt;
  chunkY: BigInt;
  chunkZ: BigInt;
  distance: number;
  decayRate: number;
  uuid: string;
  text: string;
  sequenceNumber: number;
  epochMillis: BigInt;
}

export interface ClientEventNotification {
  __typename: 'ClientEventNotification';
  appId: BigInt;
  chunkX: BigInt;
  chunkY: BigInt;
  chunkZ: BigInt;
  distance: number;
  decayRate: number;
  uuid: string;
  eventType: number;
  state: string;
  sequenceNumber: number;
  epochMillis: BigInt;
}

export interface ServerEventNotification {
  __typename: 'ServerEventNotification';
  appId: BigInt;
  chunkX: BigInt;
  chunkY: BigInt;
  chunkZ: BigInt;
  distance: number;
  decayRate: number;
  uuid: string;
  eventType: number;
  state: string;
  sequenceNumber: number;
  epochMillis: BigInt;
}

export interface GenericErrorResponse {
  __typename: 'GenericErrorResponse';
  sequenceNumber: number;
  errorCode: UdpErrorCode;
}

// Union type for all notifications
export type UdpNotification =
  | ActorUpdateNotification
  | ActorUpdateResponse
  | VoxelUpdateNotification
  | VoxelUpdateResponse
  | ClientAudioNotification
  | ClientTextNotification
  | ClientEventNotification
  | ServerEventNotification
  | GenericErrorResponse;

// Client Configuration
export interface CrowdyClientConfig {
  graphqlEndpoint?: string;
  wsEndpoint?: string;
  timeout?: number;
}

// Handler types
export type ActorUpdateHandler = (notification: ActorUpdateNotification) => void;
export type ActorUpdateResponseHandler = (response: ActorUpdateResponse) => void;
export type VoxelUpdateHandler = (notification: VoxelUpdateNotification) => void;
export type VoxelUpdateResponseHandler = (response: VoxelUpdateResponse) => void;
export type ClientAudioHandler = (notification: ClientAudioNotification) => void;
export type ClientTextHandler = (notification: ClientTextNotification) => void;
export type ClientEventHandler = (notification: ClientEventNotification) => void;
export type ServerEventHandler = (notification: ServerEventNotification) => void;
export type GenericErrorHandler = (response: GenericErrorResponse) => void;

// Unsubscribe function
export type UnsubscribeFn = () => void;

