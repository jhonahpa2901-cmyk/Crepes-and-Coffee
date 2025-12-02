# 🚀 Guía de Despliegue - Render.com

## 📋 Pre-requisitos

- ✅ Código subido a GitHub: https://github.com/crepesandcoffee1/crepesandcoffee1.git
- ✅ Cuenta en [Render.com](https://render.com)
- ✅ Credenciales de Mercado Pago (para producción)

## 🛠️ Configuración en Render

### 1. **Crear Base de Datos**
1. En Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configurar:
   - **Name**: `crepes-coffee-db`
   - **Database Name**: `crepes_coffee`
   - **User**: `crepes_coffee_user`
   - **Region**: Oregon (US West)
   - **Plan**: Free
3. Guardar las credenciales generadas

### 2. **Desplegar Backend (Laravel API)**
1. Click **"New +"** → **"Web Service"**
2. Conectar repositorio: `crepesandcoffee1/crepesandcoffee1`
3. Configurar:
   - **Name**: `crepes-coffee-api`
   - **Runtime**: `PHP`
   - **Build Command**: 
     ```bash
     cd admin-laravel && composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache && php artisan view:cache
     ```
   - **Start Command**: 
     ```bash
     cd admin-laravel && php artisan migrate --force && php artisan storage:link && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT
     ```

### 3. **Variables de Entorno Backend**
En la sección **Environment**, agregar:

```env
APP_NAME=Crepes & Coffee
APP_ENV=production
APP_DEBUG=false
APP_KEY=[GENERAR_AUTOMATICAMENTE]
APP_URL=https://crepes-coffee-api.onrender.com
LOG_LEVEL=error

# Base de datos (usar credenciales de Render PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=[HOST_DE_RENDER]
DB_PORT=5432
DB_DATABASE=crepes_coffee
DB_USERNAME=[USERNAME_DE_RENDER]
DB_PASSWORD=[PASSWORD_DE_RENDER]

# URLs
FRONTEND_URL=https://crepes-coffee-client.onrender.com

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=[TU_ACCESS_TOKEN]
MERCADOPAGO_PUBLIC_KEY=[TU_PUBLIC_KEY]

# Storage
FILESYSTEM_DISK=public
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

### 4. **Desplegar Frontend Cliente**
1. Click **"New +"** → **"Static Site"**
2. Conectar mismo repositorio
3. Configurar:
   - **Name**: `crepes-coffee-client`
   - **Branch**: `main`
   - **Build Command**: 
     ```bash
     cd cliente-web && npm ci && npm run build
     ```
   - **Publish Directory**: `cliente-web/build`

### 5. **Variables de Entorno Frontend Cliente**
```env
REACT_APP_API_URL=https://crepes-coffee-api.onrender.com/api
```

### 6. **Desplegar Admin Panel Web**
1. Click **"New +"** → **"Static Site"**
2. Conectar mismo repositorio
3. Configurar:
   - **Name**: `crepes-coffee-admin`
   - **Branch**: `main`
   - **Build Command**: 
     ```bash
     cd admin-web && npm ci && npm run build
     ```
   - **Publish Directory**: `admin-web/build`

### 7. **Variables de Entorno Admin Panel**
```env
REACT_APP_API_URL=https://crepes-coffee-api.onrender.com/api
```

## 🔧 Pasos Post-Despliegue

### 1. **Generar APP_KEY**
En el logs del backend, copiar la APP_KEY generada y agregarla a las variables de entorno.

### 2. **Verificar Migraciones**
Revisar logs para confirmar que las migraciones se ejecutaron correctamente.

### 3. **Probar Endpoints**
- Backend API: `https://crepes-coffee-api.onrender.com/api/productos`
- Frontend: `https://crepes-coffee-client.onrender.com`
- Admin: `https://crepes-coffee-admin.onrender.com`

## 💳 Configuración Mercado Pago

### URLs de Webhook para Producción:
- **Webhook URL**: `https://crepes-coffee-api.onrender.com/api/webhook/mercadopago`
- **Success URL**: `https://crepes-coffee-client.onrender.com/pago/exito`
- **Failure URL**: `https://crepes-coffee-client.onrender.com/pago/fallo`
- **Pending URL**: `https://crepes-coffee-client.onrender.com/pago/pendiente`

## 🛡️ Configuraciones de Seguridad

### CORS (ya configurado)
```php
'allowed_origins' => [
    'https://crepes-coffee-client.onrender.com',
    'https://crepes-coffee-admin.onrender.com'
]
```

### SSL (automático en Render)
- Certificados SSL automáticos
- HTTPS obligatorio
- HTTP → HTTPS redirect automático

## 📊 Monitoreo

### Logs importantes a revisar:
- ✅ Migraciones ejecutadas
- ✅ Seeders ejecutados correctamente
- ✅ Storage link creado
- ✅ Cache generado
- ❌ Errores de conexión a BD
- ❌ Errores de permisos de archivos

## 🔄 Actualizaciones

Para actualizar el despliegue:
1. Push cambios a GitHub
2. Render detecta automáticamente y redespliega
3. Verificar que todo funcione correctamente

## 🆘 Solución de Problemas

### Backend no inicia:
1. Revisar logs de build
2. Verificar variables de entorno
3. Confirmar credenciales de BD

### Frontend no carga:
1. Verificar REACT_APP_API_URL
2. Revisar CORS en backend
3. Confirmar build exitoso

### Base de datos:
1. Verificar credenciales
2. Confirmar migraciones
3. Revisar seeders

---

🎉 **¡Listo! Tu aplicación estará disponible en producción.** 