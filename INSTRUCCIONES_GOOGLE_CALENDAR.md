# 🚀 GUÍA RÁPIDA: Configurar Google Calendar en 5 minutos

## ✅ **PASO 1: Google Cloud Console**

1. **Abrir**: [console.cloud.google.com](https://console.cloud.google.com/)
2. **Crear proyecto**:
   - Click en el selector de proyecto (arriba)
   - "Nuevo proyecto" 
   - Nombre: `PetConnect Calendar`
   - Click "Crear"

---

## ✅ **PASO 2: Habilitar Google Calendar API**

1. **Menu lateral** → **APIs y servicios** → **Biblioteca**
2. **Buscar**: "Google Calendar API"
3. **Click en la API** → **Habilitar**

---

## ✅ **PASO 3: Crear API Key**

1. **APIs y servicios** → **Credenciales**
2. **+ CREAR CREDENCIALES** → **Clave de API**
3. **Copiar la API Key generada**

**Ejemplo**: `AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q`

---

## ✅ **PASO 4: Crear OAuth Client ID**

1. **En la misma página Credenciales**
2. **+ CREAR CREDENCIALES** → **ID de cliente de OAuth 2.0**
3. **Configurar pantalla de consentimiento** (si aparece):
   - Tipo: **Externo**
   - Nombre: `PetConnect`
   - Email: tu email
   - **Guardar y continuar** hasta el final
4. **Volver a Credenciales** → **+ CREAR CREDENCIALES** → **ID de cliente OAuth 2.0**
5. **Tipo**: Aplicación web
6. **Orígenes autorizados de JavaScript**:
   ```
   http://localhost:3000
   https://petconnect-front.vercel.app
   ```
7. **URIs de redirección autorizados**:
   ```
   http://localhost:3000/health-management
   https://petconnect-front.vercel.app/health-management
   ```
8. **Crear** → **Copiar el Client ID**

**Ejemplo**: `123456789-abcdef.apps.googleusercontent.com`

---

## ✅ **PASO 5: Configurar Variables de Entorno**

**Edita el archivo `.env` en la raíz del proyecto frontend:**

```env
# Google Calendar Integration
VITE_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q
```

⚠️ **Reemplaza con tus valores reales**

---

## ✅ **PASO 6: Reiniciar Servidor**

```bash
# Detener servidor (Ctrl+C)
# Reiniciar
npm run dev
```

---

## ✅ **PASO 7: Probar Integración**

1. **Ir a**: `http://localhost:3000/health-management`
2. **Click en tab**: "Calendario"
3. **Conectar con Google Calendar**
4. **Autorizar la aplicación**
5. **Crear una cita de prueba**

---

## 🎯 **SI TODO SALE BIEN**

- ✅ Verás "Google Calendar Conectado"
- ✅ Podrás crear citas que aparecerán en tu Google Calendar
- ✅ Recibirás notificaciones automáticas
- ✅ Podrás invitar veterinarios por email

---

## ❌ **PROBLEMAS COMUNES**

### **Error: "Missing required parameter client_id"**
- **Solución**: Verifica que las variables estén bien en `.env` y reinicia el servidor

### **Error: "redirect_uri_mismatch"**  
- **Solución**: Agrega tu URL exacta en "URIs de redirección" en Google Console

### **Error: "This app isn't verified"**
- **Solución**: Esto es normal en desarrollo. Click "Advanced" → "Go to PetConnect (unsafe)"

---

## 🔒 **SEGURIDAD**

- ✅ **Nunca commitees** el archivo `.env` al repositorio
- ✅ Usa diferentes credenciales para desarrollo y producción
- ✅ Restringe las API keys por dominio en producción

---

## 📞 **¿NECESITAS AYUDA?**

Si tienes problemas con algún paso, puedo ayudarte específicamente con:
1. Screenshots de Google Console
2. Configuración específica de URIs
3. Troubleshooting de errores específicos

**¡La integración está lista para usar una vez tengas las credenciales!** 