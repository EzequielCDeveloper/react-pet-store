import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../api/client';
import { PetFilters } from './components/PetFilters';
import { PetGrid } from './components/PetGrid';
import { getPetPrice } from '../../lib/pet-utils';

type Status = 'available' | 'pending' | 'sold';

export const HomePage = () => {
  const api = useApi();
  const [mode, setMode] = useState<'status' | 'tags'>('status');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>(['available']);
  const [tagsInput, setTagsInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Price Filter State
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);

  // Sort statuses to ensure consistent API calls and cache keys regardless of selection order
  const sortedStatuses = [...selectedStatuses].sort();

  const { data: petsByStatus, isLoading: isLoadingStatus, error: errorStatus } = useQuery({
    queryKey: ['pets', 'status', sortedStatuses],
    queryFn: async () => {
      const { data, error } = await api.GET("/pet/findByStatus", {
        params: { query: { status: sortedStatuses } }
      });
      if (error) throw error;
      return data;
    },
    enabled: mode === 'status' && selectedStatuses.length > 0,
  });

  const { data: petsByTags, isLoading: isLoadingTags, error: errorTags } = useQuery({
    queryKey: ['pets', 'tags', tags],
    queryFn: async () => {
      const { data, error } = await api.GET("/pet/findByTags", {
        params: { query: { tags: tags } }
      });
      if (error) throw error;
      return data;
    },
    enabled: mode === 'tags' && tags.length > 0,
  });

  const rawPets = mode === 'status' ? petsByStatus : petsByTags;
  
  // Filter out pets with unsafe integer IDs AND filter by price AND filter by search query
  const pets = rawPets?.filter(pet => 
    pet.id !== undefined && 
    Number.isSafeInteger(pet.id) &&
    getPetPrice(pet.id) >= minPrice &&
    getPetPrice(pet.id) <= maxPrice &&
    (searchQuery === '' || pet.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isLoading = mode === 'status' ? isLoadingStatus : isLoadingTags;
  const error = mode === 'status' ? errorStatus : errorTags;

  const handleStatusChange = (status: Status) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const handleAddTag = () => {
    if (tagsInput.trim() && !tags.includes(tagsInput.trim())) {
      setTags([...tags, tagsInput.trim()]);
      setTagsInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Sidebar - Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <PetFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatuses={selectedStatuses}
          onStatusChange={handleStatusChange}
          tagsInput={tagsInput}
          onTagsInputChange={setTagsInput}
          onAddTag={handleAddTag}
          tags={tags}
          onRemoveTag={handleRemoveTag}
          mode={mode}
          onModeChange={setMode}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
        />
      </aside>

      {/* Main Content - Grid */}

      <main className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'status' ? 'All Pets' : 'Search Results'}
          </h1>
          <p className="text-gray-500 mt-1">
            {pets ? `${pets.length} pets found` : 'Searching...'}
          </p>
        </div>
        
        <PetGrid 
          pets={pets} 
          isLoading={isLoading} 
          error={error} 
        />
      </main>
    </div>
  );
};
