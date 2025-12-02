# 💳 Configuración Mercado Pago - Producción

## 📝 Pasos para Configurar Mercado Pago

### 1. **Obtener Credenciales de Producción**

1. Ve a [developers.mercadopago.com](https://developers.mercadopago.com)
2. Inicia sesión con tu cuenta de Mercado Pago
3. Ve a **"Tus integraciones"** → **"Crear aplicación"**
4. Configura tu aplicación:
   - **Nombre**: Crepes & Coffee
   - **Descripción**: Sistema de e-commerce para venta de crepes y café
   - **Categoría**: Food & Drinks / E-commerce
   - **URL del sitio**: `https://crepes-coffee-client.onrender.com`

### 2. **Configurar URLs de Redirección**

En la configuración de tu aplicación:

#### URLs de Retorno:
- **Success URL**: `https://crepes-coffee-client.onrender.com/pago/exito`
- **Failure URL**: `https://crepes-coffee-client.onrender.com/pago/fallo`
- **Pending URL**: `https://crepes-coffee-client.onrender.com/pago/pendiente`

#### Webhook URL:
- **Webhook URL**: `https://crepes-coffee-api.onrender.com/api/webhook/mercadopago`

### 3. **Copiar Credenciales**

Una vez configurada tu aplicación, copia:

```env
# Credenciales de PRODUCCIÓN
MERCADOPAGO_ACCESS_TOKEN=APP_USR-123456789-123456-abcdef123456789-123456789-123456789
MERCADOPAGO_PUBLIC_KEY=APP_USR-abcdef12-1234-5678-9012-123456789abc
```

**⚠️ IMPORTANTE:**
- Usa las credenciales de **PRODUCCIÓN**, no las de prueba
- Las credenciales de producción empiezan con `APP_USR-`
- Las de prueba empiezan con `TEST-`

### 4. **Configurar en Render**

En tu servicio backend de Render, agregar las variables:

1. Ve a tu servicio `crepes-coffee-api`
2. Click en **"Environment"**
3. Agregar:
   ```env
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token-aqui
   MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key-aqui
   ```

### 5. **Configurar Webhooks**

En Mercado Pago Developers:

1. Ve a **"Webhooks"**
2. Crear nuevo webhook:
   - **URL**: `https://crepes-coffee-api.onrender.com/api/webhook/mercadopago`
   - **Eventos**: 
     - ✅ `payment` (pagos)
     - ✅ `merchant_order` (órdenes)

### 6. **Probar la Integración**

#### URLs para testing:
- **Cliente**: https://crepes-coffee-client.onrender.com
- **Admin**: https://crepes-coffee-admin.onrender.com

#### Proceso de prueba:
1. Crea una cuenta de cliente
2. Agrega productos al carrito
3. Ve a checkout
4. Selecciona "Mercado Pago"
5. Completa el pago con datos reales
6. Verifica redirección correcta
7. Confirma que el pedido aparece en el admin

### 7. **Métodos de Pago Disponibles**

Tu integración soportará:
- 💳 **Tarjetas de crédito/débito**
- 🏦 **Transferencias bancarias**
- 💰 **Efectivo** (PagoEfectivo, etc.)
- 📱 **Billeteras digitales**

### 8. **Estados de Pago**

El sistema maneja automáticamente:

| Estado MP | Estado Sistema | Descripción |
|-----------|----------------|-------------|
| `approved` | `confirmado` | Pago aprobado |
| `pending` | `pendiente` | Pago pendiente |
| `rejected` | `cancelado` | Pago rechazado |
| `cancelled` | `cancelado` | Pago cancelado |

### 9. **Comisiones**

Mercado Pago cobra comisiones por transacción:
- **Tarjetas**: ~2.9% + fee fijo
- **Efectivo**: ~2.4% + fee fijo
- **Transferencias**: ~1.8% + fee fijo

### 10. **Configuración Adicional (Opcional)**

#### Personalizar checkout:
```php
// En admin-laravel/app/Http/Controllers/PagoController.php
$preference->payment_methods = [
    "excluded_payment_methods" => [
        ["id" => "amex"] // Excluir American Express
    ],
    "installments" => 12, // Máximo 12 cuotas
];
```

#### Configurar descuentos:
```php
$preference->differential_pricing = [
    "id" => 123 // ID de descuento configurado en MP
];
```

## 🛟 Solución de Problemas

### Pago no se procesa:
1. ✅ Verificar credenciales de producción
2. ✅ Confirmar webhook configurado
3. ✅ Revisar logs de Laravel
4. ✅ Verificar URLs de retorno

### Webhook no funciona:
1. ✅ URL debe ser HTTPS
2. ✅ Debe responder con status 200
3. ✅ Verificar en logs de Render

### Estados no actualizan:
1. ✅ Verificar método `webhook()` en PagoController
2. ✅ Confirmar que el pedido existe en BD
3. ✅ Revisar logs de respuesta de webhook

## 📞 Soporte

- **Documentación**: https://www.mercadopago.com.pe/developers
- **FAQ**: https://www.mercadopago.com.pe/ayuda
- **Soporte técnico**: Desde tu panel de desarrollador

---

🎉 **¡Mercado Pago configurado y listo para producción!** 