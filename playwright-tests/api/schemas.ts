import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
}).optional();

export const TagSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
}).optional();

export const PetSchema = z.object({
  id: z.number().optional(),
  category: CategorySchema,
  name: z.string(),
  photoUrls: z.array(z.string()),
  tags: z.array(TagSchema).optional(),
  status: z.enum(['available', 'pending', 'sold']).optional(),
});

export const PetListSchema = z.array(PetSchema);

export const OrderSchema = z.object({
    id: z.number().optional(),
    petId: z.number().optional(),
    quantity: z.number().optional(),
    shipDate: z.string().optional(),
    status: z.enum(['placed', 'approved', 'delivered']).optional(),
    complete: z.boolean().optional(),
});
