import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../contexts/CarritoContext';
import { useAuth } from '../contexts/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

const CarritoPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCarrito();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/carrito' } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-warm py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-coffee-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-coffee-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h2 className="text-3xl font-logo font-bold text-coffee-800 mb-4">Tu carrito está vacío</h2>
            <p className="text-lg text-coffee-600 font-serif mb-8">Agrega algunos productos deliciosos para comenzar tu pedido</p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/productos')}
                className="bg-gradient-to-r from-coffee-600 to-coffee-700 text-white px-8 py-4 rounded-xl font-logo font-semibold hover:from-coffee-700 hover:to-coffee-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explorar Productos
              </button>
              <div>
                <button
                  onClick={() => navigate('/')}
                  className="text-coffee-600 hover:text-coffee-700 font-serif font-medium"
                >
                  ← Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-logo font-bold text-coffee-800 mb-2">Tu Carrito de Compras</h1>
          <p className="text-lg text-coffee-600 font-serif">Revisa y ajusta tu pedido antes de continuar</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Lista de Productos */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-crepe-100">
              <div className="p-6 border-b border-crepe-100">
                <h2 className="text-xl font-logo font-semibold text-coffee-800">Productos ({items.length})</h2>
              </div>
              
              {items.map((item) => (
                <div key={item.producto.id} className="p-6 border-b border-crepe-100 last:border-b-0 hover:bg-crepe-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    {/* Imagen del Producto */}
                    <div className="flex-shrink-0">
                      {item.producto.imagen ? (
                        <img
                          src={getImageUrl(item.producto.imagen)}
                          alt={item.producto.nombre}
                          className="w-24 h-24 object-cover rounded-xl shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-crepe-100 to-coffee-100 rounded-xl flex items-center justify-center shadow-md">
                          <svg className="w-8 h-8 text-coffee-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Información del Producto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-logo font-semibold text-coffee-800 truncate">{item.producto.nombre}</h3>
                      <p className="text-sm text-coffee-600 font-serif mt-1 line-clamp-2">{item.producto.descripcion}</p>
                      {item.notas && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-coffee-100 text-coffee-800 font-serif">
                            📝 {item.notas}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Controles de Cantidad */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-crepe-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.producto.id, Math.max(1, item.cantidad - 1))}
                          className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-coffee-600 hover:text-coffee-800 hover:bg-coffee-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-12 text-center font-logo font-semibold text-coffee-900">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                          className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-coffee-600 hover:text-coffee-800 hover:bg-coffee-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Precio */}
                    <div className="text-right">
                      <p className="text-xl font-logo font-bold text-coffee-800">
                        {formatPrice(item.producto.precio * item.cantidad)}
                      </p>
                      <p className="text-sm text-coffee-500 font-serif">
                        {formatPrice(item.producto.precio)} c/u
                      </p>
                    </div>
                    
                    {/* Botón Eliminar */}
                    <button
                      onClick={() => removeItem(item.producto.id)}
                      className="flex-shrink-0 p-2 text-coffee-400 hover:text-accent-red hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar del carrito"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Acciones del Carrito */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <button
                onClick={clearCart}
                className="flex items-center space-x-2 text-accent-red hover:text-red-700 font-serif font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Vaciar Carrito</span>
              </button>
              <button
                onClick={() => navigate('/productos')}
                className="flex items-center space-x-2 text-coffee-600 hover:text-coffee-700 font-serif font-medium hover:bg-coffee-50 px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Continuar Comprando</span>
              </button>
            </div>
          </div>
          
          {/* Resumen del Pedido */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 border border-crepe-100">
              <h2 className="text-xl font-logo font-semibold text-coffee-800 mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-coffee-600 font-serif">Subtotal ({items.length} {items.length === 1 ? 'producto' : 'productos'})</span>
                  <span className="font-logo font-semibold text-coffee-900">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-coffee-600 font-serif">Envío</span>
                  <span className="text-green-600 font-serif font-semibold">Gratis</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-coffee-600 font-serif">Impuestos</span>
                  <span className="font-logo font-semibold text-coffee-900">Incluidos</span>
                </div>
                <hr className="my-4 border-crepe-200" />
                <div className="flex justify-between items-center py-2">
                  <span className="text-xl font-logo font-bold text-coffee-900">Total</span>
                  <span className="text-2xl font-logo font-bold text-coffee-800">{formatPrice(getTotal())}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-coffee-600 to-coffee-700 text-white py-4 px-6 rounded-xl font-logo font-semibold hover:from-coffee-700 hover:to-coffee-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mt-6"
              >
                {isAuthenticated ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Proceder al Pago</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Iniciar Sesión para Comprar</span>
                  </span>
                )}
              </button>
              
              {!isAuthenticated && (
                <p className="text-sm text-coffee-500 font-serif mt-3 text-center">
                  Necesitas iniciar sesión para completar tu compra
                </p>
              )}
              
              <div className="mt-6 p-4 bg-coffee-50 rounded-lg border border-coffee-100">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-coffee-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-logo font-medium text-coffee-800">Envío Gratis</p>
                    <p className="text-xs text-coffee-600 font-serif mt-1">Todos los pedidos incluyen envío sin costo adicional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarritoPage; 