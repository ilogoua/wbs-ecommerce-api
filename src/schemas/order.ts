import { z } from 'zod';

const productOrderSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  userId: z.string().min(1),
  products: z.array(productOrderSchema).min(1),
});

export const updateOrderSchema = z.object({
  userId: z.string().min(1).optional(),
  products: z.array(productOrderSchema).min(1).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
