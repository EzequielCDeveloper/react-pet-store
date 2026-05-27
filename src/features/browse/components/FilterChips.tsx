import type { BrowseFilters } from '../useBrowseLogic';

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  pending: 'Pending',
  sold: 'Sold',
};

const SORT_LABELS: Record<string, string> = {
  'name-desc': 'Name Z-A',
  'price-low': 'Price Low-High',
  'price-high': 'Price High-Low',
};

const CATEGORY_CHIP_COLORS: Record<string, { bg: string; text: string }> = {
  dogs: { bg: '#fef3c7', text: '#d97706' },
  cats: { bg: '#ede9fe', text: '#7c3aed' },
  birds: { bg: '#ccfbf1', text: '#0d9488' },
  fish: { bg: '#dbeafe', text: '#2563eb' },
  'small-pets': { bg: '#fce7f3', text: '#db2777' },
};

interface ChipDef {
  readonly key: keyof BrowseFilters;
  readonly label: string;
}

interface FilterChipsProps {
  readonly filters: BrowseFilters;
  readonly onRemoveFilter: (key: keyof BrowseFilters) => void;
  readonly onClearAll: () => void;
}

function buildChips(filters: BrowseFilters): ChipDef[] {
  const chips: ChipDef[] = [];

  if (filters.status !== 'all' && filters.status) {
    chips.push({
      key: 'status',
      label: STATUS_LABELS[filters.status] ?? filters.status,
    });
  }

  if (filters.category) {
    chips.push({ key: 'category', label: filters.category });
  }

  if (filters.q) {
    chips.push({ key: 'q', label: `"${filters.q}"` });
  }

  if (filters.hasPhoto === 'yes') {
    chips.push({ key: 'hasPhoto', label: 'With photos' });
  }

  if (filters.sort !== 'name-asc') {
    chips.push({
      key: 'sort',
      label: SORT_LABELS[filters.sort] ?? filters.sort,
    });
  }

  return chips;
}

function getChipColor(filters: BrowseFilters, chip: ChipDef) {
  if (chip.key === 'category' && filters.category) {
    return CATEGORY_CHIP_COLORS[filters.category] || null;
  }
  return null;
}

export default function FilterChips({
  filters,
  onRemoveFilter,
  onClearAll,
}: FilterChipsProps) {
  const chips = buildChips(filters);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {chips.map((chip) => {
        const color = getChipColor(filters, chip);
        return (
          <span
            key={chip.key}
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm"
            style={
              color
                ? { backgroundColor: color.bg, color: color.text }
                : { backgroundColor: '#eff6ff', color: '#1d4ed8' }
            }
          >
            {chip.label}
            <button
              type="button"
              className="ml-1 hover:opacity-70 font-bold"
              onClick={() => onRemoveFilter(chip.key)}
              aria-label={`Remove ${chip.label} filter`}
            >
              ×
            </button>
          </span>
        );
      })}
      <button
        type="button"
        className="text-sm text-blue-600 hover:text-blue-800 underline"
        onClick={onClearAll}
      >
        Clear all
      </button>
    </div>
  );
}
