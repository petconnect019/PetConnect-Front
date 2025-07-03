import React, { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff, FiRefreshCw, FiInfo, FiServer, FiX } from 'react-icons/fi';
import { getConnectionState, forceReconnect } from '../../Utils/socket';
import config from '../../Utils/config';

export const ConnectionDiagnostic = ({ show, onClose }) => {
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const runDiagnostic = async () => {
    const socketState = getConnectionState();
    const apiUrl = config.api;
    const socketUrl = config.socket;
    
    // Test API connection
    let apiStatus = 'unknown';
    try {
      const response = await fetch(`${apiUrl}/api/health`, { 
        method: 'GET',
        timeout: 5000 
      });
      apiStatus = response.ok ? 'connected' : 'error';
    } catch (error) {
      apiStatus = 'disconnected';
    }

    setDiagnosticData({
      socket: socketState,
      urls: {
        api: apiUrl,
        socket: socketUrl
      },
      api: {
        status: apiStatus
      },
      env: {
        hasApiUrl: !!import.meta.env.VITE_API_URL,
        hasSocketUrl: !!import.meta.env.VITE_SOCKET_URL,
        isDevelopment: config.isDevelopment,
        isProduction: config.isProduction,
        detectedUrls: {
          api: config.api,
          socket: config.socket
        }
      },
      timestamp: new Date().toLocaleTimeString()
    });
  };

  useEffect(() => {
    if (show) {
      runDiagnostic();
    }
  }, [show]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await runDiagnostic();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleForceReconnect = () => {
    forceReconnect();
    setTimeout(() => runDiagnostic(), 2000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Diagnóstico de Conexión</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Header con estado general */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {diagnosticData?.socket?.connected ? (
                <FiWifi className="text-green-500 w-6 h-6 mr-2" />
              ) : (
                <FiWifiOff className="text-red-500 w-6 h-6 mr-2" />
              )}
              <span className={`font-medium ${diagnosticData?.socket?.connected ? 'text-green-600' : 'text-red-600'}`}>
                {diagnosticData?.socket?.connected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={handleForceReconnect}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Reconectar
              </button>
            </div>
          </div>

          {diagnosticData && (
            <>
              {/* Información del Socket */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <FiServer className="w-4 h-4 mr-1" />
                  Estado del Socket
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>ID del Socket:</span>
                    <span className="font-mono text-xs">{diagnosticData.socket.socketId || 'No asignado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>URL:</span>
                    <span className="font-mono text-xs">{diagnosticData.socket.url || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error:</span>
                    <span className="text-red-600 text-xs">{diagnosticData.socket.connectionError || 'Ninguno'}</span>
                  </div>
                </div>
              </div>

              {/* URLs configuradas */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">URLs Configuradas</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-gray-600">API:</span>
                    <div className="font-mono text-xs bg-white px-2 py-1 rounded mt-1">{diagnosticData.urls.api}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Socket:</span>
                    <div className="font-mono text-xs bg-white px-2 py-1 rounded mt-1">{diagnosticData.urls.socket}</div>
                  </div>
                </div>
              </div>

              {/* Estado de la API */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Estado de la API</h4>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    diagnosticData.api.status === 'connected' ? 'bg-green-500' :
                    diagnosticData.api.status === 'error' ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm capitalize">{diagnosticData.api.status}</span>
                </div>
              </div>

              {/* Configuración automática */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Configuración Automática</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Entorno:</span>
                    <span className={`font-medium ${diagnosticData.env.isDevelopment ? 'text-blue-600' : 'text-green-600'}`}>
                      {diagnosticData.env.isDevelopment ? 'Desarrollo' : 'Producción'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VITE_API_URL:</span>
                    <span className={diagnosticData.env.hasApiUrl ? 'text-green-600' : 'text-orange-600'}>
                      {diagnosticData.env.hasApiUrl ? 'Configurada' : 'Auto-detectada'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VITE_SOCKET_URL:</span>
                    <span className={diagnosticData.env.hasSocketUrl ? 'text-green-600' : 'text-orange-600'}>
                      {diagnosticData.env.hasSocketUrl ? 'Configurada' : 'Auto-detectada'}
                    </span>
                  </div>
                  
                  {/* URLs detectadas */}
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">URLs Detectadas:</div>
                    <div className="font-mono text-xs bg-white px-2 py-1 rounded">
                      API: {diagnosticData.env.detectedUrls.api}
                    </div>
                    <div className="font-mono text-xs bg-white px-2 py-1 rounded mt-1">
                      Socket: {diagnosticData.env.detectedUrls.socket}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recomendaciones */}
              {(!diagnosticData.socket.connected || diagnosticData.api.status !== 'connected') && (
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2 flex items-center">
                    <FiInfo className="w-4 h-4 mr-1" />
                    Recomendaciones
                  </h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {!diagnosticData.socket.connected && (
                      <li>• Verificar que el servidor backend esté ejecutándose en: {diagnosticData.env.detectedUrls.api}</li>
                    )}
                    {diagnosticData.api.status === 'disconnected' && (
                      <li>• Verificar la conexión de red y acceso al servidor</li>
                    )}
                    {diagnosticData.env.isDevelopment && !diagnosticData.env.hasApiUrl && (
                      <li>• Para desarrollo local: Crear archivo .env con VITE_API_URL=http://localhost:3001</li>
                    )}
                    {diagnosticData.env.isProduction && !diagnosticData.socket.connected && (
                      <li>• En producción: Verificar que la URL del backend sea correcta</li>
                    )}
                    <li>• Si el problema persiste, usar el botón "Reconectar" arriba</li>
                  </ul>
                </div>
              )}

              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                Actualizado: {diagnosticData.timestamp}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 