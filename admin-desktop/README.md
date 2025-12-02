# 🖥️ Panel de Administración de Escritorio - Crepes & Coffee

Aplicación de escritorio desarrollada con **Electron** y **React** para la administración completa del sistema de e-commerce Crepes & Coffee.

## 🎯 Características Principales

### 🛡️ **Acceso Exclusivo para Administradores**
- Login seguro con credenciales específicas
- Interfaz diseñada exclusivamente para administración
- Sin funcionalidades de registro público

### 📊 **Dashboard Completo**
- Estadísticas en tiempo real
- Resumen de pedidos, productos, usuarios e ingresos
- Gráficos y métricas visuales

### 🛍️ **Gestión de Productos**
- ✅ Agregar nuevos productos con carga de imágenes
- ✅ Editar productos existentes
- ✅ Eliminar productos con confirmación
- ✅ Drag & Drop para subir imágenes
- ✅ Preview de imágenes en tiempo real
- ✅ Validación de archivos (JPG, PNG, GIF hasta 5MB)

### 📦 **Gestión de Pedidos**
- Ver detalles completos de pedidos
- Cambiar estados (Pendiente → En Proceso → Completado)
- Información detallada de clientes
- Lista de productos por pedido

### 👥 **Gestión de Usuarios**
- Editar información de usuarios
- Cambiar roles (Cliente ↔ Admin)
- Eliminar usuarios con confirmación

### ⚙️ **Configuración del Sistema**
- Configuración de la tienda
- Notificaciones personalizables
- Cambio de contraseñas
- Exportación de datos

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 16+ instalado
- npm o yarn
- Backend Laravel ejecutándose en `http://localhost:8000`

### Instalación
```bash
# Instalar dependencias
npm install

# Instalar dependencias de Electron
npm install electron concurrently wait-on cross-env
```

### Ejecución en Desarrollo
```bash
# Ejecutar la aplicación de escritorio
npm run electron-dev
```

### Compilar para Producción
```bash
# Construir la aplicación
npm run build

# Empaquetar para Windows
npm run electron-pack
```

## 🔑 Credenciales de Acceso

- **Email**: `admin@crepesandcoffee.com`
- **Contraseña**: `admin123`

## 📋 Menú de la Aplicación

### 📁 Archivo
- **Ctrl+N**: Nuevo Producto
- **Ctrl+E**: Exportar Datos
- **Ctrl+Q**: Salir

### 👁️ Ver
- **Ctrl+1**: Dashboard
- **Ctrl+2**: Productos
- **Ctrl+3**: Pedidos
- **Ctrl+4**: Usuarios
- **Ctrl+5**: Configuración
- **Ctrl+R**: Recargar
- **F11**: Pantalla Completa
- **Ctrl+Shift+I**: DevTools

### 🪟 Ventana
- **Ctrl+M**: Minimizar
- **Ctrl+W**: Cerrar

## 🛠️ Tecnologías Utilizadas

- **Electron 22+**: Framework para aplicaciones de escritorio
- **React 18**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático
- **React Router**: Navegación
- **Axios**: Cliente HTTP
- **Lucide React**: Iconos

## 📁 Estructura del Proyecto

```
admin-desktop/
├── public/
│   ├── electron.js          # Proceso principal de Electron
│   └── index.html          # HTML base
├── src/
│   ├── App.tsx             # Componente principal
│   ├── electron-config.ts  # Configuración de Electron
│   └── index.tsx           # Punto de entrada
├── package.json            # Dependencias y scripts
└── README.md              # Documentación
```

## 🔧 Configuración de Electron

### Características de la Ventana
- **Tamaño mínimo**: 1200x700px
- **Tamaño por defecto**: 1400x900px
- **Maximizable**: ✅
- **Redimensionable**: ✅
- **Menú personalizado**: ✅

### Seguridad
- **Context Isolation**: Habilitado
- **Node Integration**: Deshabilitado
- **Web Security**: Habilitado
- **Remote Module**: Deshabilitado

## 🎨 Funcionalidades Específicas de Escritorio

### 📸 **Carga de Imágenes Avanzada**
- Drag & Drop nativo del sistema operativo
- Preview instantáneo de imágenes
- Validación de tipos de archivo
- Límite de tamaño configurable
- Conversión a Base64 automática

### 🖱️ **Menús Contextuales**
- Menú de aplicación nativo
- Atajos de teclado del sistema
- Integración con el sistema operativo

### 💾 **Exportación de Datos**
- Diálogos nativos para guardar archivos
- Exportación en formato JSON
- Integración con el explorador de archivos

## 🔄 Estados de la Aplicación

### 🟢 Funcionando Correctamente
- Login y autenticación
- Navegación entre secciones
- CRUD completo de productos
- Gestión de pedidos y usuarios
- Carga de imágenes
- Modales y confirmaciones

### 🔄 En Desarrollo
- Conexión con API Laravel real
- Sincronización de datos
- Notificaciones push
- Actualización automática

## 🐛 Solución de Problemas

### La aplicación no inicia
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run electron-dev
```

### Error de módulos
```bash
# Verificar que todas las dependencias estén instaladas
npm install electron concurrently wait-on cross-env
```

### Problemas de conexión con el backend
- Verificar que Laravel esté ejecutándose en `http://localhost:8000`
- Comprobar que las rutas de API estén configuradas
- Verificar CORS en el backend

## 📞 Soporte

Para soporte técnico, contactar a: `admin@crepesandcoffee.com`

---

**Desarrollado con ❤️ para Crepes & Coffee**
