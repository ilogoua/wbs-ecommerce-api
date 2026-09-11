import type { Request, Response } from 'express';
import { Product } from '../models/product.ts';
import { Category } from '../models/category.ts';
import { createProductSchema, updateProductSchema } from '../schemas/product.ts';
import mongoose from 'mongoose';

export const getProducts = async (req: Request, res: Response) => {
  const { categoryId } = req.query;

  const filter: Record<string, unknown> = {};

  if (categoryId) {
    const categoryIdStr = categoryId as string;

    if (!mongoose.Types.ObjectId.isValid(categoryIdStr)) {
      res.status(400).json({ error: 'Invalid categoryId' });
      return;
    }

    filter.categoryId = new mongoose.Types.ObjectId(categoryIdStr);
  }

  const products = await Product.find(filter);
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid product ID' });
    return;
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const validation = createProductSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.issues });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(validation.data.categoryId)) {
    res.status(400).json({ error: 'Invalid categoryId' });
    return;
  }

  const category = await Category.findById(validation.data.categoryId);

  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  const product = await Product.create({
    name: validation.data.name,
    description: validation.data.description,
    price: validation.data.price,
    categoryId: new mongoose.Types.ObjectId(validation.data.categoryId),
  });

  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid product ID' });
    return;
  }

  const validation = updateProductSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.issues });
    return;
  }

  const updateData: Record<string, unknown> = {};

  if (validation.data.name !== undefined) updateData.name = validation.data.name;
  if (validation.data.description !== undefined)
    updateData.description = validation.data.description;
  if (validation.data.price !== undefined) updateData.price = validation.data.price;

  if (validation.data.categoryId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(validation.data.categoryId)) {
      res.status(400).json({ error: 'Invalid categoryId' });
      return;
    }

    const category = await Category.findById(validation.data.categoryId);

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    updateData.categoryId = new mongoose.Types.ObjectId(validation.data.categoryId);
  }

  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid product ID' });
    return;
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.status(204).send();
};
