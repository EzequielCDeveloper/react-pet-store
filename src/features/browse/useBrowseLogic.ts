import { useState, useEffect, useMemo, useCallback } from 'react';
import { useApi } from '../../api/client';
import type { components } from '../../api/schema';
import { getPetPrice } from '../../lib/pet-utils';

type Pet = components["schemas"]["Pet"];

export type SortOption = 'name-asc' | 'name-desc' | 'price-low' | 'price-high';

export interface BrowseFilters {
  status: string;
  category: string;
  q: string;
  sort: SortOption;
  hasPhoto: string;
}

export interface UseBrowseLogicReturn {
  readonly pets: Pet[];
  readonly allPets: Pet[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly retry: () => void;
}

const STATUSES = ['available', 'pending', 'sold'] as const;

export function applyFiltersAndSort(allPets: Pet[], filters: BrowseFilters): Pet[] {
  const { status, category, q, hasPhoto, sort } = filters;

  let result = allPets;

  if (status && status !== 'all') {
    result = result.filter((pet) => pet.status === status);
  }

  if (category) {
    result = result.filter(
      (pet) => pet.category?.name?.toLowerCase() === category.toLowerCase(),
    );
  }

  if (q) {
    result = result.filter((pet) =>
      pet.name?.toLowerCase().includes(q.toLowerCase()),
    );
  }

  if (hasPhoto === 'yes') {
    result = result.filter((pet) => pet.photoUrls.length > 0);
  }

  const sorted = [...result];
  switch (sort) {
    case 'name-desc':
      sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      break;
    case 'price-low':
      sorted.sort((a, b) => getPetPrice(a.id) - getPetPrice(b.id));
      break;
    case 'price-high':
      sorted.sort((a, b) => getPetPrice(b.id) - getPetPrice(a.id));
      break;
    case 'name-asc':
    default:
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
  }

  return sorted;
}

export function useBrowseLogic(filters: BrowseFilters): UseBrowseLogicReturn {
  const api = useApi();
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll(): Promise<void> {
      setIsLoading(true);
      setError(null);

      const results = await Promise.allSettled(
        STATUSES.map((status) =>
          api.GET('/pet/findByStatus', {
            params: { query: { status: [status] } },
          }),
        ),
      );

      if (cancelled) return;

      const combined: Pet[] = [];
      let allFailed = true;
      const errors: string[] = [];

      for (const result of results) {
        if (result.status === 'fulfilled') {
          allFailed = false;
          const data = result.value.data;
          if (data) {
            combined.push(...data);
          }
        } else {
          errors.push(
            result.reason instanceof Error
              ? result.reason.message
              : 'Unknown error',
          );
        }
      }

      if (allFailed) {
        setError(new Error(errors.join('; ') || 'All fetches failed'));
        setAllPets([]);
      } else {
        setAllPets(combined);
      }

      setIsLoading(false);
    }

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, [api, fetchKey]);

  const retry = useCallback(() => {
    setFetchKey((k) => k + 1);
  }, []);

  const pets = useMemo(() => {
    return applyFiltersAndSort(allPets, filters);
  }, [allPets, filters]);

  return { pets, allPets, isLoading, error, retry };
}
