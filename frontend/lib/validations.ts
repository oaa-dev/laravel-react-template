import { z } from 'zod';

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register form validation schema
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(255, 'Name must be less than 255 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .max(255, 'Email must be less than 255 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    password_confirmation: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Update user form validation schema
 */
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
  roles: z.array(z.string()).optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

/**
 * Create user form validation schema
 */
export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  roles: z.array(z.string()).optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

/**
 * Address validation schema
 */
export const addressSchema = z.object({
  street: z.string().max(255).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(20).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

/**
 * Update profile form validation schema
 */
export const updateProfileSchema = z.object({
  bio: z
    .string()
    .max(1000, 'Bio must be less than 1000 characters')
    .optional()
    .nullable(),
  phone: z
    .string()
    .max(20, 'Phone must be less than 20 characters')
    .optional()
    .nullable(),
  date_of_birth: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return date < new Date();
      },
      { message: 'Date of birth must be in the past' }
    ),
  gender: z
    .enum(['male', 'female', 'other'])
    .optional()
    .nullable(),
  address: addressSchema.optional().nullable(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

/**
 * Avatar upload validation
 */
export const avatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'File must be JPEG, PNG, or WebP'
    ),
});

export type AvatarFormData = z.infer<typeof avatarSchema>;

/**
 * Update account form validation schema
 */
export const updateAccountSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
});

export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;

/**
 * Create role form validation schema
 */
export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(255, 'Role name must be less than 255 characters')
    .regex(/^[a-z0-9-]+$/, 'Role name must be lowercase alphanumeric with dashes only'),
  permissions: z.array(z.string()).optional(),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;

/**
 * Update role form validation schema
 */
export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(255, 'Role name must be less than 255 characters')
    .regex(/^[a-z0-9-]+$/, 'Role name must be lowercase alphanumeric with dashes only'),
  permissions: z.array(z.string()).optional(),
});

export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;

/**
 * Sync roles form validation schema
 */
export const syncRolesSchema = z.object({
  roles: z.array(z.string()).min(1, 'At least one role is required'),
});

export type SyncRolesFormData = z.infer<typeof syncRolesSchema>;
