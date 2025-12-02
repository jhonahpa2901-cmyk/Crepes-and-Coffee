import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../contexts/CarritoContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { getItemCount } = useCarrito();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-crepe-50 to-coffee-50 border-b border-crepe-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo y Nombre */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <img 
                src="/logo.jpg"
                alt="Crepes & Coffee Logo" 
                className="h-14 w-auto rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-coffee-900/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-logo font-bold text-coffee-800 group-hover:text-coffee-900 transition-colors duration-300">
                Crepes <span className="text-accent-red">&</span> Coffee
              </h1>
              <p className="text-sm text-coffee-600 font-serif italic">Deliciosos sabores artesanales</p>
            </div>
          </Link>

          {/* Navegación */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-coffee-700 hover:text-coffee-900 font-serif font-medium transition-colors duration-200 hover:underline decoration-accent-red/30 underline-offset-4"
            >
              Inicio
            </Link>
            <Link 
              to="/productos" 
              className="text-coffee-700 hover:text-coffee-900 font-serif font-medium transition-colors duration-200 hover:underline decoration-accent-red/30 underline-offset-4"
            >
              Productos
            </Link>
            <Link 
              to="/carrito" 
              className="text-coffee-700 hover:text-coffee-900 font-serif font-medium transition-colors duration-200 hover:underline decoration-accent-red/30 underline-offset-4"
            >
              Carrito
            </Link>
          </nav>

          {/* Acciones del Usuario */}
          <div className="flex items-center space-x-4">
            {/* Carrito */}
            <Link to="/carrito" className="relative group">
              <div className="p-2 rounded-full bg-gradient-to-r from-crepe-100 to-coffee-100 hover:from-crepe-200 hover:to-coffee-200 transition-all duration-300 shadow-sm hover:shadow-md">
                <svg className="w-6 h-6 text-coffee-700 group-hover:text-coffee-900 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                    {getItemCount()}
                  </span>
                )}
              </div>
            </Link>

            {/* Autenticación */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-coffee-700 font-serif">¡Hola!</span>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-coffee-600 to-coffee-700 text-white px-4 py-2 rounded-lg font-serif font-medium hover:from-coffee-700 hover:to-coffee-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-coffee-700 hover:text-coffee-900 font-serif font-medium transition-colors duration-200 hover:underline decoration-accent-red/30 underline-offset-4"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-accent-red to-red-600 text-white px-4 py-2 rounded-lg font-serif font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 