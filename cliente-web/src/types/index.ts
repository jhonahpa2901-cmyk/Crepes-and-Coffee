export interface User {
  id: number;
  name: string;
  email: string;
  rol: 'admin' | 'cliente';
  telefono?: string;
  direccion?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  activo: boolean;
  productos_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  categoria_id: number;
  disponible: boolean;
  destacado: boolean;
  stock: number;
  categoria?: Categoria;
  created_at: string;
  updated_at: string;
}

export interface DetallePedido {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  notas?: string;
  producto?: Producto;
  created_at: string;
  updated_at: string;
}

export interface Pedido {
  id: number;
  usuario_id: number;
  total: number;
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
  direccion_entrega?: string;
  telefono?: string;
  notas?: string;
  mercadopago_payment_id?: string;
  mercadopago_preference_id?: string;
  usuario?: User;
  detalle_pedidos?: DetallePedido[];
  created_at: string;
  updated_at: string;
}

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  notas?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  telefono?: string;
  direccion?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
} 