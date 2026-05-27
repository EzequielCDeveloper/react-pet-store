import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useApi } from '../../api/client';
import { PetForm } from './components/PetForm';
import type { components } from '../../api/schema';
import { queryClient } from '../../lib/query-client';
import { useState, useRef } from 'react';
import { Trash2, Upload, ArrowLeft, ShoppingCart, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useToast } from '../../hooks/useToast';
import { useCart } from '../../hooks/useCart';
import { getPetImage, getPetPrice } from '../../lib/pet-utils';
import Skeleton from '../../components/Skeleton';

type Pet = components["schemas"]["Pet"];

function PetImageCarousel({ pet }: { readonly pet: Pet }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!pet.photoUrls || pet.photoUrls.length <= 1) {
    return (
      <div className="md:flex-shrink-0 md:w-1/3 bg-gray-200">
        <img
          src={pet.photoUrls?.[0] || getPetImage(pet.id)}
          alt={pet.name}
          className="h-full w-full object-cover h-64 md:h-96 rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
          }}
        />
      </div>
    );
  }

  const images = pet.photoUrls;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div className="md:flex-shrink-0 md:w-1/3 relative">
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`${pet.name} ${currentIndex + 1}`}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
          }}
        />
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
          aria-label="Imagen anterior"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
          aria-label="Imagen siguiente"
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            aria-label={`Imagen ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export const PetDetailPage = () => {
  const { petId } = useParams<{ petId: string }>();
  const api = useApi();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { addToCart } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const { data: pet, isLoading, error } = useQuery({
    queryKey: ['pet', petId],
    queryFn: async () => {
      if (!petId) throw new Error("No Pet ID");
      const { data, error } = await api.GET("/pet/{petId}", {
        params: { path: { petId: Number(petId) } }
      });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedPet: Pet) => {
      const { data, error } = await api.PUT("/pet", {
        body: updatedPet
      });
      if (error) throw error;
      return data;
    },
     onSuccess: (data) => {
      queryClient.setQueryData(['pet', petId], data);
      setIsEditing(false);
      addToast("Mascota actualizada exitosamente", 'success');
    },
    onError: (error) => {
      console.error(error);
      addToast("Error al actualizar la mascota", 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
       const { error } = await api.DELETE("/pet/{petId}", {
         params: { path: { petId: Number(petId) } }
       });
       if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      addToast("Mascota eliminada exitosamente", 'success');
      navigate('/');
    },
    onError: (error) => {
      console.error(error);
      addToast("Error al eliminar la mascota", 'error');
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const { data, error } = await api.POST("/pet/{petId}/uploadImage", {
        params: { path: { petId: Number(petId) } },
        body: formData as unknown as { [key: string]: string | Blob }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet', petId] });
      setUploadFile(null);
      addToast("Imagen subida exitosamente", 'success');
    },
    onError: (error) => {
      console.error(error);
      addToast("Error al subir la imagen", 'error');
    }
  });

  if (isLoading) {
    return <Skeleton variant="detail" />;
  }
  if (error) {
    return (
      <div className="py-12 text-center">
        <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mascota no encontrada</h2>
        <p className="text-gray-500 mb-6">
          La mascota que buscas no existe o el ID no es válido.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    );
  }
  if (!pet) return <div>Mascota no encontrada</div>;

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Editar mascota: {pet.name}</h1>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancelar
          </button>
        </div>
        <PetForm 
          initialValues={pet} 
          onSubmit={(data) => updateMutation.mutate(data)} 
          isLoading={updateMutation.isPending}
          isEdit
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Volver al inicio
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          <PetImageCarousel pet={pet} />
          <div className="p-8 w-full">
            <div className="flex justify-between items-start">
              <div>
                <div className={clsx("uppercase tracking-wide text-sm font-semibold",
                  pet.status === 'available' ? 'text-green-600' :
                  pet.status === 'pending' ? 'text-amber-600' :
                  'text-red-600'
                )}>
                  {pet.status === 'available' ? 'Disponible' : pet.status === 'pending' ? 'Pendiente' : 'Vendido'}
                </div>
                <h1 className="block mt-1 text-3xl leading-tight font-bold text-black">{pet.name}</h1>
                <p className="mt-2 text-gray-500">Categoría: {pet.category?.name || 'Ninguna'}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <span className="text-3xl font-bold text-blue-600">£{getPetPrice(pet.id)}</span>
                  {pet.status === 'available' ? (
                    <button 
                      onClick={() => {
                        addToCart(pet);
                        addToast("Agregado al carrito", "success");
                      }}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center shadow-sm transition-all transform hover:scale-105"
                    >
                      <ShoppingCart size={20} className="mr-2" /> Agregar al carrito
                    </button>
                  ) : pet.status === 'pending' ? (
                    <button 
                      disabled
                      className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-lg cursor-not-allowed border border-yellow-200 flex items-center"
                    >
                      Pendiente
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="bg-red-100 text-red-800 px-6 py-2 rounded-lg cursor-not-allowed border border-red-200 flex items-center"
                    >
                      Vendido
                    </button>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                 <button 
                   onClick={() => setIsEditing(true)}
                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                 >
                   Editar
                 </button>
                 <button 
                   onClick={() => {
                     if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
                       deleteMutation.mutate();
                     }
                   }}
                   className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 flex items-center"
                 >
                   <Trash2 size={18} className="mr-2" /> Eliminar
                 </button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Etiquetas:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {pet.tags?.map((tag, index) => (
                  <span key={tag.id || `tag-${index}`} className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Subir imagen</h3>
              <div className="flex gap-4 items-center">
                <input 
                  type="file" 
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button 
                  onClick={() => uploadFile && uploadMutation.mutate(uploadFile)}
                  disabled={!uploadFile || uploadMutation.isPending}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center whitespace-nowrap"
                >
                  <Upload size={18} className="mr-2" /> 
                  {uploadMutation.isPending ? 'Subiendo...' : 'Subir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
