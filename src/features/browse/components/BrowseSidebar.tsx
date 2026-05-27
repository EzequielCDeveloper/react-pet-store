import { useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { components } from '../../../api/schema';
import type { BrowseFilters } from '../useBrowseLogic';

type Pet = components["schemas"]["Pet"];

interface BrowseSidebarProps {
  readonly allPets: Pet[];
  readonly isLoading: boolean;
  readonly filters: BrowseFilters;
  readonly onFilterChange: (key: keyof BrowseFilters, value: string) => void;
  readonly onClearAll: () => void;
  readonly isOpen?: boolean;
  readonly onClose?: () => void;
}

export default function BrowseSidebar({
  allPets,
  isLoading,
  filters,
  onFilterChange,
  onClearAll,
  isOpen = false,
  onClose,
}: BrowseSidebarProps) {
  const categories = useMemo(() => {
    return [
      ...new Set(
        allPets
          .map((pet) => pet.category?.name)
          .filter((name): name is string => typeof name === 'string'),
      ),
    ].sort();
  }, [allPets]);

  const selectClasses =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400';

  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const filterContent = (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="filter-status"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Status
        </label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className={selectClasses}
        >
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="filter-category"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Category
        </label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          disabled={isLoading}
          className={selectClasses}
        >
          <option value="">All</option>
          {isLoading ? (
            <option disabled>Loading...</option>
          ) : (
            categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))
          )}
        </select>
      </div>

      <div>
        <label
          htmlFor="filter-sort"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Sort
        </label>
        <select
          id="filter-sort"
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className={selectClasses}
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-low">Price Low-High</option>
          <option value="price-high">Price High-Low</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="filter-hasPhoto"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Photo
        </label>
        <select
          id="filter-hasPhoto"
          value={filters.hasPhoto}
          onChange={(e) => onFilterChange('hasPhoto', e.target.value)}
          className={selectClasses}
        >
          <option value="">Show all</option>
          <option value="yes">With photos only</option>
        </select>
      </div>

      <button
        onClick={onClearAll}
        className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-20 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {filterContent}
        </div>
      </aside>

      {onClose && (
        <>
          {isOpen &&
            createPortal(
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                onClick={onClose}
              />,
              document.body,
            )}

          <aside
            className={`fixed top-0 left-0 h-full w-72 bg-white z-40 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
              isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
            }`}
            aria-label="Filters sidebar"
            aria-modal="true"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>
              {filterContent}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
