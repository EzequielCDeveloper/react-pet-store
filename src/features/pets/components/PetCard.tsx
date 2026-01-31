import { Link } from 'react-router-dom';
import type { components } from '../../../api/schema';
import clsx from 'clsx';
import { ShoppingCart } from 'lucide-react';
import { getPetImage, getPetPrice } from '../../../lib/pet-utils';
import { useCart } from '../../../hooks/useCart';
import { useToast } from '../../../hooks/useToast';

type Pet = components["schemas"]["Pet"];

interface PetCardProps {
  pet: Pet;
  onDelete?: (id: number) => void;
}

const statusColors = {
  available: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  sold: 'bg-red-100 text-red-800',
};

export const PetCard = ({ pet }: PetCardProps) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  // Use generated image as primary to ensure consistent visual style, 
  // or fallback to API url if needed. For this task, user wants images for all tiles.
  const imageUrl = getPetImage(pet.id);
  const price = getPetPrice(pet.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(pet);
    addToast('Added to cart!', 'success');
  };

  return (
    <Link 
      to={`/pets/${pet.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden border border-gray-200 flex flex-col h-full group"
    >
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={pet.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback if loremflickr fails
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={clsx(
            "px-2 py-1 text-xs font-semibold rounded-full uppercase shadow-sm",
            statusColors[pet.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
          )}>
            {pet.status || 'unknown'}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{pet.name || 'Unnamed Pet'}</h3>
           <span className="text-lg font-bold text-blue-600">£{price}</span>
        </div>
        
        {pet.category && (
          <p className="text-sm text-gray-500 mb-2">Category: {pet.category.name}</p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-4">
          {pet.tags?.slice(0, 3).map((tag, index) => (
            <span key={`${tag.id}-${index}`} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
              {tag.name}
            </span>
          ))}
          {(pet.tags?.length || 0) > 3 && (
            <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded">
              +{pet.tags!.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto">
          {pet.status === 'available' ? (
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          ) : pet.status === 'pending' ? (
            <button
              disabled
              className="w-full flex items-center justify-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg cursor-not-allowed border border-yellow-200"
            >
              <span>Pending</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full flex items-center justify-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg cursor-not-allowed border border-red-200"
            >
              <span>Sold</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

