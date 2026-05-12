/**
 * Auth sub-client. Talks to `cks-management-api` (NOT the game API) because
 * the management API owns the `game_tokens` table that backs every login /
 * register / password / email-confirm flow.
 *
 * The returned `token` is a `game_tokens` row that game-api will validate
 * against the same shared Postgres. Once the SDK has a token, the rest of
 * the sub-clients (chunks, voxels, actors, udp, ...) use it transparently
 * via the shared `AuthState`.
 */

import type { GraphQLClient } from '../client.js';
import type { AuthState } from '../auth-state.js';
import {
  ChangePasswordDocument,
  ConfirmEmailDocument,
  LoginDocument,
  LogoutAllDevicesDocument,
  LogoutDocument,
  RegisterDocument,
  RequestPasswordResetDocument,
  ResendConfirmationEmailDocument,
  ResetPasswordDocument,
  type LoginMutation,
  type LoginUserInput,
  type RegisterMutation,
  type RegisterUserInput,
  type ResetPasswordInput,
} from '../generated/graphql.js';

export class AuthAPI {
  constructor(
    private readonly graphql: GraphQLClient,
    private readonly session: AuthState,
  ) {}

  /**
   * Log in and persist the resulting `game_tokens` bearer token via the
   * shared `AuthState`. All subsequent SDK calls (game-api or
   * management-api) include it automatically.
   */
  async login(input: LoginUserInput): Promise<LoginMutation['login']> {
    const data = await this.graphql.request(LoginDocument, { input });
    if (data.login?.token) {
      this.session.setToken(data.login.token);
    }
    return data.login;
  }

  /** Register a new user. Same token-persistence behaviour as `login`. */
  async register(
    input: RegisterUserInput,
  ): Promise<RegisterMutation['register']> {
    const data = await this.graphql.request(RegisterDocument, { input });
    if (data.register?.token) {
      this.session.setToken(data.register.token);
    }
    return data.register;
  }

  /**
   * Single-device logout. Clears the in-memory token after a successful
   * server-side revoke so other sub-clients don't keep using it.
   */
  async logout(): Promise<boolean> {
    const data = await this.graphql.request(LogoutDocument);
    this.session.setToken(null);
    return data.logout;
  }

  /** Revoke every `game_tokens` row for the current user. */
  async logoutAllDevices(): Promise<boolean> {
    const data = await this.graphql.request(LogoutAllDevicesDocument);
    return data.logoutAllDevices;
  }

  async confirmEmail(token: string): Promise<boolean> {
    const data = await this.graphql.request(ConfirmEmailDocument, { token });
    return data.confirmEmail;
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    const data = await this.graphql.request(RequestPasswordResetDocument, {
      email,
    });
    return data.requestPasswordReset;
  }

  async resetPassword(input: ResetPasswordInput): Promise<boolean> {
    const data = await this.graphql.request(ResetPasswordDocument, {
      input,
    });
    return data.resetPassword;
  }

  async resendConfirmationEmail(email: string): Promise<boolean> {
    const data = await this.graphql.request(ResendConfirmationEmailDocument, {
      email,
    });
    return data.resendConfirmationEmail;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const data = await this.graphql.request(ChangePasswordDocument, {
      currentPassword,
      newPassword,
    });
    return data.changePassword;
  }

  /** Imperatively replace the in-memory bearer token (e.g. on rehydrate). */
  setToken(token: string | null): void {
    this.session.setToken(token);
  }

  /** Read the current bearer token. */
  getToken(): string | null {
    return this.session.getToken();
  }
}
