// Función para construir URL completa de imagen
export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '';

  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Si empieza con /storage/, construir URL completa con el servidor Laravel
  if (imagePath.startsWith('/storage/')) {
    const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${API_BASE}${imagePath}`;
  }

  // Para otras rutas (como /logo.jpg), usar tal como está
  return imagePath;
}; 