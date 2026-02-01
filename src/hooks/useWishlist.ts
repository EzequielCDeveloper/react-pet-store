import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './useToast';

// Experimental API endpoints (do not exist on real backend)
// We use the same base URL as the real API to ensure consistency
const BASE_URL = 'https://petstore.swagger.io/v2';

export const useWishlist = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Fetch wishlist
  const { data: wishlistIds = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      // This will fail in real app (404), but we'll mock it in Playwright
      try {
        const response = await fetch(`${BASE_URL}/user/wishlist`);
        if (!response.ok) {
            // In the real app (without mocks), this endpoint doesn't exist.
            // We return an empty array to prevent the app from crashing.
            return [];
        }
        return response.json() as Promise<number[]>;
      } catch {
        return [];
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Toggle favorite
  const toggleMutation = useMutation({
    mutationFn: async ({ petId, isFavorite }: { petId: number; isFavorite: boolean }) => {
      const method = isFavorite ? 'DELETE' : 'POST';
      // We simulate a RESTful endpoint: POST /user/wishlist/:petId
      const url = `${BASE_URL}/user/wishlist/${petId}`;
      
      const response = await fetch(url, { method });
      
      if (!response.ok) {
         throw new Error('Wishlist API not implemented');
      }
      return response.json();
    },
    onSuccess: (_, { petId, isFavorite }) => {
      queryClient.setQueryData(['wishlist'], (old: number[] = []) => {
        if (isFavorite) {
          return old.filter(id => id !== petId);
        } else {
          return [...old, petId];
        }
      });
      addToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
    },
    onError: () => {
      addToast('Feature not available (Backend Mock Required)', 'error');
    }
  });

  return {
    wishlistIds,
    toggleFavorite: (petId: number) => {
      const isFavorite = wishlistIds.includes(petId);
      toggleMutation.mutate({ petId, isFavorite });
    },
    isToggling: toggleMutation.isPending
  };
};
