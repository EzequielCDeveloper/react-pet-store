import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useApi } from '../../api/client';
import { PetForm } from './components/PetForm';
import type { components } from '../../api/schema';
import { queryClient } from '../../lib/query-client';
import { useState } from 'react';
import { Trash2, Upload, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useCart } from '../../hooks/useCart';
import { getPetImage, getPetPrice } from '../../lib/pet-utils';

type Pet = components["schemas"]["Pet"];

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
      addToast("Pet updated successfully", 'success');
    },
    onError: (error) => {
      console.error(error);
      addToast("Failed to update pet", 'error');
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
      addToast("Pet deleted successfully", 'success');
      navigate('/');
    },
    onError: (error) => {
      console.error(error);
      addToast("Failed to delete pet", 'error');
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
      addToast("Image uploaded successfully", 'success');
    },
    onError: (error) => {
      console.error(error);
      addToast("Image upload failed", 'error');
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pet Not Found</h2>
        <p className="text-gray-600 mb-6">
          The pet you are looking for does not exist or the ID is invalid.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }
  if (!pet) return <div>Pet not found</div>;

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Pet: {pet.name}</h1>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
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
        Back to Home
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/3 bg-gray-200">
             <img 
               src={getPetImage(pet.id)} 
               alt={pet.name} 
               className="h-full w-full object-cover"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
               }}
             />
          </div>
          <div className="p-8 w-full">
            <div className="flex justify-between items-start">
              <div>
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{pet.status}</div>
                <h1 className="block mt-1 text-3xl leading-tight font-bold text-black">{pet.name}</h1>
                <p className="mt-2 text-gray-500">Category: {pet.category?.name || 'None'}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <span className="text-3xl font-bold text-blue-600">£{getPetPrice(pet.id)}</span>
                  {pet.status === 'available' ? (
                    <button 
                      onClick={() => {
                        addToCart(pet);
                        addToast("Added to cart", "success");
                      }}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center shadow-sm transition-all transform hover:scale-105"
                    >
                      <ShoppingCart size={20} className="mr-2" /> Add to Cart
                    </button>
                  ) : pet.status === 'pending' ? (
                    <button 
                      disabled
                      className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-lg cursor-not-allowed border border-yellow-200 flex items-center"
                    >
                      Pending
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="bg-red-100 text-red-800 px-6 py-2 rounded-lg cursor-not-allowed border border-red-200 flex items-center"
                    >
                      Sold
                    </button>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                 <button 
                   onClick={() => setIsEditing(true)}
                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                 >
                   Edit
                 </button>
                 <button 
                   onClick={() => {
                     if (window.confirm('Are you sure you want to delete this pet?')) {
                       deleteMutation.mutate();
                     }
                   }}
                   className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 flex items-center"
                 >
                   <Trash2 size={18} className="mr-2" /> Delete
                 </button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Tags:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {pet.tags?.map((tag, index) => (
                  <span key={tag.id || `tag-${index}`} className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Upload Image</h3>
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
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
