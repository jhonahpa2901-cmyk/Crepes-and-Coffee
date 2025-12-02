import React from 'react';
import { useNavigate } from 'react-router-dom';

const PagoFallo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          {/* Ícono de error */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
            <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-logo font-bold text-coffee-800 mb-4">
            Pago No Completado
          </h2>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-crepe-200 mb-6">
            <h3 className="text-lg font-semibold text-coffee-700 mb-3">❌ Hubo un problema</h3>
            <div className="text-coffee-600 space-y-2">
              <p>El pago no pudo procesarse correctamente</p>
              <p>Tu pedido sigue pendiente de pago</p>
              <p>No se realizó ningún cargo</p>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-6">
            <h4 className="font-semibold text-amber-700 mb-2">💡 Opciones:</h4>
            <ul className="text-sm text-amber-600 text-left space-y-1">
              <li>• Intenta el pago nuevamente</li>
              <li>• Usa otro método de pago</li>
              <li>• Cambia a "Contra Entrega"</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-accent-red text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              🔄 Intentar Nuevamente
            </button>
            
            <button
              onClick={() => navigate('/productos')}
              className="w-full bg-coffee-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-coffee-700 transition-colors"
            >
              🛍️ Seguir Comprando
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              🏠 Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoFallo; 