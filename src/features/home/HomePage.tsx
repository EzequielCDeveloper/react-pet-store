import { useRef } from 'react';
import HeroBanner from './components/HeroBanner';
import CategoryQuickLinks from './components/CategoryQuickLinks';
import FeaturedPets from './components/FeaturedPets';
import PromoBanner from './components/PromoBanner';
import { useHomeLogic } from './useHomeLogic';

export default function HomePage() {
  const featuredRef = useRef<HTMLElement>(null);
  const { featuredPets, isLoading, error, refetch, categories } = useHomeLogic();

  return (
    <div>
      <HeroBanner targetRef={featuredRef} />
      <CategoryQuickLinks categories={categories} />
      <FeaturedPets
        ref={featuredRef}
        pets={featuredPets}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
      <PromoBanner />
    </div>
  );
}
