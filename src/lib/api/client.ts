import { isMatch } from "lodash-es";
import createClient from "openapi-fetch";
import { createMutateHook, createQueryHook } from "swr-openapi";
import type { paths } from "./type";

export const client = createClient<paths>({
  baseUrl: `${import.meta.env.VITE_API_URL}/`,
});

export const useQuery = createQueryHook(client, "api");

export const useMutation = createMutateHook(client, "api", isMatch);
