// Configuración automática de URLs según el entorno
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
const isProduction = import.meta.env.PROD;

// URLs base según el entorno
const getBaseUrls = () => {
  // Si hay variables de entorno específicas, usarlas
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_SOCKET_URL) {
    return {
      api: import.meta.env.VITE_API_URL,
      socket: import.meta.env.VITE_SOCKET_URL
    };
  }

  // Configuración automática
  if (isDevelopment) {
    return {
      api: 'http://localhost:3001',
      socket: 'http://localhost:3001'
    };
  }

  // En producción, detectar automáticamente
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const socketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  
  // URLs de Railway - detectar automáticamente o usar variable de entorno
  // Puedes configurar VITE_RAILWAY_URL con tu URL real de Railway
  const railwayUrl = import.meta.env.VITE_RAILWAY_URL || 
                    import.meta.env.VITE_API_URL ||
                    // URL real de tu Railway (confirmada funcionando):
                    'https://petconnect-backend-production.up.railway.app';
  
  return {
    api: railwayUrl,
    socket: railwayUrl
  };
};

const config = {
  ...getBaseUrls(),
  isDevelopment,
  isProduction,
  
  // Configuración del socket
  socketOptions: {
    transports: ['websocket', 'polling'],
    upgrade: true,
    rememberUpgrade: true,
    autoConnect: false,
    forceNew: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 5,
    timeout: 20000,
    pingTimeout: 60000,
    pingInterval: 25000
  }
};

console.log('🔧 Configuración de PetConnect:', {
  entorno: isDevelopment ? 'desarrollo' : 'producción',
  api: config.api,
  socket: config.socket,
  hostname: window.location.hostname,
  protocol: window.location.protocol
});

export default config; 