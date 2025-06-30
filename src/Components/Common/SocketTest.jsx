import React, { useState } from 'react';
import { io } from 'socket.io-client';

const SocketTest = () => {
  const [testResult, setTestResult] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const runSocketTest = () => {
    setIsTesting(true);
    setTestResult('🔄 Iniciando test de conexión socket...\n');
    
    const serverUrl = 'https://petconnect-backend-production.up.railway.app';
    const token = sessionStorage.getItem('accessToken');
    
    if (!token) {
      setTestResult(prev => prev + '❌ No se encontró token en sessionStorage\n');
      setIsTesting(false);
      return;
    }

    setTestResult(prev => prev + `🔗 Conectando a: ${serverUrl}\n`);
    setTestResult(prev => prev + `🔐 Token: ${token.substring(0, 20)}...\n`);

    const testSocket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 10000
    });

    const cleanup = () => {
      testSocket.disconnect();
      setIsTesting(false);
    };

    testSocket.on('connect', () => {
      setTestResult(prev => prev + `✅ ¡Socket conectado! ID: ${testSocket.id}\n`);
      setTimeout(cleanup, 2000);
    });

    testSocket.on('connect_error', (error) => {
      setTestResult(prev => prev + `❌ Error de conexión: ${error.message}\n`);
      setTestResult(prev => prev + `   Tipo: ${error.type}\n`);
      setTestResult(prev => prev + `   Detalles: ${JSON.stringify(error, null, 2)}\n`);
      cleanup();
    });

    testSocket.on('auth_error', (error) => {
      setTestResult(prev => prev + `❌ Error de autenticación: ${error}\n`);
      cleanup();
    });

    testSocket.on('error', (error) => {
      setTestResult(prev => prev + `❌ Error general: ${error}\n`);
      cleanup();
    });

    setTimeout(() => {
      if (isTesting && !testSocket.connected) {
        setTestResult(prev => prev + '⏰ Timeout - conexión no establecida en 10s\n');
        cleanup();
      }
    }, 10000);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-3">🔧 Test de Conexión Socket</h3>
      
      <button
        onClick={runSocketTest}
        disabled={isTesting}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isTesting ? 'Ejecutando...' : 'Ejecutar Test'}
      </button>

      {testResult && (
        <div className="mt-4 p-3 bg-black text-green-400 rounded font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
          {testResult}
        </div>
      )}
    </div>
  );
};

export default SocketTest; 