import { isMatch } from "lodash-es";
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
import { getAccessToken } from "../auth";
import type { paths } from "./type";
const END_POINT = import.meta.env.VITE_API_URL;
export const client = createClient<paths>({
  baseUrl: `${END_POINT}/`,
});

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
