# Documentación PetConnect

## Descripción General del Proyecto

PetConnect es una aplicación web progresiva (PWA) desarrollada en React que permite a los usuarios conectar, gestionar y rastrear sus mascotas. La aplicación ofrece funcionalidades como registro de usuarios, autenticación, creación de perfiles de mascotas, vinculación con códigos QR y gestión de datos de mascotas.

## Tecnologías Utilizadas

- **React**: Biblioteca principal para la construcción de la interfaz de usuario
- **Vite**: Herramienta de construcción y desarrollo
- **Tailwind CSS**: Framework de CSS para el diseño
- **Workbox/VitePWA**: Para funcionalidades de PWA (Progressive Web App)
- **Yup**: Para validación de formularios
- **ESLint**: Para linting y garantizar buenas prácticas de código
- **Urbanist**: Fuente principal de la aplicación

## Estructura del Proyecto

```
📁 Proyecto
│
├── 📁 src
│   ├── 📁 assets
│   │   ├── 📁 fonts          # Fuentes (Urbanist)
│   │   └── 📁 images         # Imágenes y recursos gráficos
│   │
│   ├── 📁 Components         # Componentes reutilizables
│   │   ├── 📁 AddTagContainer
│   │   ├── 📁 Buttons
│   │   ├── 📁 FooterNav
│   │   ├── 📁 GoogleAuth
│   │   └── ... (otros componentes)
│   │
│   ├── 📁 Contexts           # Contextos de React para estado global
│   │   ├── 📁 AuthContext
│   │   ├── 📁 HasPetsUser
│   │   ├── 📁 IsFetchedPets
│   │   ├── 📁 PetContext
│   │   └── ... (otros contextos)
│   │
│   ├── 📁 Hooks              # Custom hooks para lógica reutilizable
│   │   ├── 📁 useFetchAddPet
│   │   ├── 📁 useFetchLinkPet
│   │   ├── 📁 useFetchLogin
│   │   └── ... (otros hooks)
│   │
│   ├── 📁 Pages              # Componentes de página
│   │   ├── 📁 Home
│   │   ├── 📁 Login
│   │   ├── 📁 Register
│   │   ├── 📁 PetProfile
│   │   └── ... (otras páginas)
│   │
│   ├── 📁 Utils              # Utilidades y helpers
│   │   ├── 📁 Data-Schema
│   │   ├── 📁 Fetch
│   │   ├── 📁 Helpers
│   │   └── 📁 PetBreeds
│   │
│   ├── 📁 Validations        # Esquemas de validación
│   │
│   ├── 📁 routes             # Configuración de rutas
│   │
│   ├── App.jsx               # Componente principal
│   ├── App.css               # Estilos globales
│   └── main.jsx              # Punto de entrada
│
├── 📁 dev-dist               # Archivos de desarrollo para PWA
├── index.html                # Archivo HTML principal
├── package.json              # Dependencias y scripts
├── eslint.config.js          # Configuración de ESLint
└── vite.config.js            # Configuración de Vite y PWA
```

## Componentes Principales

### Componentes de UI

- **ButtonPrimary/ButtonSecondary**: Botones estilizados para acciones primarias y secundarias
- **InputField/PasswordField**: Campos de entrada con estilos y validación
- **FooterNav**: Navegación principal en la parte inferior de la aplicación
- **ModalResponse**: Componente para mostrar mensajes de respuesta
- **ToggleButton**: Botón de alternancia para opciones binarias

### Componentes Funcionales

- **GoogleSignUp**: Integración con autenticación de Google
- **ProtectRoute**: Componente HOC para proteger rutas privadas
- **PetTypeSelector**: Selector para el tipo de mascota
- **ScannerScreens**: Conjunto de componentes para la funcionalidad de escaneo

## Contextos

