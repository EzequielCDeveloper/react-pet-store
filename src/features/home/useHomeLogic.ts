import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../api/client';
import type { components } from '../../api/schema';

type Pet = components["schemas"]["Pet"];

export interface CategoryData {
  readonly name: string;
  readonly slug: string;
  readonly icon: string;
}

export interface UseHomeLogicReturn {
  readonly featuredPets: Pet[] | undefined;
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly refetch: () => void;
  readonly categories: readonly CategoryData[];
}

const FEATURED_PETS_LIMIT = 8;
const STALE_TIME = 5 * 60 * 1000;

const CATEGORIES: readonly CategoryData[] = [
  { name: 'Dogs', slug: 'dogs', icon: 'Dog' },
  { name: 'Cats', slug: 'cats', icon: 'Cat' },
  { name: 'Birds', slug: 'birds', icon: 'Bird' },
  { name: 'Fish', slug: 'fish', icon: 'Fish' },
  { name: 'Small Pets', slug: 'small-pets', icon: 'Heart' },
];

export function useHomeLogic(): UseHomeLogicReturn {
  const api = useApi();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['home', 'featured-pets'],
    queryFn: async () => {
      const { data, error } = await api.GET("/pet/findByStatus", {
        params: { query: { status: ['available'] } }
      });
      if (error) throw error;
      return data;
    },
    staleTime: STALE_TIME,
    gcTime: 10 * 60 * 1000,
    select: (pets) => {
      return pets
        ?.filter(pet => pet.id !== undefined && Number.isSafeInteger(pet.id))
        .sort((a, b) => (a.id as number) - (b.id as number))
        .slice(0, FEATURED_PETS_LIMIT);
    },
  });

  return {
    featuredPets: data,
    isLoading,
    error: error as Error | null,
    refetch,
    categories: CATEGORIES,
  };
}
