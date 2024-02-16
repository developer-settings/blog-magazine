import { z } from 'zod';

export const userSchema = z.object({
  first_name: z
    .string({ required_error: 'First name is required' })
    .min(3, { message: 'First name must be at least 3 characters long' })
    .max(50, { message: 'First name must be at most 50 characters long' }),

  last_name: z
    .string({ required_error: 'Last name is required' })
    .min(3, { message: 'Last name must be at least 3 characters long' })
    .max(50, { message: 'Last name must be at most 50 characters long' }),

  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email' }),

  hashed_password: z
    .string({ required_error: 'Password is required' })
    .min(10, { message: 'Password must be at least 10 characters long' })
    .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/, {
      message:
        'Password must contain at least one number, one lowercase letter, and one uppercase letter.',
    }),
});

export const validateUser = z.object({
  email: z.string({ required_error: 'Email is required' }).email(),
  hashed_password: z.string({ required_error: 'Password is required' }),
});

export const categorySchema = z.object({
  name: z
    .string({ required_error: 'Category Name is required' })
    .min(3, {
      message: 'Category Name must be at least 3 characters long',
    })
    .max(50, { message: 'Category Name must be at most 50 characters long' }),
});

export const postSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(255, { message: 'Title must be at most 100 characters long' }),

  content: z
    .string({ required_error: 'Content is required' })
    .min(10, { message: 'Content must be at least 10 characters long' }),

  category_id: z.string({ required_error: 'Category is required' }),

  post_image: z.string({ required_error: 'Image is required' }).optional(),

  user_id: z.string({ required_error: 'User is required' }),
});
