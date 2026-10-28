export interface User {
  id: number;
  userId?: number;
  name: string;
  lastName?: string;
  phone?: string;
  email: string;
  role: 'SUPER_ADMIN' | 'BUSINESS_ADMIN' | 'CLIENT' | string;
  roles?: string[];
  isActive?: boolean;
  createAt?: string;
}
