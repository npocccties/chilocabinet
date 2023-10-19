import base64url from "base64url";
import crypto from "crypto";

import {
  LOCAL_STORAGE_ID_CODE_VERIFIER,
  LOCAL_STORAGE_ID_TOKEN_KEY,
  LOCAL_STORAGE_ID_TOKEN_STATE,
} from "../configs/constants";

export interface RedirectConfig {
  key: string;
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
}

export interface AuthorizationContext {
  idTokenKey: string;
  idTokenState: string;
  codeVerifier: string;
}

export const authorize = (config: RedirectConfig): void => {
  const random = crypto.randomBytes(32);

  const state = base64url.encode(random);
  const nonce = base64url.encode(random);
  const codeVerifier = base64url.encode(random);

  localStorage.setItem(LOCAL_STORAGE_ID_TOKEN_KEY, config.key);
  localStorage.setItem(LOCAL_STORAGE_ID_TOKEN_STATE, state);
  localStorage.setItem(LOCAL_STORAGE_ID_CODE_VERIFIER, codeVerifier);

  const codeChallenge = base64url.encode(crypto.createHash("sha256").update(codeVerifier).digest());

  window.location.href = `${config.authorizationEndpoint}&client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=openid&state=${state}&nonce=${nonce}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
};

export const getAndRefreshAuthorizationContext = (): AuthorizationContext => {
  const idTokenKey = localStorage.getItem(LOCAL_STORAGE_ID_TOKEN_KEY);
  const idTokenState = localStorage.getItem(LOCAL_STORAGE_ID_TOKEN_STATE);
  const codeVerifier = localStorage.getItem(LOCAL_STORAGE_ID_CODE_VERIFIER);

  localStorage.removeItem(LOCAL_STORAGE_ID_TOKEN_KEY);
  localStorage.removeItem(LOCAL_STORAGE_ID_TOKEN_STATE);

  return {
    idTokenKey,
    idTokenState,
    codeVerifier,
  };
};