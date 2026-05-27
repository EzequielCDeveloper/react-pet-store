import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useHomeLogic } from './useHomeLogic';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useHomeLogic', () => {
  it('returns correct shape with all expected keys', () => {
    const { result } = renderHook(() => useHomeLogic(), { wrapper: createWrapper() });

    expect(result.current).toHaveProperty('featuredPets');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('refetch');
    expect(result.current).toHaveProperty('categories');
    expect(typeof result.current.refetch).toBe('function');
  });

  it('categories array has exactly 5 entries with correct names', () => {
    const { result } = renderHook(() => useHomeLogic(), { wrapper: createWrapper() });

    expect(result.current.categories).toHaveLength(5);
    expect(result.current.categories[0].name).toBe('Dogs');
    expect(result.current.categories[1].name).toBe('Cats');
    expect(result.current.categories[2].name).toBe('Birds');
    expect(result.current.categories[3].name).toBe('Fish');
    expect(result.current.categories[4].name).toBe('Small Pets');
  });

  it('loading state returns isLoading true', () => {
    const { result } = renderHook(() => useHomeLogic(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.featuredPets).toBeUndefined();
  });

  it('resolves data successfully', async () => {
    const { result } = renderHook(() => useHomeLogic(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.featuredPets).toBeDefined();
  });
});
