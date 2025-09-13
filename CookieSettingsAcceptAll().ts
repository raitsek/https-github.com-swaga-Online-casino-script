import { InvalidAppIdError } from 'src/shared/errors/common';
import { isValidUuid } from 'src/shared/helpers/validators';
import type { OneSignalApiBaseResponse } from '../../shared/api/base';
import * as OneSignalApiBase from '../../shared/api/base';
import { encodeRFC3986URIComponent } from '../../shared/utils/Encoding';
import type {
  AliasPair,
  ICreateUser,
  ICreateUserIdentity,
  ICreateUserSubscription,
  ISubscription,
  IUpdateUser,
  IUserIdentity,
  IUserProperties,
  RequestMetadata,
  UserData,
} from '../types/api';
import type { ICreateEvent } from '../types/customEvents';

// ...existing code...
/**
 * Creates a new user
 * @param requestMetadata - { appId }
 * @param requestBody - The user's properties, identity, and subscriptions
 */
export async function createNewUser(
  requestMetadata: RequestMetadata,
  requestBody: ICreateUser,
) {
  const { appId, subscriptionId } = requestMetadata;

  const subscriptionHeader = subscriptionId
    ? { 'OneSignal-Subscription-Id': subscriptionId }
    : undefined;

  let headers = {};

  if (subscriptionHeader) {
    headers = { ...headers, ...subscriptionHeader };
  }

  if (requestMetadata.jwtHeader) {
    headers = { ...headers, ...requestMetadata.jwtHeader };
  }

  requestBody['refresh_device_metadata'] = true;

  return OneSignalApiBase.post<UserData>(
    `apps/${appId}/users`,
    requestBody,
    headers,
  );
}

// ...rest of your TypeScript code...
// (Paste the entire code you provided in your prompt here)