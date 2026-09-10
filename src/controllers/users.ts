import type { Request, Response } from 'express';
import { User } from '../models/user.ts';
import { createUserSchema, updateUserSchema } from '../schemas/user.ts';
import mongoose from 'mongoose';

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  const user = await User.findById(id).select('-password');

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const validation = createUserSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.issues });
    return;
  }

  try {
    const user = await User.create(validation.data);
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    res.status(201).json(userResponse);
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      throw error;
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  const validation = updateUserSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.issues });
    return;
  }

  try {
    const user = await User.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      throw error;
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(204).send();
};
