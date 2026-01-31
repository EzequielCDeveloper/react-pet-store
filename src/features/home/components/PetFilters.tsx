import { Search } from 'lucide-react';

type Status = 'available' | 'pending' | 'sold';

interface PetFiltersProps {
  selectedStatuses: Status[];
  onStatusChange: (status: Status) => void;
  tagsInput: string;
  onTagsInputChange: (value: string) => void;
  onAddTag: () => void;
  tags: string[];
  onRemoveTag: (tag: string) => void;
  mode: 'status' | 'tags';
  onModeChange: (mode: 'status' | 'tags') => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

export const PetFilters = ({
  selectedStatuses,
  onStatusChange,
  tagsInput,
  onTagsInputChange,
  onAddTag,
  tags,
  onRemoveTag,
  mode,
  onModeChange,
  minPrice,
  maxPrice,
  onPriceChange
}: PetFiltersProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Filter By</h3>
        <div className="flex rounded-md shadow-sm mb-6" role="group">
          <button
            type="button"
            onClick={() => onModeChange('status')}
            className={`px-4 py-2 text-sm font-medium border rounded-l-lg flex-1 ${
              mode === 'status'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Status
          </button>
          <button
            type="button"
            onClick={() => onModeChange('tags')}
            className={`px-4 py-2 text-sm font-medium border rounded-r-lg flex-1 ${
              mode === 'tags'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Tags
          </button>
        </div>
      </div>

      {mode === 'status' && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Status</h4>
          <div className="space-y-2">
            {(['available', 'pending', 'sold'] as Status[]).map(status => (
              <label key={status} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(status)}
                  onChange={() => onStatusChange(status)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-600 group-hover:text-gray-900 capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {mode === 'tags' && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Search Tags</h4>
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => onTagsInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAddTag()}
                placeholder="e.g. dog, cat"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button
              onClick={onAddTag}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
            >
              Add Tag
            </button>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map(tag => (
                   <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tag}
                      <button
                        type="button"
                        onClick={() => onRemoveTag(tag)}
                        className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                      >
                        <span className="sr-only">Remove {tag}</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
                <div className="w-1/2">
                    <label htmlFor="min-price" className="block text-xs text-gray-500 mb-1">Min (£)</label>
                    <input
                        id="min-price"
                        type="number"
                        min="0"
                        max={maxPrice}
                        value={minPrice}
                        onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
                        className="w-full border border-gray-300 rounded-md p-1.5 text-sm"
                    />
                </div>
                <div className="text-gray-400 mt-4">-</div>
                <div className="w-1/2">
                    <label htmlFor="max-price" className="block text-xs text-gray-500 mb-1">Max (£)</label>
                    <input
                        id="max-price"
                        type="number"
                        min={minPrice}
                        value={maxPrice}
                        onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md p-1.5 text-sm"
                    />
                </div>
            </div>
            <input 
                type="range"
                min="0"
                max="200"
                value={maxPrice}
                onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
      </div>
    </div>
  );
};

