import type { Request, Response } from 'express';
import { Order } from '../models/order.ts';
import { User } from '../models/user.ts';
import { Product } from '../models/product.ts';
import { createOrderSchema, updateOrderSchema } from '../schemas/order.ts';
import mongoose from 'mongoose';

const calculateTotal = async (
  products: Array<{ productId: string; quantity: number }>
): Promise<number | null> => {
  let total = 0;

  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return null;
    }
    total += product.price * item.quantity;
  }

  return total;
};

export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find();
  res.json(orders);
};

export const getOrderById = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid order ID' });
    return;
  }

  const order = await Order.findById(id);

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.json(order);
};

export const createOrder = async (req: Request, res: Response) => {
  const validation = createOrderSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.issues });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(validation.data.userId)) {
    res.status(400).json({ error: 'Invalid userId' });
    return;
  }

  const user = await User.findById(validation.data.userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  for (const item of validation.data.products) {
    if (!mongoose.Types.ObjectId.isValid(item.productId)) {
      res.status(400).json({ error: 'Invalid productId' });
      return;
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
  }

  const total = await calculateTotal(validation.data.products);

  if (total === null) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const order = await Order.create({
    userId: new mongoose.Types.ObjectId(validation.data.userId),
    products: validation.data.products.map((item) => ({
      productId: new mongoose.Types.ObjectId(item.productId),
      quantity: item.quantity,
    })),
    total,
  });

  res.status(201).json(order);
};

export const updateOrder = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid order ID' });
    return;
  }

  const validation = updateOrderSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.issues });
    return;
  }

  const updateData: Record<string, unknown> = {};

  if (validation.data.userId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(validation.data.userId)) {
      res.status(400).json({ error: 'Invalid userId' });
      return;
    }

    const user = await User.findById(validation.data.userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    updateData.userId = new mongoose.Types.ObjectId(validation.data.userId);
  }

  if (validation.data.products !== undefined) {
    for (const item of validation.data.products) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        res.status(400).json({ error: 'Invalid productId' });
        return;
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
    }

    const total = await calculateTotal(validation.data.products);

    if (total === null) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    updateData.products = validation.data.products.map((item) => ({
      productId: new mongoose.Types.ObjectId(item.productId),
      quantity: item.quantity,
    }));
    updateData.total = total;
  }

  const order = await Order.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.json(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid order ID' });
    return;
  }

  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.status(204).send();
};
