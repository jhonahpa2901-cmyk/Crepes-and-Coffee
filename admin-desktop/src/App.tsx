import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configuración de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Configurar interceptor para incluir token en todas las requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agregar estilos CSS globales
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

// Insertar estilos en el head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}

// Tipos de datos
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description?: string;
}

interface Order {
  id: number;
  user_id: number;
  status: string;
  total: number;
  metodo_pago?: string;
  direccion_entrega?: string;
  telefono?: string;
  notas?: string;
  created_at: string;
  user?: User;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    notas?: string;
  }>;
}

// Contexto de autenticación
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      axios.get(`${API_BASE_URL}/admin/me`)
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('admin_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('admin_token', token);
      setUser(user);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  return { user, login, logout, loading };
};

const App: React.FC = () => {
  const { user, login, logout, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalPedidos: 0,
    ingresosTotales: 0,
    totalUsuarios: 0,
    totalProductos: 0,
    recentOrders: [] as any[]
  });

  // Estados para modales
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Estados para manejo de imágenes
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      loadDashboardData();
      loadProducts();
      loadOrders();
      loadUsers();
    }
  }, [user]);

  // Función para mostrar notificación
  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Función para actualizar todos los datos
  const refreshAllData = async (showMessage = true) => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadDashboardData(),
        loadProducts(),
        loadOrders(),
        loadUsers()
      ]);
      if (showMessage) {
        showSuccessNotification('✅ Todos los datos actualizados correctamente');
      }
    } catch (error) {
      console.error('Error actualizando datos:', error);
      if (showMessage) {
        alert('Error al actualizar los datos');
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Función para alternar auto-actualización
  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      // Desactivar auto-actualización
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        setAutoRefreshInterval(null);
      }
      setAutoRefresh(false);
      showSuccessNotification('🔄 Auto-actualización desactivada');
    } else {
      // Activar auto-actualización cada 30 segundos
      const interval = setInterval(() => {
        refreshAllData(false);
      }, 30000);
      setAutoRefreshInterval(interval);
      setAutoRefresh(true);
      showSuccessNotification('🔄 Auto-actualización activada (cada 30s)');
    }
  };

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
      }
    };
  }, [autoRefreshInterval]);

  // Funciones de carga de datos desde la API
  const loadDashboardData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`);
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/products`);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/orders`);
      console.log('Pedidos cargados:', response.data); // Debug
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    }
  };

  // Función para obtener color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregado':
        return '#10b981'; // Verde
      case 'confirmado':
      case 'preparando':
      case 'listo':
        return '#f59e0b'; // Amarillo
      case 'cancelado':
        return '#ef4444'; // Rojo
      default:
        return '#6b7280'; // Gris
    }
  };

  // Función para obtener texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente':
        return '⏳ Pendiente';
      case 'confirmado':
        return '✅ Confirmado';
      case 'preparando':
        return '👨‍🍳 Preparando';
      case 'listo':
        return '📦 Listo';
      case 'entregado':
        return '🚚 Entregado';
      case 'cancelado':
        return '❌ Cancelado';
      default:
        return status;
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  // Función para manejar selección de archivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Crear URL de preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir imagen
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_BASE_URL}/admin/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.image_url;
  };

  // Funciones CRUD para productos
  const saveProduct = async (productData: any) => {
    try {
      let finalProductData = { ...productData };

      // Si hay una imagen seleccionada, subirla primero
      if (selectedFile) {
        setUploading(true);
        try {
          const imageUrl = await uploadImage(selectedFile);
          finalProductData.image_url = imageUrl;
        } catch (uploadError) {
          console.error('Error subiendo imagen:', uploadError);
          alert('Error al subir la imagen');
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      if (editingProduct) {
        await axios.put(`${API_BASE_URL}/admin/products/${editingProduct.id}`, finalProductData);
      } else {
        await axios.post(`${API_BASE_URL}/admin/products`, finalProductData);
      }

      await loadProducts();
      setShowProductModal(false);
      setEditingProduct(null);
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const deleteProduct = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/products/${id}`);
        await loadProducts();
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  // Modal de producto
  const ProductModal = () => {
    const [formData, setFormData] = useState({
      name: editingProduct?.name || '',
      price: editingProduct?.price || 0,
      category: editingProduct?.category || '',
      stock: editingProduct?.stock || 0,
      image: editingProduct?.image || '',
      description: editingProduct?.description || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      saveProduct(formData);
    };

    if (!showProductModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: '#374151',
          padding: '2rem',
          borderRadius: '0.5rem',
          width: '90%',
          maxWidth: '500px',
          color: 'white'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#60a5fa' }}>
            {editingProduct ? '✏️ Editar Producto' : '➕ Agregar Producto'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1d5db' }}>Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#4b5563',
                  border: '1px solid #6b7280',
                  borderRadius: '0.25rem',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1d5db' }}>Precio</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#4b5563',
                  border: '1px solid #6b7280',
                  borderRadius: '0.25rem',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1d5db' }}>Categoría</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#4b5563',
                  border: '1px solid #6b7280',
                  borderRadius: '0.25rem',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1d5db' }}>Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#4b5563',
                  border: '1px solid #6b7280',
                  borderRadius: '0.25rem',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1d5db' }}>Imagen del Producto</label>

              {/* Preview de imagen actual o seleccionada */}
              {(previewUrl || formData.image) && (
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  <img
                    src={previewUrl || formData.image}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '150px',
                      borderRadius: '8px',
                      border: '2px solid #6b7280'
                    }}
                  />
                </div>
              )}

              {/* Campo para subir archivo */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#4b5563',
                  border: '1px solid #6b7280',
                  borderRadius: '0.25rem',
                  color: 'white',
                  marginBottom: '0.5rem'
                }}
              />

              {/* Campo alternativo para URL */}
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#4b5563',
                  border: '1px solid #6b7280',
                  borderRadius: '0.25rem',
                  color: 'white'
                }}
                placeholder="O ingresa una URL de imagen"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                  setSelectedFile(null);
                  setPreviewUrl('');
                }}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={uploading}
                style={{
                  backgroundColor: uploading ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  cursor: uploading ? 'not-allowed' : 'pointer'
                }}
              >
                {uploading ? '⏳ Subiendo...' : (editingProduct ? 'Actualizar' : 'Agregar')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Componente de Login
  const Login = () => {
    const [email, setEmail] = useState('admin@crepesandcoffee.com');
    const [password, setPassword] = useState('admin123');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginLoading(true);
      setLoginError('');

      const result = await login(email, password);

      if (!result.success) {
        setLoginError(result.message || 'Error de login');
      }

      setLoginLoading(false);
    };

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              🖥️ Panel de Administración
            </h1>
            <p style={{ color: '#6b7280' }}>Crepes & Coffee - Módulo de Escritorio</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 'medium',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                📧 Email de Administrador
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="admin@crepesandcoffee.com"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 'medium',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                🔒 Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Ingresa tu contraseña"
              />
            </div>

            {loginError && (
              <div style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                ❌ {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                width: '100%',
                background: loginLoading ? '#9ca3af' : '#1f2937',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 'medium',
                cursor: loginLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loginLoading ? '⏳ Iniciando sesión...' : '🚀 Acceder al Panel'}
            </button>
          </form>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#f3f4f6',
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            <p><strong>🔐 Acceso Exclusivo para Administradores</strong></p>
            <p>Este módulo de escritorio está restringido únicamente para usuarios con permisos de administrador.</p>
          </div>
        </div>
      </div>
    );
  };

  // Layout principal
  const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1f2937', fontFamily: 'Arial, sans-serif' }}>
        {/* Sidebar */}
        <div style={{ width: '250px', backgroundColor: '#374151', padding: '1.5rem' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{ color: '#60a5fa', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>🖥️ Admin Panel</h1>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Crepes & Coffee</p>
          </div>

          <nav style={{ marginBottom: '2rem' }}>
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'products', label: '🛍️ Productos', icon: '🛍️' },
              { id: 'orders', label: '📦 Pedidos', icon: '📦' },
              { id: 'users', label: '👥 Usuarios', icon: '👥' },
              { id: 'settings', label: '⚙️ Configuración', icon: '⚙️' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  backgroundColor: currentPage === item.id ? '#4b5563' : 'transparent',
                  color: currentPage === item.id ? '#60a5fa' : '#d1d5db',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          <div style={{ borderTop: '1px solid #4b5563', paddingTop: '1rem' }}>
            <div style={{ color: 'white', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 'bold' }}>Administrador</div>
              <div style={{ color: '#9ca3af' }}>{user?.email || 'N/A'}</div>
            </div>
            <button
              onClick={logout}
              style={{
                width: '100%',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div style={{ flex: 1, padding: '2rem' }}>
          {children}
        </div>
      </div>
    );
  };

  // Renderizar página actual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ color: 'white', margin: 0 }}>📊 Dashboard</h1>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {/* Indicador de auto-actualización */}
                {autoRefresh && (
                  <div style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}></span>
                    Auto-actualización ON
                  </div>
                )}

                <button
                  onClick={toggleAutoRefresh}
                  style={{
                    backgroundColor: autoRefresh ? '#ef4444' : '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 'medium'
                  }}
                >
                  {autoRefresh ? '⏸️ Pausar Auto' : '▶️ Auto 30s'}
                </button>

                <button
                  onClick={() => refreshAllData()}
                  disabled={refreshing}
                  style={{
                    backgroundColor: refreshing ? '#6b7280' : '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.375rem',
                    cursor: refreshing ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 'medium',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {refreshing ? (
                    <>
                      <span style={{
                        display: 'inline-block',
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></span>
                      Actualizando...
                    </>
                  ) : (
                    <>🔄 Actualizar Todo</>
                  )}
                </button>
              </div>
            </div>

            {/* Estadísticas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#374151', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#60a5fa' }}>📦 Total Pedidos</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'white' }}>{dashboardStats.totalPedidos}</p>
              </div>

              <div style={{ backgroundColor: '#374151', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#34d399' }}>🛍️ Productos</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'white' }}>{dashboardStats.totalProductos}</p>
              </div>

              <div style={{ backgroundColor: '#374151', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#a78bfa' }}>👥 Usuarios</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'white' }}>{dashboardStats.totalUsuarios}</p>
              </div>

              <div style={{ backgroundColor: '#374151', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24' }}>💰 Ingresos</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
                  S/. {dashboardStats.ingresosTotales.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Pedidos recientes */}
            <div style={{ backgroundColor: '#374151', padding: '1.5rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, color: '#60a5fa' }}>📋 Pedidos Recientes</h2>
                <button
                  onClick={async () => {
                    try {
                      await Promise.all([loadDashboardData(), loadOrders()]);
                      showSuccessNotification('✅ Dashboard actualizado');
                    } catch (error) {
                      alert('Error al actualizar el dashboard');
                    }
                  }}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 'medium',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  🔄 Actualizar
                </button>
              </div>
              {dashboardStats.recentOrders.length > 0 ? (
                dashboardStats.recentOrders.map((order: any, index: number) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 0',
                    borderBottom: index < dashboardStats.recentOrders.length - 1 ? '1px solid #4b5563' : 'none'
                  }}>
                    <div>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: 'white' }}>Pedido #{order.id}</p>
                      <p style={{ margin: 0, color: '#9ca3af' }}>{order.user?.name || 'N/A'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#34d399' }}>S/. {order.total}</p>
                      <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem' }}>{order.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#9ca3af' }}>No hay pedidos recientes</p>
              )}
            </div>
          </div>
        );

      case 'products':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ color: 'white', margin: 0 }}>🛍️ Gestión de Productos</h1>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={async () => {
                    try {
                      await loadProducts();
                      showSuccessNotification('✅ Productos actualizados');
                    } catch (error) {
                      alert('Error al actualizar productos');
                    }
                  }}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 'medium',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  🔄 Actualizar
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setSelectedFile(null);
                    setPreviewUrl('');
                    setShowProductModal(true);
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 'medium'
                  }}
                >
                  ➕ Agregar Producto
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: '#374151', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 2fr',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#4b5563',
                fontWeight: 'bold',
                color: '#d1d5db'
              }}>
                <div>Imagen</div>
                <div>Nombre</div>
                <div>Precio</div>
                <div>Categoría</div>
                <div>Stock</div>
                <div>Acciones</div>
              </div>

              {products.map(product => (
                <div key={product.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 2fr',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: '1px solid #4b5563',
                  alignItems: 'center'
                }}>
                  <div>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNGI1NTYzIi8+Cjx0ZXh0IHg9IjIwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5OIPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>{product.name}</div>
                  <div style={{ color: '#34d399', fontWeight: 'bold' }}>S/. {product.price.toFixed(2)}</div>
                  <div style={{ color: '#9ca3af' }}>{product.category}</div>
                  <div style={{ color: product.stock > 10 ? '#34d399' : '#ef4444', fontWeight: 'bold' }}>{product.stock}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setSelectedFile(null);
                        setPreviewUrl('');
                        setShowProductModal(true);
                      }}
                      style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <ProductModal />
          </div>
        );

      case 'orders':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ color: 'white', margin: 0 }}>📦 Gestión de Pedidos</h1>
              <button
                onClick={async () => {
                  try {
                    await loadOrders();
                    showSuccessNotification('✅ Pedidos actualizados');
                  } catch (error) {
                    alert('Error al actualizar pedidos');
                  }
                }}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 'medium',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                🔄 Actualizar Pedidos
              </button>
            </div>

            <div style={{ backgroundColor: '#374151', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr 2fr',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#4b5563',
                fontWeight: 'bold',
                color: '#d1d5db'
              }}>
                <div>ID</div>
                <div>Cliente</div>
                <div>Total</div>
                <div>Estado</div>
                <div>Pago</div>
                <div>Fecha</div>
                <div>Acciones</div>
              </div>

              {orders.map(order => (
                <div key={order.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr 2fr',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: '1px solid #4b5563',
                  alignItems: 'center'
                }}>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>#{order.id}</div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 'bold' }}>{order.user?.name || 'N/A'}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{order.user?.email || 'N/A'}</div>
                  </div>
                  <div style={{ color: '#34d399', fontWeight: 'bold' }}>S/. {order.total.toFixed(2)}</div>
                  <div>
                    <span style={{
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div>
                    {order.metodo_pago === 'contra_entrega' ? (
                      <span style={{
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.65rem'
                      }}>
                        💵 Contra Entrega
                      </span>
                    ) : (
                      <span style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.65rem'
                      }}>
                        💳 Mercado Pago
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{order.created_at}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => alert(`Ver detalles del pedido #${order.id}`)}
                      style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      👁️ Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            <h1 style={{ color: 'white', marginBottom: '2rem' }}>👥 Gestión de Usuarios</h1>

            <div style={{ backgroundColor: '#374151', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 1fr 2fr',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#4b5563',
                fontWeight: 'bold',
                color: '#d1d5db'
              }}>
                <div>ID</div>
                <div>Nombre</div>
                <div>Email</div>
                <div>Rol</div>
                <div>Acciones</div>
              </div>

              {users.map(user => (
                <div key={user.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr 1fr 2fr',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: '1px solid #4b5563',
                  alignItems: 'center'
                }}>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>{user.id}</div>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>{user.name}</div>
                  <div style={{ color: '#9ca3af' }}>{user.email}</div>
                  <div>
                    <span style={{
                      backgroundColor: user.role === 'admin' ? '#8b5cf6' : '#10b981',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {user.role}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => alert(`Editar usuario: ${user.name}`)}
                      style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar el usuario "${user.name}"?`)) {
                          alert('Usuario eliminado (función a implementar)');
                        }
                      }}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <h1 style={{ color: 'white', marginBottom: '2rem' }}>⚙️ Configuración del Sistema</h1>

            <div style={{ display: 'grid', gap: '2rem' }}>
              <div style={{ backgroundColor: '#374151', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ color: '#60a5fa', marginTop: 0 }}>🏪 Configuración de la Tienda</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ color: '#d1d5db', display: 'block', marginBottom: '0.5rem' }}>Nombre de la Tienda</label>
                    <input
                      type="text"
                      defaultValue="Crepes & Coffee"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: '#4b5563',
                        border: '1px solid #6b7280',
                        borderRadius: '0.25rem',
                        color: 'white'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#d1d5db', display: 'block', marginBottom: '0.5rem' }}>Email de Contacto</label>
                    <input
                      type="email"
                      defaultValue="admin@crepesandcoffee.com"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: '#4b5563',
                        border: '1px solid #6b7280',
                        borderRadius: '0.25rem',
                        color: 'white'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#374151', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ color: '#34d399', marginTop: 0 }}>💳 Configuración de Pagos</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ color: '#d1d5db', display: 'block', marginBottom: '0.5rem' }}>Mercado Pago Access Token</label>
                    <input
                      type="password"
                      placeholder="TEST-your-access-token"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: '#4b5563',
                        border: '1px solid #6b7280',
                        borderRadius: '0.25rem',
                        color: 'white'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => alert('Configuración guardada (función a implementar)')}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'medium'
                  }}
                >
                  💾 Guardar Configuración
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div style={{ color: 'white' }}>Página en desarrollo...</div>;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#1f2937',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        ⏳ Cargando aplicación de escritorio...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      {renderCurrentPage()}

      {/* Notificación de éxito */}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out',
          fontSize: '0.875rem',
          fontWeight: 'medium'
        }}>
          {notificationMessage}
        </div>
      )}
    </Layout>
  );
};

export default App; 