import { isMatch } from "lodash-es";
import { User } from "oidc-client-ts";
import createClient, { type Middleware } from "openapi-fetch";
import type {
  PathsWithMethod,
  RequiredKeysOf,
} from "openapi-typescript-helpers";
import type { Fetcher, Key, SWRConfiguration, SWRResponse } from "swr";
import {
  type TypesForGetRequest,
  createMutateHook,
  createQueryHook,
} from "swr-openapi";
import type { paths } from "./type";
const END_POINT = import.meta.env.DEV
  ? "http://localhost:8080"
  : import.meta.env.VITE_API_URL;
export const client = createClient<paths>({
  baseUrl: "https://brachio.kurichi.dev/",
});

const getAccessToken = function getUser() {
  const oidcStorage = localStorage.getItem(
    `oidc.user:${import.meta.env.VITE_COGNITO_AUTHORITY_URL}:${import.meta.env.VITE_COGNITO_CLIENT_ID}`
  );

  if (!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage).id_token;
};

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken = getAccessToken();
    request.headers.set("Authorization", `Bearer ${accessToken}`);
    return request;
  },
};

client.use(authMiddleware);
const baseUseQuery = createQueryHook<paths, `${string}/${string}`, string>(
  client,
  "api"
);

export const useQuery = <
  Path extends PathsWithMethod<paths, "get">,
  R extends TypesForGetRequest<paths, Path>,
  Init extends R["Init"],
  Data extends R["Data"],
  Error extends R["Error"],
  Config extends R["SWRConfig"],
>(
  path: Path,
  ...[init, config]: RequiredKeysOf<Init> extends never
    ? [(Init | null)?, Config?]
    : [Init | null, Config?]
): Omit<
  SWRResponse<
    Data,
    Error,
    SWRConfiguration<
      Exclude<Data, undefined>,
      Error,
      Fetcher<Exclude<Data, undefined>, Key>
    >
  >,
  "data"
> & {
  data: Data;
} => {
  // @ts-ignore
  return baseUseQuery(path, ...[init, { ...config, suspense: true }]);
};

export const useMutation = createMutateHook(client, "api", isMatch);
