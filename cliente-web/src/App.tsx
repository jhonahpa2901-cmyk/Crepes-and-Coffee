import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CarritoProvider } from './contexts/CarritoContext';
import Header from './components/Header';
import CarritoPage from './pages/Carrito';
import Carrito from './components/Carrito';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import PedidoConfirmado from './pages/PedidoConfirmado';
import PagoExito from './pages/PagoExito';
import PagoFallo from './pages/PagoFallo';

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/carrito" element={<CarritoPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
                <Route path="/pago/exito" element={<PagoExito />} />
                <Route path="/pago/fallo" element={<PagoFallo />} />
                <Route path="/pago/pendiente" element={<PagoExito />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Carrito />
          </div>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
