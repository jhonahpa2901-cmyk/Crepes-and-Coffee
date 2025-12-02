# ��☕ Crepes & Coffee - Sistema de E-commerce

Sistema completo de e-commerce para venta de crepes y café con panel de administración multi-plataforma.

## 🚀 Características Principales

### 🛒 **Cliente Web**
- Catálogo de productos interactivo
- Carrito de compras dinámico
- Sistema de autenticación
- Múltiples métodos de pago (Mercado Pago & Contra Entrega)
- Interfaz responsiva y moderna

### 👨‍💼 **Panel de Administración**
- **Web**: Gestión desde navegador
- **Desktop**: Aplicación Electron nativa
- Dashboard con estadísticas en tiempo real
- Gestión completa de productos con imágenes
- Administración de pedidos y usuarios
- Auto-actualización de datos

### 💳 **Sistema de Pagos**
- **Contra Entrega**: Funcional inmediatamente
- **Mercado Pago**: Integración completa para producción
- Estados de pedido automatizados
- Notificaciones en tiempo real

## 🛠️ Tecnologías

### Backend
- **Laravel 11** - Framework PHP
- **MySQL** - Base de datos
- **Laravel Sanctum** - Autenticación API
- **Storage** - Manejo de archivos/imágenes

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **React Router** - Navegación

### Desktop
- **Electron** - Aplicación nativa
- **React** - Interfaz de usuario
- **Concurrent** - Procesos paralelos

## 📁 Estructura del Proyecto

```
ecomers-crepes-and-coffee/
├── admin-laravel/          # Backend API (Laravel)
├── cliente-web/            # Frontend cliente (React)
├── admin-web/              # Panel admin web (React)
├── admin-desktop/          # Panel admin desktop (Electron)
├── docker-compose.yml      # Configuración Docker
└── render.yaml            # Configuración Render
```

## 🚀 Despliegue

### Render (Recomendado)
1. Conecta este repositorio a Render
2. Configura las variables de entorno
3. Deploy automático desde GitHub

### Variables de Entorno Necesarias
```env
# Laravel
APP_KEY=base64:...
DB_CONNECTION=mysql
DB_HOST=...
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_PUBLIC_KEY=...

# URLs
APP_URL=https://tu-app.onrender.com
FRONTEND_URL=https://tu-frontend.onrender.com
```

## 🔧 Desarrollo Local

### Requisitos
- PHP 8.1+
- Node.js 18+
- MySQL 8.0+
- Composer
- Git

### Instalación
```bash
# 1. Clonar repositorio
git clone https://github.com/crepesandcoffee1/crepesandcoffee1.git
cd crepesandcoffee1

# 2. Backend (Laravel)
cd admin-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve --port=8001

# 3. Cliente Web
cd ../cliente-web
npm install
npm start

# 4. Admin Desktop
cd ../admin-desktop
npm install
npm run electron-dev
```

## 📊 Funcionalidades del Sistema

### ✅ **Completamente Funcional**
- [x] Registro y login de usuarios
- [x] Catálogo de productos con imágenes
- [x] Carrito de compras
- [x] Checkout con múltiples métodos de pago
- [x] Panel de administración completo
- [x] Gestión de productos (CRUD + imágenes)
- [x] Dashboard con estadísticas
- [x] Sistema de actualizaciones en tiempo real
- [x] Estados de pedidos automatizados

### 🔄 **En Desarrollo**
- [ ] Notificaciones push
- [ ] Sistema de reseñas
- [ ] Programa de lealtad
- [ ] Chat en vivo

## 🏆 Características Destacadas

### 💡 **Innovaciones**
- **Dual Payment System**: Contra entrega + Mercado Pago
- **Multi-Platform Admin**: Web + Desktop nativo
- **Real-time Updates**: Auto-refresh cada 30s
- **Smart Image Handling**: Upload + preview + optimization
- **Professional UI/UX**: Animaciones y transiciones suaves

### 🎯 **Optimizaciones**
- Lazy loading de imágenes
- Caché de datos en frontend
- Consultas optimizadas en backend
- Manejo de errores robusto
- Validaciones tanto frontend como backend

## 👥 Equipo

Desarrollado con ❤️ por el equipo de Crepes & Coffee

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

⭐ **¡Si te gusta este proyecto, dale una estrella!** ⭐ 