import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { components } from '../../../api/schema';
import { Trash2, Plus } from 'lucide-react';

type Pet = components["schemas"]["Pet"];

const petSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  status: z.enum(["available", "pending", "sold"]),
  category: z.object({
    id: z.number().optional(),
    name: z.string().optional()
  }).optional(),
  tags: z.array(z.object({
    id: z.number().optional(),
    name: z.string().optional()
  })).optional(),
  photoUrls: z.array(z.object({ value: z.string().min(1, "URL is required") })).min(1, "At least one photo URL is required")
});

type PetFormValues = z.infer<typeof petSchema>;

interface PetFormProps {
  initialValues?: Pet;
  onSubmit: (data: Pet) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const PetForm = ({ initialValues, onSubmit, isLoading, isEdit }: PetFormProps) => {
  const defaultValues: PetFormValues = {
    id: initialValues?.id,
    name: initialValues?.name || '',
    status: (initialValues?.status as "available" | "pending" | "sold") || 'available',
    category: initialValues?.category || { id: 0, name: '' },
    tags: initialValues?.tags || [],
    // Map string[] to object array for useFieldArray
    photoUrls: initialValues?.photoUrls?.map(url => ({ value: url })) || [{ value: '' }]
  };

  const { register, control, handleSubmit, formState: { errors } } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues
  });

  const { fields: photoFields, append: appendPhoto, remove: removePhoto } = useFieldArray({
    control,
    name: "photoUrls"
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: "tags"
  });

  const onFormSubmit = (data: PetFormValues) => {
    // Transform back to API format
    const apiData: Pet = {
      ...data,
      photoUrls: data.photoUrls.map(p => p.value),
      // Ensure IDs are numbers if provided
      category: data.category?.name ? { ...data.category, id: Number(data.category.id) } : undefined,
      tags: data.tags?.filter(t => t.name).map(t => ({ ...t, id: Number(t.id) }))
    };
    onSubmit(apiData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
          <input 
            type="number" 
            disabled 
            value={initialValues?.id} 
            className="mt-0 block w-full bg-gray-100 border border-gray-300 rounded-lg p-2.5"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input 
          {...register('name')}
          className="mt-0 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
        <select 
          {...register('status')}
          className="mt-0 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
        </select>
        {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-md font-medium text-gray-900 mb-2">Category</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <input 
              type="number"
              {...register('category.id', { valueAsNumber: true })}
              className="mt-0 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              {...register('category.name')}
              className="mt-0 block w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium text-gray-900">Photo URLs *</h3>
          <button 
            type="button" 
            onClick={() => appendPhoto({ value: '' })}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <Plus size={16} /> Add URL
          </button>
        </div>
        <div className="space-y-2">
          {photoFields.map((field, index) => (
            <div key={field.id} className="flex space-x-2">
              <input 
                {...register(`photoUrls.${index}.value`)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                type="button" 
                onClick={() => removePhoto(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {errors.photoUrls && <p className="text-red-500 text-sm">{errors.photoUrls.message}</p>}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium text-gray-900">Tags</h3>
          <button 
            type="button" 
            onClick={() => appendTag({ id: 0, name: '' })}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <Plus size={16} /> Add Tag
          </button>
        </div>
        <div className="space-y-2">
          {tagFields.map((field, index) => (
            <div key={field.id} className="flex space-x-2">
              <input 
                type="number"
                placeholder="ID"
                {...register(`tags.${index}.id`, { valueAsNumber: true })}
                className="w-20 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input 
                placeholder="Tag Name"
                {...register(`tags.${index}.name`)}
                className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                type="button" 
                onClick={() => removeTag(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-[44px]"
        >
          {isLoading ? 'Saving...' : (isEdit ? 'Update Pet' : 'Create Pet')}
        </button>
      </div>
    </form>
  );
};
