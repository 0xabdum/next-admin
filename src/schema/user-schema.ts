import { z } from 'zod';
const passwordSchema = z
  .string()
  .min(8, 'Min. 8 characters, and Max. 50 characters')
  .max(50, 'Min. 8 characters, and Max. 50 characters')
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/[a-z]/, 'At least one lowercase letter')
  .regex(/[0-9]/, 'Must include numbers, punctuation, or symbols')
  .regex(
    /[\W_]/,
    'Must include numbers, punctuation, or symbols (e.g. !, @, #, $)'
  )
  .optional();

// Base schema
export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  firstName: z
    .string()
    .min(3, 'Must be at least 3 characters long')
    .max(50, 'Must be at most 50 characters long'),
  lastName: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
});

// CreateUser DTO (e.g., for registration)
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})
  .extend({
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password and confirm password do not match',
  });

// UpdateUser DTO (all fields optional)
export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Public response (omit password)
export const UserResponseSchema = UserSchema.omit({
  password: true,
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
