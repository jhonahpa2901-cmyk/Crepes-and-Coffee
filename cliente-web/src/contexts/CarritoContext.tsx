import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CarritoItem, Producto } from '../types';

interface CarritoContextType {
  items: CarritoItem[];
  addItem: (producto: Producto, cantidad: number, notas?: string) => void;
  removeItem: (productoId: number) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error('useCarrito must be used within a CarritoProvider');
  }
  return context;
};

interface CarritoProviderProps {
  children: ReactNode;
}

export const CarritoProvider: React.FC<CarritoProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CarritoItem[]>([]);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('carrito');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const addItem = (producto: Producto, cantidad: number, notas?: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.producto.id === producto.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        return [...prevItems, { producto, cantidad, notas }];
      }
    });
  };

  const removeItem = (productoId: number) => {
    setItems(prevItems => prevItems.filter(item => item.producto.id !== productoId));
  };

  const updateQuantity = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeItem(productoId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.producto.id === productoId
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.producto.precio * item.cantidad);
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.cantidad, 0);
  };

  const value: CarritoContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
}; 