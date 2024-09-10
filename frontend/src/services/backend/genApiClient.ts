import { getCookie, setCookie } from "cookies-next";
import type { GetServerSidePropsContext } from "next/types";
import { getEnvFromServer } from "../env/getEnvFromServer";

import { ApiFetchClient, ClientBase, ClientConfiguration } from "./types";


interface NSwagClient<T extends ClientBase> {
  new (
    configuration: ClientConfiguration,
    baseUrl?: string,
    http?: { fetch: typeof fetch }
  ): T;
}

export const genClient = async <T extends ClientBase, V extends NSwagClient<T>>(
  Client: V,
  _fetch?: typeof fetch
) => {
  const backendUrl: string = await getEnv().then((x) => x.backendUrl);
  const config = new ClientConfiguration(getToken());

  return new Client(
    config,
    backendUrl,
    _fetch && {
      fetch: _fetch,
    }
  ) as InstanceType<V>;
};

const AUTHTOKENKEY = process.env.NEXT_PUBLIC_AUTH_TOKEN;

const getTokenFromStorage = () => {
  if (!process.browser) return null;

  return localStorage.getItem(AUTHTOKENKEY);
};

const getTokenFromCookie = (context?: GetServerSidePropsContext) => {
  if (!process.browser && !context) return null;

  if (process.browser) {
    return getCookie(AUTHTOKENKEY)?.toString();
  }

  return getCookie(AUTHTOKENKEY, context)?.toString();
};

const getToken = (context?: GetServerSidePropsContext) => {
  return getTokenFromCookie(context);
};

const getEnv = async (): Promise<ReturnType<typeof getEnvFromServer>> => {
  if (process.browser) return await fetch("/api/getEnv").then((x) => x.json());
  return getEnvFromServer();
};

const cookieSettings = {
  sameSite: "strict" as "strict",
  path: "/",
  maxAge: 43200, //30 days
};

export const setToken = (
  token: string,
  context?: GetServerSidePropsContext
) => {
  if (process.browser) setCookie(AUTHTOKENKEY, token, cookieSettings);
  if (!context) throw Error("Cant set cookie on server without context");
  setCookie(AUTHTOKENKEY, token, { ...context, ...cookieSettings });
};

export const genApiClient = () => genClient(ApiFetchClient);
