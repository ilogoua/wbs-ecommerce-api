import type { Request, Response } from 'express';
import { Category } from '../models/category.ts';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.ts';
import mongoose from 'mongoose';

export const getCategories = async (req: Request, res: Response) => {
  const categories = await Category.find();
  res.json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid category ID' });
    return;
  }

  const category = await Category.findById(id);

  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  res.json(category);
};

export const createCategory = async (req: Request, res: Response) => {
  const validation = createCategorySchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.issues });
    return;
  }

  const category = await Category.create(validation.data);
  res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid category ID' });
    return;
  }

  const validation = updateCategorySchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.issues });
    return;
  }

  const category = await Category.findByIdAndUpdate(id, validation.data, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid category ID' });
    return;
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  res.status(204).send();
};
