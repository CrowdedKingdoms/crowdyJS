/**
 * CrowdyJS SDK - game-only client SDK for Crowded Kingdoms.
 *
 * As of the management/game-api split, this package targets
 * `cks-game-api` only. For login / registration / org / app / billing /
 * payments, consumers should call `cks-management-api` directly
 * (e.g. `POST /auth/login`) and then pass the resulting Bearer token to
 * this SDK via {@link CrowdyClient.setToken}.
 *
 * Usage:
 *
 *   import { CrowdyClient } from '@crowdedkingdomstudios/crowdyjs';
 *
 *   // Log in against the management API yourself, then:
 *   const client = new CrowdyClient({ graphqlEndpoint, wsEndpoint });
 *   client.setToken(token);
 *
 *   const unsub = client.udp.subscribe({ onActorUpdate: (n) => { ... } });
 */

export const VERSION = '4.0.0-game-only';

export {
  CrowdyClient,
  createCrowdyClient,
  type CrowdyClientConfig,
} from './crowdy-client.js';
export {
  BrowserLocalStorageTokenStore,
  SessionStore,
  type SessionListener,
  type TokenStore,
} from './session.js';
export {
  GraphQLClient,
  GraphQLTransport,
  type GraphQLClientConfig,
} from './client.js';
export {
  RealtimeClient,
  type RealtimeConfig,
  type RealtimeStatus,
  type SpatialNotification,
  type UdpNotification,
  type UdpNotificationHandlers,
} from './realtime.js';
export { WorldClient, ActorClient, type ActorOptions } from './world.js';
export {
  CrowdyError,
  CrowdyGraphQLError,
  CrowdyHttpError,
  CrowdyNetworkError,
  CrowdyProtocolError,
  CrowdyRealtimeError,
  CrowdyTimeoutError,
} from './errors.js';
export {
  SequenceAllocator,
  decodeBase64,
  encodeBase64,
  generateCrowdyUuid,
  validateChunkCoordinates,
  validateCrowdyUuid,
} from './utils.js';

// -----------------------------------------------------------------------------
// Hand-written types kept ONLY for the subscription notification union and
// its handlers. The schema-derived codegen types are canonical for inputs
// and scalars (see "Re-export schema-derived ..." block below).
// -----------------------------------------------------------------------------
export type {
  BigInt,
  ChunkCoordinates,
  VoxelCoordinates,
  ActorUpdateNotification,
  ActorUpdateResponse,
  VoxelUpdateNotification,
  VoxelUpdateResponse,
  ClientAudioNotification,
  ClientTextNotification,
  ClientEventNotification,
  ServerEventNotification,
  GenericErrorResponse,
  ActorUpdateHandler,
  ActorUpdateResponseHandler,
  VoxelUpdateHandler,
  VoxelUpdateResponseHandler,
  ClientAudioHandler,
  ClientTextHandler,
  ClientEventHandler,
  ServerEventHandler,
  GenericErrorHandler,
  UnsubscribeFn,
} from './types.js';

export { UdpErrorCode } from './types.js';

// -----------------------------------------------------------------------------
// Game-only domain wrappers.
// -----------------------------------------------------------------------------
export { ChunksAPI } from './domains/chunks.js';
export { VoxelsAPI } from './domains/voxels.js';
export { ActorsAPI } from './domains/actors.js';
export { TeleportAPI } from './domains/teleport.js';
export { StateAPI } from './domains/state.js';
export { ServerStatusAPI } from './domains/serverStatus.js';
export { UdpAPI } from './domains/udp.js';

// -----------------------------------------------------------------------------
// Re-export schema-derived game-side input/output types and enums from
// codegen. Run `npm run codegen` against `cks-game-api/schema.gql` after
// schema changes; the management-side types are no longer included.
// -----------------------------------------------------------------------------
export type {
  ChunkCoordinatesInput,
  VoxelCoordinatesInput,
  ActorUpdateRequestInput,
  VoxelUpdateRequestInput,
  ClientAudioPacketInput,
  ClientTextPacketInput,
  ClientEventNotificationInput,
  UdpProxyConnectionStatus,
  RealtimeConnectionEvent,
  GameClientBootstrap,

  CreateActorInput,
  UpdateActorInput,
  ActorFilterInput,
  BatchActorLookupInput,
  CreateUserAppStateInput,
  UpdateUserStateInput,
  UpdateAvatarStateInput,
  UpdateActorStateInput,
  UpdateGamertagInput,
  UpdateChunkStateInput,
  UpdateChunkLodsInput,
  ChunkUpdateInput,
  UpdateVoxelInput,
  RollbackVoxelUpdatesInput,
  GetChunkInput,
  GetChunkLodsInput,
  GetChunksByDistanceInput,
  GetVoxelListInput,
  ListVoxelsInput,
  ListVoxelUpdatesByDistanceInput,
  TeleportRequestInput,
  LodDataInput,
  VoxelStateInput,

  Chunk,
  ChunkLodsResponse,
  ChunksByDistanceResponse,
  ChunkVoxelResponse,
  ChunkVoxelUpdatesResponse,
  Voxel,
  VoxelUpdatesByDistanceResponse,
  VoxelUpdateHistoryEvent,
  RollbackVoxelEventResult,
  Actor,
  Avatar,
  AvatarDto,
  TeleportResponse,
  UserAppState,
  ServerStatus,
  GraphQlServer,
  ServerVersionInfo,
  VersionInfo,
  PageInfo,
  UdpNotificationsSubscription,

  Scalars,
} from './generated/graphql.js';

export { ServerState } from './generated/graphql.js';
