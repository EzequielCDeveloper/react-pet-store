import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import { useBrowseLogic } from './useBrowseLogic';
import type { BrowseFilters, SortOption } from './useBrowseLogic';
import BrowseSidebar from './components/BrowseSidebar';
import BrowseGrid from './components/BrowseGrid';
import FilterChips from './components/FilterChips';

const DEFAULT_VALUES: Record<keyof BrowseFilters, string> = {
  status: '',
  category: '',
  q: '',
  sort: 'name-asc',
  hasPhoto: '',
};

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const status = searchParams.get('status') ?? '';
  const category = searchParams.get('category') ?? '';
  const q = searchParams.get('q') ?? '';
  const sort = (searchParams.get('sort') as SortOption) ?? 'name-asc';
  const hasPhoto = searchParams.get('hasPhoto') ?? '';

  const filters: BrowseFilters = { status, category, q, sort, hasPhoto };

  const { pets, allPets, isLoading, error, retry } = useBrowseLogic(filters);

  const handleFilterChange = (key: keyof BrowseFilters, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === DEFAULT_VALUES[key]) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  };

  const handleRemoveFilter = (key: keyof BrowseFilters) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(key);
      return next;
    });
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Breadcrumb />
      <FilterChips
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal size={18} />
           Filtros
        </button>
      </div>
      <div className="flex gap-8">
        <BrowseSidebar
          allPets={allPets}
          isLoading={isLoading}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <BrowseGrid
          pets={pets}
          isLoading={isLoading}
          error={error}
          onRetry={retry}
        />
      </div>
    </div>
  );
}
