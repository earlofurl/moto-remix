import { isBrowser } from "./is-browser";

declare global {
  type Window = {
    env: {
      SUPABASE_URL: string;
      SUPABASE_ANON_PUBLIC: string;
      REACT_APP_MAPBOX_ACCESS_TOKEN: string;
      SENDGRID_API_KEY: string;
    };
  };
}

declare global {
  namespace NodeJS {
    type ProcessEnv = {
      SUPABASE_URL: string;
      SUPABASE_SERVICE_ROLE: string;
      SERVER_URL: string;
      SUPABASE_ANON_PUBLIC: string;
      SESSION_SECRET: string;
      REACT_APP_MAPBOX_ACCESS_TOKEN: string;
      SENDGRID_API_KEY: string;
    };
  }
}

type EnvOptions = {
  isSecret?: boolean;
  isRequired?: boolean;
};
function getEnv(
  name: string,
  { isRequired, isSecret }: EnvOptions = { isSecret: true, isRequired: true }
) {
  if (isBrowser && isSecret) return "";

  const source = (isBrowser ? window.env : process.env) ?? {};

  const value = source[name as keyof typeof source];

  if (!value && isRequired) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

/**
 * Server env
 */
export const SERVER_URL = getEnv("SERVER_URL");
export const SUPABASE_SERVICE_ROLE = getEnv("SUPABASE_SERVICE_ROLE");
export const SESSION_SECRET = getEnv("SESSION_SECRET");
export const REACT_APP_MAPBOX_ACCESS_TOKEN = getEnv(
  "REACT_APP_MAPBOX_ACCESS_TOKEN"
);
export const SENDGRID_API_KEY = getEnv("SENDGRID_API_KEY");

/**
 * Shared envs
 */
export const NODE_ENV = getEnv("NODE_ENV", {
  isSecret: false,
  isRequired: false,
});
export const SUPABASE_URL = getEnv("SUPABASE_URL", { isSecret: false });
export const SUPABASE_ANON_PUBLIC = getEnv("SUPABASE_ANON_PUBLIC", {
  isSecret: false,
});

export function getBrowserEnv() {
  return {
    SUPABASE_URL,
    SUPABASE_ANON_PUBLIC,
  };
}
