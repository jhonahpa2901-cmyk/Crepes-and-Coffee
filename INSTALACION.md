# 🚀 Instrucciones de Instalación - Crepes & Coffee

## 📋 Requisitos Previos

- PHP 8.1 o superior
- Composer
- Node.js 16 o superior
- npm o yarn
- MySQL o PostgreSQL
- Git

## 🔧 Instalación del Backend (Laravel)

### 1. Configurar la base de datos

```bash
# Crear base de datos MySQL
mysql -u root -p
CREATE DATABASE crepes_coffee;
```

### 2. Configurar variables de entorno

```bash
cd admin-laravel
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:

```env
APP_NAME="Crepes & Coffee"
APP_ENV=local
APP_KEY=base64:tu-app-key-aqui
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_FRONTEND_URL=http://localhost:3000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=crepes_coffee
DB_USERNAME=root
DB_PASSWORD=tu_password

# Mercado Pago (opcional para desarrollo)
MERCADOPAGO_ACCESS_TOKEN=tu_token_aqui
```

### 3. Instalar dependencias y configurar

```bash
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

El backend estará disponible en: http://localhost:8000

## 🎨 Instalación del Frontend (React)

### 1. Configurar variables de entorno

```bash
cd cliente-web
cp .env.example .env
```

Editar el archivo `.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 2. Instalar dependencias y ejecutar

```bash
npm install
npm start
```

El frontend estará disponible en: http://localhost:3000

## 👥 Usuarios de Prueba

### Administrador
- Email: admin@crepescoffee.com
- Password: password

### Cliente
- Email: cliente@example.com
- Password: password

## 🌐 Despliegue en Render

### Backend (Laravel)

1. Conectar tu repositorio a Render
2. Crear un nuevo Web Service
3. Configurar:
   - **Build Command**: `composer install && php artisan migrate --force && php artisan config:cache`
   - **Start Command**: `php artisan serve --host 0.0.0.0 --port 10000`
4. Agregar variables de entorno:
   - `APP_ENV=production`
   - `APP_DEBUG=false`
   - `DB_CONNECTION=mysql`
   - `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
   - `MERCADOPAGO_ACCESS_TOKEN`

### Frontend (React)

1. Crear un nuevo Static Site
2. Configurar:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
3. Agregar variable de entorno:
   - `REACT_APP_API_URL=https://tu-backend.onrender.com/api`

## 💳 Configuración de Mercado Pago

1. Crear cuenta en [Mercado Pago](https://www.mercadopago.com)
2. Ir a [Panel de Desarrolladores](https://www.mercadopago.com/developers)
3. Obtener Access Token
4. Configurar en `.env` del backend:
   ```env
   MERCADOPAGO_ACCESS_TOKEN=tu_token_aqui
   ```

## 🧪 Pruebas

### Probar el Backend

```bash
# Probar la API
curl http://localhost:8000/api/productos
curl http://localhost:8000/api/categorias
```

### Probar el Frontend

1. Abrir http://localhost:3000
2. Navegar por los productos
3. Agregar productos al carrito
4. Registrarse/Iniciar sesión
5. Probar el checkout

## 📁 Estructura del Proyecto

```
crepes-coffee/
├── admin-laravel/          # Backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Http/Resources/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   └── Procfile
├── cliente-web/            # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── types/
│   └── package.json
└── README.md
```

## 🔧 Comandos Útiles

### Backend
```bash
# Generar nueva migración
php artisan make:migration nombre_migracion

# Ejecutar migraciones
php artisan migrate

# Revertir migraciones
php artisan migrate:rollback

# Ejecutar seeders
php artisan db:seed

# Limpiar cache
php artisan config:clear
php artisan cache:clear
```

### Frontend
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test
```

## 🐛 Solución de Problemas

### Error de CORS
Si tienes problemas de CORS, verifica que el frontend esté apuntando a la URL correcta del backend.

### Error de base de datos
Verifica que las credenciales de la base de datos sean correctas y que la base de datos exista.

### Error de Mercado Pago
Asegúrate de que el token de Mercado Pago sea válido y esté configurado correctamente.

## 📞 Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo.

---

¡Disfruta tu sistema de e-commerce Crepes & Coffee! 🎉 