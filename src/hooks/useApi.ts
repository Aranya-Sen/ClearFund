import { useState } from 'react';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

export function useApi<T = unknown>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const callApi = async (url: string, options: ApiCallOptions = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { method = 'GET', headers = {}, body } = options;

      const config: RequestInit = {
        method,
        headers: {
          ...headers,
        },
      };

      if (body && method !== 'GET') {
        // Check if body is FormData
        if (body instanceof FormData) {
          // Don't set Content-Type for FormData, let the browser set it with boundary
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (config.headers as any)?.['Content-Type'];
        } else {
          // For JSON data, set Content-Type and stringify
          config.headers = {
            'Content-Type': 'application/json',
            ...headers,
          };
          config.body = JSON.stringify(body);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config.body = body as any;
      }

      const response = await fetch(url, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses (like HTML error pages)
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data?.error || `API request failed: ${response.status}`);
      }

      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  const reset = () => {
    setState({ data: null, loading: false, error: null });
  };

  return {
    ...state,
    callApi,
    reset,
  };
}
