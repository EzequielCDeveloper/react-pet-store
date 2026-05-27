import type { components } from '../../../api/schema';
import { PetCard } from '../../pets/components/PetCard';
import Skeleton from '../../../components/Skeleton';
import { Search } from 'lucide-react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

type Pet = components["schemas"]["Pet"];

interface BrowseGridProps {
  readonly pets: Pet[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly onRetry: () => void;
}

function RevealCard({ pet, index }: { readonly pet: Pet; readonly index: number }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className="transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <PetCard pet={pet} />
    </div>
  );
}

export default function BrowseGrid({
  pets,
  isLoading,
  error,
  onRetry,
}: BrowseGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-lg text-center max-w-md mx-auto">
        <p className="text-lg font-medium mb-4">
          No se pudieron cargar las mascotas. Por favor, intenta de nuevo.
        </p>
        <p className="text-sm text-red-600 mb-4">{error.message}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="py-12 text-center">
        <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          No se encontraron mascotas con esos filtros
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Intenta ajustar o limpiar tus filtros para ver más mascotas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pets.map((pet, index) => (
        <RevealCard key={pet.id} pet={pet} index={index} />
      ))}
    </div>
  );
}
