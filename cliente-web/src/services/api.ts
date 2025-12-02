import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Producto, 
  Categoria, 
  Pedido, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  ApiResponse 
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar el token de autenticación
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Autenticación
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/register', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/logout');
  }

  async getMe(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/me');
    return response.data;
  }

  // Categorías
  async getCategorias(): Promise<Categoria[]> {
    const response: AxiosResponse<Categoria[]> = await this.api.get('/categorias');
    return response.data;
  }

  async getCategoria(id: number): Promise<Categoria> {
    const response: AxiosResponse<Categoria> = await this.api.get(`/categorias/${id}`);
    return response.data;
  }

  // Productos
  async getProductos(): Promise<Producto[]> {
    const response: AxiosResponse<Producto[]> = await this.api.get('/productos');
    return response.data;
  }

  async getProducto(id: number): Promise<Producto> {
    const response: AxiosResponse<Producto> = await this.api.get(`/productos/${id}`);
    return response.data;
  }

  // Pedidos
  async getMisPedidos(): Promise<Pedido[]> {
    const response: AxiosResponse<Pedido[]> = await this.api.get('/mis-pedidos');
    return response.data;
  }

  async getPedido(id: number): Promise<Pedido> {
    const response: AxiosResponse<Pedido> = await this.api.get(`/pedidos/${id}`);
    return response.data;
  }

  async crearPedido(data: {
    total: number;
    direccion_entrega?: string;
    telefono?: string;
    notas?: string;
    metodo_pago?: string;
    productos: Array<{
      producto_id: number;
      cantidad: number;
      notas?: string;
    }>;
  }): Promise<{message: string; pedido: Pedido; metodo_pago: string}> {
    const response: AxiosResponse<{message: string; pedido: Pedido; metodo_pago: string}> = await this.api.post('/pedidos', data);
    return response.data;
  }

  // Pagos
  async crearPreferenciaPago(pedidoId: number): Promise<{
    init_point: string;
    preference_id: string;
  }> {
    const response: AxiosResponse<{
      init_point: string;
      preference_id: string;
    }> = await this.api.post('/pagos/crear-preferencia', { pedido_id: pedidoId });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 