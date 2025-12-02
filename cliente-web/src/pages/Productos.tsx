import React, { useState, useEffect } from 'react';
import { Producto, Categoria } from '../types';
import apiService from '../services/api';
import { useCarrito } from '../contexts/CarritoContext';
import { getImageUrl } from '../utils/imageUtils';

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCarrito();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          apiService.getProductos(),
          apiService.getCategorias()
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const productosFiltrados = Array.isArray(productos) ? productos.filter(producto => {
    const matchesCategoria = categoriaSeleccionada === null || producto.categoria_id === categoriaSeleccionada;
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategoria && matchesSearch;
  }) : [];

  const handleAddToCart = (producto: Producto) => {
    addItem(producto, 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-coffee-200 border-t-coffee-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-coffee-600 font-serif text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-coffee-50 to-crepe-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-logo font-bold text-coffee-800 mb-4">
            Nuestro Menú
          </h1>
          <p className="text-xl text-coffee-600 font-serif max-w-3xl mx-auto">
            Descubre nuestra selección de crepes artesanales, bebidas de especialidad y deliciosos acompañamientos
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-crepe-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-crepe-200 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-transparent font-serif"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-coffee-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <label className="text-coffee-700 font-serif font-medium">Categoría:</label>
              <select
                value={categoriaSeleccionada || ''}
                onChange={(e) => setCategoriaSeleccionada(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-3 border border-crepe-200 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-transparent font-serif bg-white"
              >
                <option value="">Todas las categorías</option>
                {Array.isArray(categorias) && categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categoriaSeleccionada && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-coffee-100 text-coffee-800 font-serif">
                {Array.isArray(categorias) && categorias.find(c => c.id === categoriaSeleccionada)?.nombre}
                <button
                  onClick={() => setCategoriaSeleccionada(null)}
                  className="ml-2 text-coffee-600 hover:text-coffee-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {productosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-coffee-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-logo font-semibold text-coffee-800 mb-2">No se encontraron productos</h3>
              <p className="text-coffee-600 font-serif">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {productosFiltrados.map((producto) => (
                <div key={producto.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-crepe-100 overflow-hidden group">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-crepe-50 to-coffee-50">
                    {producto.imagen ? (
                      <img
                        src={getImageUrl(producto.imagen)}
                        alt={producto.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-coffee-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {producto.destacado && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-accent-red text-white px-2 py-1 rounded-full text-xs font-bold">
                          Destacado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-logo font-semibold text-coffee-800 mb-2 line-clamp-2">
                        {producto.nombre}
                      </h3>
                      <p className="text-coffee-600 font-serif text-sm line-clamp-2">
                        {producto.descripcion}
                      </p>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-logo font-bold text-coffee-800">
                          {formatPrice(producto.precio)}
                        </p>
                        {producto.stock < 10 && producto.stock > 0 && (
                          <p className="text-xs text-accent-red font-serif">
                            Solo {producto.stock} disponibles
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(producto)}
                        disabled={producto.stock === 0}
                        className="bg-gradient-to-r from-coffee-600 to-coffee-700 text-white px-4 py-2 rounded-xl font-serif font-medium hover:from-coffee-700 hover:to-coffee-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {producto.stock === 0 ? 'Agotado' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productos; 