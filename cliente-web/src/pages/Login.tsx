import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Credenciales inválidas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.jpg"
              alt="Crepes & Coffee Logo" 
              className="h-20 w-auto rounded-xl shadow-lg"
            />
          </div>
          
          <h2 className="text-3xl font-logo font-bold text-coffee-800 mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-coffee-600 font-serif">
            Accede a tu cuenta para continuar
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-crepe-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-serif text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-serif font-medium text-coffee-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-crepe-200 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-transparent font-serif transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-serif font-medium text-coffee-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-crepe-200 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-transparent font-serif transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-coffee-600 to-coffee-700 text-white py-3 px-4 rounded-xl font-logo font-semibold hover:from-coffee-700 hover:to-coffee-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-coffee-600 font-serif">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-coffee-800 hover:text-coffee-900 font-serif font-medium hover:underline decoration-accent-red/30 underline-offset-4 transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-crepe-100">
            <Link
              to="/"
              className="flex items-center justify-center text-coffee-600 hover:text-coffee-700 font-serif transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 