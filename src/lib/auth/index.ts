import { User } from "oidc-client-ts";

export const getAccessToken = function getUser() {
  const oidcStorage = localStorage.getItem(
    `oidc.user:${import.meta.env.VITE_COGNITO_AUTHORITY_URL}:${import.meta.env.VITE_COGNITO_CLIENT_ID}`
  );

  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage).id_token;
};

export const getUserInfo = function getUser() {
  const oidcStorage = localStorage.getItem(
    `oidc.user:${import.meta.env.VITE_COGNITO_AUTHORITY_URL}:${import.meta.env.VITE_COGNITO_CLIENT_ID}`
  );

  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
};
