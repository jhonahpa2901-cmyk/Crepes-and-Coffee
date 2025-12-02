import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../contexts/CarritoContext';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface PaymentMethod {
  id: number;
  name: string;
  type: string;
  active: boolean;
  phone?: string;
  account_name?: string;
  qr_image?: string;
  instructions?: string;
}

const Checkout: React.FC = () => {
  const { items, getTotal, clearCart } = useCarrito();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [formData, setFormData] = useState({
    direccion_entrega: user?.direccion || '',
    telefono: user?.telefono || '',
    notas: '',
    metodo_pago: '', // Vacío hasta que cargue los métodos
  });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment-methods/active`);
      setPaymentMethods(response.data);
      // Establecer el primer método activo como seleccionado por defecto
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, metodo_pago: response.data[0].name }));
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      // Fallback a contra entrega si falla
      setPaymentMethods([{
        id: 1,
        name: 'Contra Entrega',
        type: 'cash',
        active: true,
        instructions: 'Paga en efectivo cuando recibas tu pedido'
      }]);
      setFormData(prev => ({ ...prev, metodo_pago: 'Contra Entrega' }));
    } finally {
      setLoadingMethods(false);
    }
  };

  const getImageUrl = (path: string | undefined) => {
    if (!path) return '';
    // Si la ruta ya es absoluta (http/https), retornarla tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Si es una ruta relativa, construir URL completa
    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}${path}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear el pedido
      const pedidoData = {
        total: getTotal(),
        direccion_entrega: formData.direccion_entrega,
        telefono: formData.telefono,
        notas: formData.notas,
        metodo_pago: formData.metodo_pago,
        productos: items.map(item => ({
          producto_id: item.producto.id,
          cantidad: item.cantidad,
          notas: item.notas,
        })),
      };

      const response = await apiService.crearPedido(pedidoData);

      // Obtener el método de pago para determinar qué hacer después
      const selectedMethod = paymentMethods.find(m => m.name === formData.metodo_pago);

      // Limpiar carrito en todos los casos
      clearCart();

      // Determinar acción según tipo de método de pago
      if (selectedMethod) {
        if (selectedMethod.type === 'online') {
          // Métodos online (Mercado Pago): crear preferencia y redirigir
          try {
            const { init_point } = await apiService.crearPreferenciaPago(response.pedido.id);
            // Redirigir a Mercado Pago
            window.location.href = init_point;
          } catch (mpError) {
            console.error('Error creating Mercado Pago preference:', mpError);
            alert('Error al procesar el pago. El pedido fue creado, pero necesitas completar el pago manualmente.');
            navigate('/pedido-confirmado');
          }
        } else if (selectedMethod.type === 'digital') {
          // Métodos digitales (Yape, Plin): mostrar mensaje y redirigir a confirmación
          alert(`Pedido creado exitosamente. Por favor, envía el comprobante de pago de ${selectedMethod.name} al WhatsApp del negocio.`);
          navigate('/pedido-confirmado');
        } else if (selectedMethod.type === 'cash') {
          // Métodos en efectivo (Contra Entrega): redirigir directamente
          navigate('/pedido-confirmado');
        }
      } else {
        // Fallback: redirigir a confirmación
        alert('Pedido creado exitosamente');
        navigate('/pedido-confirmado');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar el pedido. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Carrito vacío</h2>
          <p className="text-gray-600 mb-6">Agrega productos para continuar con el pedido</p>
          <button
            onClick={() => navigate('/productos')}
            className="bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.producto.id} className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.producto.nombre}</h3>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.cantidad} × {formatPrice(item.producto.precio)}
                    </p>
                    {item.notas && (
                      <p className="text-xs text-gray-500 mt-1">Nota: {item.notas}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatPrice(item.producto.precio * item.cantidad)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Entrega</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="direccion_entrega" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de entrega
                </label>
                <input
                  type="text"
                  id="direccion_entrega"
                  name="direccion_entrega"
                  value={formData.direccion_entrega}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tu dirección completa"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de contacto
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+51 999 999 999"
                />
              </div>

              <div>
                <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-2">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  id="notas"
                  name="notas"
                  value={formData.notas}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Instrucciones especiales para la entrega..."
                />
              </div>

              {/* Método de Pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Método de Pago
                </label>
                {loadingMethods ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => {
                      const isSelected = formData.metodo_pago === method.name;
                      const methodIcon = method.name === 'Yape' ? '💸' :
                        method.name === 'Plin' ? '💳' : '💵';

                      return (
                        <div key={method.id} className="border rounded-lg p-4">
                          <div className="flex items-center">
                            <input
                              id={`method_${method.id}`}
                              name="metodo_pago"
                              type="radio"
                              value={method.name}
                              checked={isSelected}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                            <label htmlFor={`method_${method.id}`} className="ml-3 flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {methodIcon} {method.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {method.instructions}
                              </div>
                            </label>
                          </div>

                          {/* Mostrar QR si es un método digital y está seleccionado */}
                          {isSelected && method.type === 'digital' && method.qr_image && (
                            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-900 mb-2">
                                  Escanea este código QR con tu app de {method.name}
                                </p>
                                <img
                                  src={getImageUrl(method.qr_image)}
                                  alt={`QR ${method.name}`}
                                  className="w-64 h-64 mx-auto object-contain border-2 border-purple-300 rounded-lg"
                                  onError={(e) => {
                                    console.error('Error loading QR image:', method.qr_image);
                                    console.error('Full URL:', getImageUrl(method.qr_image));
                                  }}
                                />
                                {method.phone && (
                                  <p className="text-sm text-gray-700 mt-3">
                                    📱 Número: <span className="font-semibold">{method.phone}</span>
                                  </p>
                                )}
                                {method.account_name && (
                                  <p className="text-sm text-gray-700">
                                    👤 Titular: <span className="font-semibold">{method.account_name}</span>
                                  </p>
                                )}
                                <p className="text-xs text-gray-600 mt-2 bg-yellow-50 p-2 rounded">
                                  ⚠️ Después de pagar, envía el comprobante al WhatsApp del negocio
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">Información del cliente</h3>
                <p className="text-sm text-gray-600">
                  <strong>Nombre:</strong> {user?.name}<br />
                  <strong>Email:</strong> {user?.email}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 text-white py-3 px-4 rounded-md font-semibold hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  formData.metodo_pago === 'contra_entrega'
                    ? `Confirmar Pedido ${formatPrice(getTotal())}`
                    : `Pagar con Mercado Pago ${formatPrice(getTotal())}`
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/productos')}
                className="text-primary-600 hover:text-primary-500 text-sm"
              >
                ← Volver a productos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 