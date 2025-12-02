import React, { useState } from 'react';
import { Producto } from '../types';
import { useCarrito } from '../contexts/CarritoContext';
import { getImageUrl } from '../utils/imageUtils';

interface ProductoCardProps {
  producto: Producto;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { addItem } = useCarrito();

  const handleAddToCart = () => {
    addItem(producto, cantidad, notas);
    setShowModal(false);
    setCantidad(1);
    setNotas('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative bg-gray-200">
          {producto.imagen ? (
            <img
              src={getImageUrl(producto.imagen)}
              alt={producto.nombre}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">Sin imagen</span>
            </div>
          )}
          {producto.destacado && (
            <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Destacado
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {producto.nombre}
          </h3>
          
          {producto.descripcion && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {producto.descripcion}
            </p>
          )}
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(producto.precio)}
            </span>
            {producto.stock > 0 ? (
              <span className="text-green-600 text-sm font-medium">
                En stock
              </span>
            ) : (
              <span className="text-red-600 text-sm font-medium">
                Agotado
              </span>
            )}
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            disabled={!producto.disponible || producto.stock === 0}
            className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {producto.disponible && producto.stock > 0 ? 'Agregar al carrito' : 'No disponible'}
          </button>
        </div>
      </div>

      {/* Modal para agregar al carrito */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Agregar al carrito</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  -
                </button>
                <span className="w-12 text-center">{cantidad}</span>
                <button
                  onClick={() => setCantidad(cantidad + 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas especiales (opcional)
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Ej: Sin azúcar, extra caliente..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600"
              >
                Agregar ({formatPrice(producto.precio * cantidad)})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductoCard; 