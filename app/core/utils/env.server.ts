declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    ENV: {
      SUPABASE_URL: string;
      SUPABASE_ANON_PUBLIC: string;
      REACT_APP_MAPBOX_ACCESS_TOKEN: string;
    };
  }
}

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_SERVICE_ROLE: string;
      SERVER_URL: string;
      REACT_APP_MAPBOX_ACCESS_TOKEN: string;
    }
  }
}

export const { NODE_ENV } = process.env;
export const { SERVER_URL } = process.env;

export const { SUPABASE_URL } = process.env;
export const { SUPABASE_ANON_PUBLIC } = process.env;
export const { SUPABASE_SERVICE_ROLE } = process.env;
export const { SESSION_SECRET } = process.env;
export const { REACT_APP_MAPBOX_ACCESS_TOKEN } = process.env;
