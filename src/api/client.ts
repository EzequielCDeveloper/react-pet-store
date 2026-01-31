import createClient from "openapi-fetch";
import type { paths } from "./schema";
import { useMemo } from "react";

// Default base URL from env or fallback
const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://petstore.swagger.io/v2';

// Create a static client instance for non-hook usage
export const client = createClient<paths>({
  baseUrl: DEFAULT_BASE_URL,
});

client.use({
  onRequest: async ({ request }) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${request.method} ${request.url}`);
    }
    // Static client might check localStorage for API key if needed
    const apiKey = localStorage.getItem('petstore_api_key');
    if (apiKey) {
       request.headers.set("api_key", apiKey);
    }
    return request;
  },
  onResponse: async ({ response }) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${response.status} ${response.url}`);
    }
    return response;
  }
});

export const useApi = () => {
  const baseUrl = DEFAULT_BASE_URL;
  const apiKey = localStorage.getItem('petstore_api_key');

  const client = useMemo(() => {
    const c = createClient<paths>({ 
      baseUrl,
    });

    c.use({
      onRequest: async ({ request }) => {
        if (import.meta.env.DEV) {
          console.log(`[API] ${request.method} ${request.url}`);
        }
        if (apiKey) {
           request.headers.set("api_key", apiKey);
        }
        return request;
      },
      onResponse: async ({ response }) => {
        if (import.meta.env.DEV) {
          console.log(`[API] ${response.status} ${response.url}`);
        }
        return response;
      }
    });

    return c;
  }, [baseUrl, apiKey]);

  return client;
};
