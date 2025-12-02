import React, { useState } from 'react';
import { useCarrito } from '../contexts/CarritoContext';
import { useAuth } from '../contexts/AuthContext';
import { getImageUrl } from '../utils/imageUtils';
import { useNavigate } from 'react-router-dom';

const Carrito: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCarrito();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-coffee-600 to-coffee-700 text-white p-4 rounded-full shadow-2xl hover:from-coffee-700 hover:to-coffee-800 transition-all duration-300 transform hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-6 w-80 border border-crepe-100 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-coffee-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h3 className="text-lg font-logo font-semibold text-coffee-800 mb-2">Carrito vacío</h3>
              <p className="text-coffee-600 font-serif mb-4">Agrega productos deliciosos para comenzar tu pedido</p>
              <button
                onClick={() => navigate('/productos')}
                className="bg-gradient-to-r from-coffee-600 to-coffee-700 text-white px-6 py-2 rounded-lg font-logo font-medium hover:from-coffee-700 hover:to-coffee-800 transition-all duration-200"
              >
                Ver Productos
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-coffee-600 to-coffee-700 text-white p-4 rounded-full shadow-2xl hover:from-coffee-700 hover:to-coffee-800 transition-all duration-300 transform hover:scale-110 relative"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
        <span className="absolute -top-2 -right-2 bg-accent-red text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
          {items.reduce((total, item) => total + item.cantidad, 0)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-6 w-96 max-h-96 overflow-y-auto border border-crepe-100 animate-fade-in cart-scrollbar">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-crepe-100">
            <h3 className="text-xl font-logo font-bold text-coffee-800">Tu Carrito</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearCart}
                className="text-accent-red hover:text-red-700 text-sm font-serif font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors"
              >
                Vaciar
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-coffee-400 hover:text-coffee-600 p-1 rounded-full hover:bg-coffee-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            {items.map((item) => (
              <div key={item.producto.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-crepe-50 to-coffee-50 rounded-xl border border-crepe-100">
                <div className="flex-shrink-0">
                  {item.producto.imagen ? (
                    <img
                      src={getImageUrl(item.producto.imagen)}
                      alt={item.producto.nombre}
                      className="w-12 h-12 object-cover rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-crepe-100 to-coffee-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-coffee-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-logo font-semibold text-sm text-coffee-800 truncate">{item.producto.nombre}</h4>
                  <p className="text-coffee-600 font-serif font-medium text-sm">{formatPrice(item.producto.precio)}</p>
                  {item.notas && (
                    <p className="text-xs text-coffee-500 font-serif mt-1 truncate">📝 {item.notas}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                    className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm hover:text-coffee-600 hover:bg-coffee-100 transition-colors border border-crepe-200"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-logo font-bold text-coffee-900">{item.cantidad}</span>
                  <button
                    onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                    className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm hover:text-coffee-600 hover:bg-coffee-100 transition-colors border border-crepe-200"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => removeItem(item.producto.id)}
                  className="text-coffee-400 hover:text-accent-red p-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-crepe-100 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-logo font-bold text-coffee-800">Total:</span>
              <span className="text-xl font-logo font-bold text-coffee-800">{formatPrice(getTotal())}</span>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/carrito');
                }}
                className="w-full bg-gradient-to-r from-coffee-600 to-coffee-700 text-white py-3 px-4 rounded-xl font-logo font-semibold hover:from-coffee-700 hover:to-coffee-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Ver Carrito Completo
              </button>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-accent-red to-red-600 text-white py-3 px-4 rounded-xl font-logo font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                {isAuthenticated ? 'Pagar Ahora' : 'Iniciar Sesión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito; 