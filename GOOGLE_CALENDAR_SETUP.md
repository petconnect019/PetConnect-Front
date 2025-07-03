# 🗓️ Configuración de Google Calendar para Pet Connect

## 📋 **PASOS REQUERIDOS PARA IMPLEMENTACIÓN COMPLETA**

### **1. Configurar Google Cloud Console**

#### **A. Crear/Configurar Proyecto**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el **Project ID** para referencia

#### **B. Habilitar Google Calendar API**
1. En el menú lateral → **APIs & Services** → **Library**
2. Busca "**Google Calendar API**"
3. Click en **Enable**

#### **C. Crear Credenciales**

**API Key:**
1. **APIs & Services** → **Credentials** → **+ CREATE CREDENTIALS** → **API Key**
2. Copia la **API Key** generada
3. **Opcional**: Restringe la key a tu dominio en producción

**OAuth 2.0 Client ID:**
1. **APIs & Services** → **Credentials** → **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Selecciona **Web application**
3. Nombre: `Pet Connect Calendar Integration`
4. **Authorized origins**:
   - `http://localhost:3000` (desarrollo)
   - `https://tu-dominio.com` (producción)
5. **Authorized redirect URIs**:
   - `http://localhost:3000/health-management`
   - `https://tu-dominio.com/health-management`
6. Copia el **Client ID** generado

---

### **2. Configurar Variables de Entorno**

#### **Frontend (.env)**
Agrega estas variables a tu archivo `.env`:

```env
# Google Calendar Integration
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=tu_api_key_aqui
```

---

### **3. Configurar Proyecto (Ya implementado)**

#### **Archivos ya creados:**
- ✅ `src/Utils/GoogleCalendar/GoogleCalendarAPI.js`
- ✅ `src/Components/CalendarIntegration/CalendarIntegration.jsx`
- ✅ `src/Pages/HealthManagement/HealthManagement.jsx`
- ✅ `src/Components/HealthDashboard/HealthDashboard.jsx`

#### **Rutas ya configuradas:**
- ✅ `/health-management` - Gestión completa de salud
- ✅ Dashboard en Home modificado para acceso rápido

---

### **4. Instalar Dependencias JavaScript**

Agrega el script de Google APIs al `index.html`:

```html
<!-- En public/index.html, antes del cierre de </body> -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

---

### **5. Configurar Dominio en Google Console (Producción)**

#### **Para deployment en producción:**
1. **Google Cloud Console** → **APIs & Services** → **Credentials**
2. Edita tu **OAuth 2.0 Client ID**
3. Agrega tu dominio de producción:
   - **Authorized origins**: `https://tu-app.com`
   - **Authorized redirect URIs**: `https://tu-app.com/health-management`

---

### **6. Configurar Timezone (Colombia)**

El código ya está configurado para Colombia:
```javascript
timeZone: 'America/Bogota'
```

---

## 🚀 **CÓMO PROBAR LA INTEGRACIÓN**

### **1. Desarrollo Local**
```bash
# 1. Configura las variables de entorno
echo "VITE_GOOGLE_CLIENT_ID=tu_client_id" >> .env
echo "VITE_GOOGLE_API_KEY=tu_api_key" >> .env

# 2. Reinicia el servidor de desarrollo
npm run dev

# 3. Ve a localhost:3000/health-management?tab=calendar
# 4. Click en "Conectar con Google Calendar"
# 5. Autoriza la aplicación
# 6. Crea una cita de prueba
```

### **2. Verificar Funcionalidad**
- ✅ Conexión con Google Calendar
- ✅ Creación de eventos
- ✅ Notificaciones automáticas (1 día, 1 hora, 15 min antes)
- ✅ Invitación a veterinarios por email
- ✅ Sincronización bidireccional

---

## 🔧 **PERSONALIZACIÓN AVANZADA**

### **Calendarios Específicos por Mascota**
```javascript
// En GoogleCalendarAPI.js - modificar para crear calendarios por mascota
async createPetCalendar(petName) {
  const calendar = {
    summary: `${petName} - Salud Veterinaria`,
    description: `Calendar para registros médicos de ${petName}`,
    timeZone: 'America/Bogota'
  };
  
  const response = await gapi.client.calendar.calendars.insert({
    resource: calendar
  });
  
  return response.result.id;
}
```

### **Recordatorios Personalizados**
```javascript
// Modificar en createEvent para recordatorios específicos
reminders: {
  useDefault: false,
  overrides: [
    { method: 'email', minutes: 7 * 24 * 60 }, // 1 semana antes
    { method: 'email', minutes: 24 * 60 },     // 1 día antes
    { method: 'popup', minutes: 60 },          // 1 hora antes
    { method: 'sms', minutes: 30 }             // 30 min antes (requiere config)
  ]
}
```

---

## 🔐 **SEGURIDAD Y MEJORES PRÁCTICAS**

### **Variables de Entorno Seguras**
- ✅ **Nunca** commitees las keys al repositorio
- ✅ Usa diferentes keys para desarrollo/producción  
- ✅ Restringe las API keys por dominio en producción
- ✅ Rota las keys periódicamente

### **Permisos Mínimos**
- ✅ Solo solicita acceso a `calendar.events` (no calendarios completos)
- ✅ Maneja errores de autorización graciosamente
- ✅ Permite desconectar la integración fácilmente

---

## 🎯 **BENEFICIOS PARA TU APLICACIÓN**

### **Para los Usuarios:**
- 📅 **Sincronización automática** con su calendario personal
- 🔔 **Notificaciones multicanal** (email, móvil, desktop)
- 👨‍⚕️ **Invitación automática** a veterinarios
- 📱 **Acceso desde cualquier dispositivo**
- 🔄 **Sincronización en tiempo real**

### **Para tu Negocio:**
- 🚀 **Diferenciación competitiva** - Pocas apps tienen esta integración
- 💰 **Justificación de precio premium** - Funcionalidad de valor real
- 📈 **Mayor retención** - Los usuarios no pueden vivir sin su calendario
- 🎯 **Casos de uso únicos** - Gestión familiar de mascotas
- 📊 **Datos de engagement** - Métricas de uso de recordatorios

---

## 🚨 **SIGUIENTE PASO INMEDIATO REQUERIDO**

**Para que funcione completamente, necesitas:**

1. **Obtener Google Client ID y API Key** (15-20 minutos)
2. **Configurar las variables de entorno**
3. **Agregar el script de Google al HTML**

**¿Quieres que te guíe paso a paso para obtener las credenciales de Google?** 