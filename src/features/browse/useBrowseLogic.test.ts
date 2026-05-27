import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { http, HttpResponse } from 'msw';
import { useBrowseLogic, applyFiltersAndSort } from './useBrowseLogic';
import type { BrowseFilters } from './useBrowseLogic';
import { server } from '../../mocks/server';
import * as apiClient from '../../api/client';

const availablePets = [
  { id: 1, name: 'Buddy', status: 'available' as const, photoUrls: ['photo1.jpg'], category: { id: 1, name: 'Dogs' } },
  { id: 2, name: 'Max', status: 'available' as const, photoUrls: [], category: { id: 1, name: 'Dogs' } },
  { id: 3, name: 'Whiskers', status: 'available' as const, photoUrls: ['cat.jpg'], category: { id: 2, name: 'Cats' } },
];

const pendingPets = [
  { id: 4, name: 'Rocky', status: 'pending' as const, photoUrls: [], category: { id: 1, name: 'Dogs' } },
];

const soldPets = [
  { id: 5, name: 'Bella', status: 'sold' as const, photoUrls: [], category: { id: 3, name: 'Birds' } },
];

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

const defaultFilters: BrowseFilters = {
  status: '',
  category: '',
  q: '',
  sort: 'name-asc',
  hasPhoto: '',
};

describe('useBrowseLogic', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns correct shape with all expected keys', () => {
    const { result } = renderHook(() => useBrowseLogic(defaultFilters), { wrapper: createWrapper() });

    expect(result.current).toHaveProperty('pets');
    expect(result.current).toHaveProperty('allPets');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('retry');
    expect(typeof result.current.retry).toBe('function');
  });

  it('returns isLoading: true initially', () => {
    const { result } = renderHook(() => useBrowseLogic(defaultFilters), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
  });

  it('returns error null and pets defined after resolving', async () => {
    server.use(
      http.get('*/pet/findByStatus', ({ request }) => {
        const url = new URL(request.url);
        const statusParam = url.searchParams.get('status');
        if (statusParam === 'available') return HttpResponse.json(availablePets);
        if (statusParam === 'pending') return HttpResponse.json(pendingPets);
        if (statusParam === 'sold') return HttpResponse.json(soldPets);
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useBrowseLogic(defaultFilters), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.pets).toBeDefined();
    expect(result.current.allPets.length).toBeGreaterThan(0);
  });

  it('retry function resets and re-fetches', async () => {
    let callCount = 0;
    server.use(
      http.get('*/pet/findByStatus', () => {
        callCount++;
        return HttpResponse.json(availablePets);
      }),
    );

    const { result } = renderHook(() => useBrowseLogic(defaultFilters), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const callsAfterFirstFetch = callCount;

    await act(async () => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(callCount).toBeGreaterThan(callsAfterFirstFetch);
  });

  it('handles graceful degradation when one status fetch fails', async () => {
    vi.spyOn(apiClient, 'useApi').mockReturnValue({
      GET: vi.fn()
        .mockResolvedValueOnce({ data: availablePets, error: undefined })
        .mockRejectedValueOnce(new Error('Simulated network failure for pending status'))
        .mockResolvedValueOnce({ data: soldPets, error: undefined }),
    } as unknown as ReturnType<typeof apiClient.useApi>);

    const { result } = renderHook(() => useBrowseLogic(defaultFilters), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.allPets.length).toBe(4);
    expect(result.current.allPets.every((p) => p.status !== 'pending')).toBe(true);
  });

  it('sets error when ALL status fetches fail', async () => {
    vi.spyOn(apiClient, 'useApi').mockReturnValue({
      GET: vi.fn()
        .mockRejectedValueOnce(new Error('Failure 1'))
        .mockRejectedValueOnce(new Error('Failure 2'))
        .mockRejectedValueOnce(new Error('Failure 3')),
    } as unknown as ReturnType<typeof apiClient.useApi>);

    const { result } = renderHook(() => useBrowseLogic(defaultFilters), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.allPets).toEqual([]);
  });
});

describe('applyFiltersAndSort', () => {
  const allPets = [
    { id: 1, name: 'Buddy', status: 'available' as const, photoUrls: ['photo1.jpg'], category: { id: 1, name: 'Dogs' } },
    { id: 2, name: 'Max', status: 'available' as const, photoUrls: [], category: { id: 1, name: 'Dogs' } },
    { id: 3, name: 'Whiskers', status: 'available' as const, photoUrls: ['cat.jpg'], category: { id: 2, name: 'Cats' } },
    { id: 4, name: 'Rocky', status: 'pending' as const, photoUrls: [], category: { id: 1, name: 'Dogs' } },
    { id: 5, name: 'Bella', status: 'sold' as const, photoUrls: [], category: { id: 3, name: 'Birds' } },
  ];

  it('filterByStatus: filters to only available pets when status=available', () => {
    const result = applyFiltersAndSort(allPets, { ...defaultFilters, status: 'available' });

    expect(result).toHaveLength(3);
    expect(result.every((p) => p.status === 'available')).toBe(true);
  });

  it('filterByCategory: filters by category name (case-insensitive)', () => {
    const result = applyFiltersAndSort(allPets, { ...defaultFilters, category: 'DOGS' });

    expect(result).toHaveLength(3);
    expect(result.every((p) => p.category?.name?.toLowerCase() === 'dogs')).toBe(true);
  });

  it('filterBySearch: filters by pet name substring', () => {
    const result = applyFiltersAndSort(allPets, { ...defaultFilters, q: 'bud' });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Buddy');
  });

  it('filterByPhoto: returns only pets with photoUrls when hasPhoto=yes', () => {
    const result = applyFiltersAndSort(allPets, { ...defaultFilters, hasPhoto: 'yes' });

    expect(result).toHaveLength(2);
    expect(result.every((p) => p.photoUrls.length > 0)).toBe(true);
  });

  it('sort name-asc: sorts alphabetically A-Z', () => {
    const result = applyFiltersAndSort(allPets, { ...defaultFilters, sort: 'name-asc' });

    const names = result.map((p) => p.name);
    expect(names).toEqual(['Bella', 'Buddy', 'Max', 'Rocky', 'Whiskers']);
  });

  it('sort name-desc: sorts Z-A', () => {
    const result = applyFiltersAndSort(allPets, { ...defaultFilters, sort: 'name-desc' });

    const names = result.map((p) => p.name);
    expect(names).toEqual(['Whiskers', 'Rocky', 'Max', 'Buddy', 'Bella']);
  });
});