- **AuthContext**: Gestiona el estado de autenticación del usuario
- **PetContext**: Administra los datos de las mascotas del usuario
- **HasPetsUser**: Indica si el usuario tiene mascotas registradas
- **IsFetchedPets**: Controla el estado de carga de mascotas
- **ResetPasswordContext**: Gestiona el flujo de restablecimiento de contraseña

## Custom Hooks

Los hooks personalizados encapsulan la lógica de negocio y las operaciones con la API:

- **useFetchLogin**: Maneja el proceso de inicio de sesión
- **useFetchRegister**: Gestiona el registro de usuarios
- **useFetchAddPet**: Permite añadir nuevas mascotas
- **useFetchPets**: Recupera el listado de mascotas del usuario
- **useFetchLinkPet**: Vincula una mascota con un código QR
- **useFetchUpdatePet**: Actualiza la información de una mascota
- **useFetchUpdateUser**: Actualiza la información del usuario

## Flujos de Trabajo Principales

### Autenticación

1. El usuario puede registrarse a través de `Register.jsx` o iniciar sesión desde `Login.jsx`
2. Se admite inicio de sesión tradicional con correo/contraseña o a través de Google
3. Tras la autenticación exitosa, se almacena el token en `localStorage`
4. El hook `isTokenExpired` verifica la validez del token y `FetchRefreshToken` lo actualiza cuando es necesario

### Gestión de Mascotas

1. Los usuarios pueden agregar mascotas nuevas desde `NewPet1.jsx`
2. La información como tipo, raza y características se almacena mediante `useFetchAddPet`
3. Se pueden actualizar los datos de mascotas existentes con `useFetchUpdatePet`
4. Los perfiles de mascotas se muestran en `PetProfile.jsx` y `PublicPetProfile.jsx`

### Sistema de QR

1. Los códigos QR se pueden vincular a mascotas específicas
2. El escaneo se maneja a través de `Scanner.jsx` y los componentes en `ScannerScreens`
3. Cuando se escanea un QR, se muestra información relevante según su estado (vinculado o no)

## Utilidades y Helpers

- **ConvertDateFormat**: Convierte fechas al formato requerido
- **getQrId**: Extrae el ID de un QR desde un enlace
- **isTokenExpired**: Verifica si un token JWT ha expirado
- **City/Department**: Datos estructurados para ubicaciones en Colombia
- **PetBreeds**: Listas de razas de perros y gatos

## Configuración PWA

La aplicación está configurada como PWA mediante VitePWA en `vite.config.js`, incluyendo:

- Estrategias de caché para diferentes tipos de recursos
- Manifest con iconos y metadatos
- Service Worker autogenerado para funcionalidades offline

## Validaciones

Se utilizan esquemas de Yup para validar formularios:

- **registerSchema**: Valida el formulario de registro con requisitos para correo y contraseña

## Guía de Despliegue

### Requisitos Previos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install
# o
yarn

# Iniciar entorno de desarrollo
npm run dev
# o
yarn dev
```

### Construcción para producción

```bash
# Construir la aplicación
npm run build
# o
yarn build

# Previsualizar la versión de producción
npm run preview
# o
yarn preview
```

## Buenas Prácticas Implementadas

- **Estructura de carpetas organizada**: Separación clara de componentes, páginas y lógica
- **Context API**: Uso de contextos de React para la gestión global del estado
- **Custom Hooks**: Separación de la lógica de negocio en hooks reutilizables
- **Validación de formularios**: Implementación de validaciones con Yup
- **Manejo de tokens**: Implementación de verificación y renovación de tokens
- **Componentes reutilizables**: Construcción de componentes UI genéricos y reutilizables

## Consideraciones para el Mantenimiento

- Los tokens de autenticación se gestionan en el localStorage
- La renovación de tokens se maneja automáticamente con `FetchRefreshToken`
- Todas las peticiones a la API están centralizadas en los archivos de la carpeta Utils/Fetch
- Los estilos se gestionan principalmente con Tailwind CSS y algunos componentes tienen CSS propio