/**
 * Public surface of the SDK. Construct one `CrowdyClient` per game session.
 *
 * **As of the management/game-api split**, CrowdyJS is **game-only**. The
 * management sub-clients (`auth`, `users`, `orgs`, `apps`, `appAccess`,
 * `billing`, `quotas`, `payments`) used to live here too; they're gone.
 * Consumers that need login, registration, org / app management, or
 * billing should call the `cks-management-api` REST/GraphQL surface
 * directly (e.g. `POST /auth/login` to mint a `game_tokens` row, then
 * pass the resulting Bearer token here via {@link CrowdyClient.setToken}).
 *
 * The remaining sub-clients (`udp`, `chunks`, `voxels`, `actors`,
 * `teleport`, `state`, `serverStatus`) all target `cks-game-api`.
 */

import { AuthState } from './auth-state.js';
import { GraphQLClient } from './client.js';
import { SubscriptionManager } from './subscriptions.js';
import type { CrowdyLogger } from './logger.js';
import type { TokenStore } from './session.js';
import { WorldClient } from './world.js';

import { ChunksAPI } from './domains/chunks.js';
import { VoxelsAPI } from './domains/voxels.js';
import { ActorsAPI } from './domains/actors.js';
import { TeleportAPI } from './domains/teleport.js';
import { StateAPI } from './domains/state.js';
import { ServerStatusAPI } from './domains/serverStatus.js';
import { UdpAPI } from './domains/udp.js';

export interface CrowdyClientConfig {
  /** Game-api HTTP URL (root). Defaults to local game-api dev URL. */
  httpUrl?: string;
  /** Game-api WS URL for subscriptions. */
  wsUrl?: string;
  /** Game-api GraphQL endpoint. Defaults to `${httpUrl}/graphql`. */
  graphqlEndpoint?: string;
  /** Game-api WS endpoint. Defaults to `${wsUrl}/graphql`. */
  wsEndpoint?: string;
  timeout?: number;
  tokenStore?: TokenStore;
  logger?: CrowdyLogger;
  realtime?: {
    retryAttempts?: number;
    retryInitialDelayMs?: number;
    retryMaxDelayMs?: number;
    waitTimeoutMs?: number;
  };
}

export class CrowdyClient {
  readonly session: AuthState;
  readonly graphql: GraphQLClient;
  readonly realtime: SubscriptionManager;

  // Game-only sub-clients.
  readonly chunks: ChunksAPI;
  readonly voxels: VoxelsAPI;
  readonly actors: ActorsAPI;
  readonly teleport: TeleportAPI;
  readonly state: StateAPI;
  readonly serverStatus: ServerStatusAPI;
  readonly udp: UdpAPI;

  constructor(config: CrowdyClientConfig = {}) {
    this.session = new AuthState(config.tokenStore);
    this.graphql = new GraphQLClient(
      {
        httpUrl: config.httpUrl,
        graphqlEndpoint: config.graphqlEndpoint,
        timeout: config.timeout,
        logger: config.logger,
      },
      this.session,
    );
    this.realtime = new SubscriptionManager(
      {
        wsUrl: config.wsUrl,
        wsEndpoint: config.wsEndpoint,
        logger: config.logger,
        ...config.realtime,
      },
      this.session,
    );

    this.chunks = new ChunksAPI(this.graphql);
    this.voxels = new VoxelsAPI(this.graphql);
    this.actors = new ActorsAPI(this.graphql);
    this.teleport = new TeleportAPI(this.graphql);
    this.state = new StateAPI(this.graphql);
    this.serverStatus = new ServerStatusAPI(this.graphql);
    this.udp = new UdpAPI(this.graphql, this.realtime);
  }

  /**
   * Set the Bearer token (typically obtained from
   * `POST /auth/login` against `cks-management-api`).
   */
  setToken(token: string | null): void {
    this.session.setToken(token);
  }

  /** Read the current Bearer token (null if no session). */
  getToken(): string | null {
    return this.session.getToken();
  }

  world(appId: string): WorldClient {
    return new WorldClient(appId, this.udp);
  }

  /** Closes the WebSocket and clears the in-memory auth token. */
  close(): void {
    this.realtime.close();
    this.session.setToken(null);
  }
}

export function createCrowdyClient(config: CrowdyClientConfig = {}): CrowdyClient {
  return new CrowdyClient(config);
}
