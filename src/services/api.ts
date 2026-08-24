import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
// Extract the base URL without /api suffix for uploads
const BASE_URL = API_BASE_URL.replace(/\/api$/, '');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface Company {
  id: string;
  name: string;
  shortName: string;
  description: string;
  fullDescription: string;
  industry: string;
  established: number;
  website: string;
  features: string[];
  imageUrl?: string;
  catalogPdf?: string;
  phone?: string;
  hotline?: string;
  email?: string;
  faxNumber?: string;
  gallery?: string[];
  sequence?: number;
  socialLinks?: SocialLink[];
  googleMapsLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLink {
  name: string;
  url: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email?: string;
    role: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  role: string;
}

export interface Brand {
  id: number;
  name: string;
  logoUrl: string;
  website?: string;
  displayOrder: number;
  isActive: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: number | boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariation {
  id?: number;
  productId?: number;
  name: string;
  color?: string;
  size?: string;
  imageUrl?: string;
  price: number;
  wholesalePrice: number;
  isActive?: number | boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  longDescription?: string;
  imageUrl?: string;
  price: number;
  wholesalePrice: number;
  categoryId?: number | null;
  categoryName?: string;
  isVariable: number | boolean;
  isActive: number | boolean;
  variations?: ProductVariation[];
  createdAt?: string;
  updatedAt?: string;
}

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  verify: async (): Promise<{ valid: boolean; user: User }> => {
    const { data } = await api.get('/auth/verify');
    return data;
  },

  changePassword: async (passwordData: ChangePasswordData): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/change-password', passwordData);
    return data;
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },
};

// Companies API
export const companiesAPI = {
  getAll: async (): Promise<Company[]> => {
    const { data } = await api.get('/companies');
    return data;
  },

  getById: async (id: string): Promise<Company> => {
    const { data } = await api.get(`/companies/${id}`);
    return data;
  },

  create: async (companyData: FormData): Promise<Company> => {
    const { data } = await api.post('/companies', companyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  update: async (id: string, companyData: FormData): Promise<Company> => {
    const { data } = await api.put(`/companies/${id}`, companyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/companies/${id}`);
    return data;
  },
};

// Brands API
export const brandsAPI = {
  getAll: async (): Promise<Brand[]> => {
    const { data } = await api.get('/brands');
    return data;
  },

  getAllAdmin: async (): Promise<Brand[]> => {
    const { data } = await api.get('/brands/all');
    return data;
  },

  getById: async (id: number): Promise<Brand> => {
    const { data } = await api.get(`/brands/${id}`);
    return data;
  },

  create: async (brandData: FormData): Promise<Brand> => {
    const { data } = await api.post('/brands', brandData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  update: async (id: number, brandData: FormData): Promise<Brand> => {
    const { data } = await api.put(`/brands/${id}`, brandData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/brands/${id}`);
    return data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },

  getAllAdmin: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories/all');
    return data;
  },

  getById: async (id: number): Promise<Category> => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },

  create: async (categoryData: Partial<Category>): Promise<Category> => {
    const { data } = await api.post('/categories', categoryData);
    return data;
  },

  update: async (id: number, categoryData: Partial<Category>): Promise<Category> => {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (categoryId?: number): Promise<Product[]> => {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    const { data } = await api.get(`/products${query}`);
    return data;
  },

  getAllAdmin: async (): Promise<Product[]> => {
    const { data } = await api.get('/products/all');
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  create: async (productData: FormData): Promise<Product> => {
    const { data } = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  update: async (id: number, productData: FormData): Promise<Product> => {
    const { data } = await api.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};

// Utility function to extract error messages
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Check for response error message
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // Check for network errors
    if (error.message === 'Network Error') {
      return 'Unable to connect to server. Please check if the backend is running.';
    }
    // Return status text or generic message
    return error.response?.statusText || error.message || 'An unexpected error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Helper function to get the full URL for uploaded files
 * Handles both relative paths (/uploads/...) and absolute URLs
 */
export const getFileUrl = (path: string | undefined): string | null => {
  if (!path) return null;
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Otherwise, construct full URL with backend server
  return `${BASE_URL}${path}`;
};


export default api;
