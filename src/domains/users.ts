/**
 * Users sub-client. Targets `cks-management-api` — game-api never exposes
 * identity mutations after the split.
 *
 * Only the read/identity surface that game clients realistically need is
 * here. Super-admin / operator screens use cks-management-ui (Apollo)
 * directly rather than the SDK.
 */

import type { GraphQLClient } from '../client.js';
import {
  MeDocument,
  UpdateGamertagDocument,
  DeleteMyAccountDocument,
  type MeQuery,
  type UpdateGamertagInput,
  type UpdateGamertagMutation,
} from '../generated/graphql.js';

export class UsersAPI {
  constructor(private readonly graphql: GraphQLClient) {}

  /**
   * Validate the current Bearer token and return the user record. Returns
   * null if the token is expired/revoked. Use this for session restore on
   * SDK init.
   */
  async me(): Promise<MeQuery['me']> {
    const data = await this.graphql.request(MeDocument);
    return data.me;
  }

  async updateGamertag(
    input: UpdateGamertagInput,
  ): Promise<UpdateGamertagMutation['updateGamertag']> {
    const data = await this.graphql.request(UpdateGamertagDocument, { input });
    return data.updateGamertag;
  }

  /**
   * Soft-deletes the current user's account: anonymizes PII and revokes
   * sessions. Wallet / donation history stays intact via FK.
   */
  async deleteMyAccount(): Promise<boolean> {
    const data = await this.graphql.request(DeleteMyAccountDocument);
    return data.deleteMyAccount;
  }
}
