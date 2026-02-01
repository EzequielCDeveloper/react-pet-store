import { PetCard } from '../../pets/components/PetCard';
import type { components } from '../../../api/schema';

type Pet = components["schemas"]["Pet"];

interface PetGridProps {
  pets: Pet[] | undefined;
  isLoading: boolean;
  error: unknown;
}

export const PetGrid = ({ pets, isLoading, error }: PetGridProps) => {
  if (isLoading) {
    return (
      <div data-testid="pet-grid-loading" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 h-80 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="pet-grid-error" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
        <p>Error loading pets. Please check your connection or try again later.</p>
      </div>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <div data-testid="pet-grid-empty" className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No pets found</h3>
        <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div data-testid="pet-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pets.map((pet, index) => (
        <PetCard key={`${pet.id}-${index}`} pet={pet} />
      ))}
    </div>
  );
};
