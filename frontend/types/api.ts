// API Response Types

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Auth Types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

// User Types

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  avatar?: Avatar | null;
  profile?: Profile | null;
  roles?: string[];
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roles?: string[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  roles?: string[];
}

// Role Types

export interface Role {
  id: number;
  name: string;
  permissions?: string[];
  users_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleRequest {
  name: string;
  permissions?: string[];
}

export interface UpdateRoleRequest {
  name: string;
  permissions?: string[];
}

export interface SyncPermissionsRequest {
  permissions: string[];
}

export interface SyncRolesRequest {
  roles: string[];
}

// Permission Types

export interface Permission {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionGroup {
  [module: string]: {
    id: number;
    name: string;
    action: string;
  }[];
}

// Role Query Params
export interface RoleQueryParams {
  page?: number;
  per_page?: number;
  sort?: string;
  'filter[search]'?: string;
  'filter[name]'?: string;
}

export interface UpdateAuthUserRequest {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

// Profile Types

export interface Profile {
  id: number;
  bio: string | null;
  phone: string | null;
  address: Address | null;
  avatar: Avatar | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  bio?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  address?: AddressInput | null;
}

// Address Types

export interface Address {
  street: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
}

export interface AddressInput {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

// Avatar Types

export interface Avatar {
  original: string;
  thumb: string;
  preview: string;
}

// Query Params

export interface UserQueryParams {
  page?: number;
  per_page?: number;
  sort?: string;
  'filter[search]'?: string; // Global search across name and email
  'filter[name]'?: string;
  'filter[email]'?: string;
  'filter[status]'?: 'verified' | 'unverified' | '';
  'filter[created_from]'?: string;
  'filter[created_to]'?: string;
}

// Generic filter types for reusable components
export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange';
  placeholder?: string;
  options?: FilterOption[];
}
