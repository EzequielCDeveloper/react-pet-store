import { forwardRef } from 'react';
import type { components } from '../../../api/schema';
import { PetCard } from '../../pets/components/PetCard';
import Skeleton from '../../../components/Skeleton';
import { SearchX } from 'lucide-react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';

type Pet = components["schemas"]["Pet"];

interface FeaturedPetsProps {
  readonly pets: Pet[] | undefined;
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly onRetry: () => void;
}

function RevealCard({ pet, index }: { readonly pet: Pet; readonly index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

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

const FeaturedPets = forwardRef<HTMLElement, FeaturedPetsProps>(
  function FeaturedPets({ pets, isLoading, error, onRetry }, ref) {
    if (isLoading) {
      return (
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Mascotas destacadas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (error) {
      return (
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Mascotas destacadas
            </h2>
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-lg text-center max-w-md mx-auto">
              <p className="text-lg font-medium mb-4">
                No se pudieron cargar las mascotas destacadas. Por favor, intenta de nuevo.
              </p>
              <button
                onClick={onRetry}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </section>
      );
    }

    if (!pets || pets.length === 0) {
      return (
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Mascotas destacadas
            </h2>
            <div className="py-12 text-center">
              <SearchX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No hay mascotas disponibles en este momento</h3>
              <p className="mt-2 text-sm text-gray-500">Vuelve más tarde para ver nuevas llegadas.</p>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section ref={ref} className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Mascotas destacadas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pets.map((pet, index) => (
              <RevealCard key={pet.id} pet={pet} index={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }
);

export default FeaturedPets;
