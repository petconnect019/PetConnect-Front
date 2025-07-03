import React, { useState, useEffect } from 'react';
import ServiceCard from '../../Components/ServiceCard/ServiceCard';
import './NearbyServices.css'; // Crearemos este archivo para los estilos
import { cities } from '../../data/cities.js';
import { IoArrowBack } from "react-icons/io5"; // Importar icono de flecha

// Utilidad para detectar iOS
const isIOS = () => {
  return /iP(hone|od|ad)/.test(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
};

// Utilidad para detectar Safari (excluyendo Chrome en iOS)
const isSafari = () => {
  const ua = navigator.userAgent;
  return ua.includes('Safari') && !ua.includes('Chrome');
};

const NearbyServices = () => {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState('initializing'); // initializing, awaiting_user_choice, locating, fetching, success, denied, error
  const [error, setError] = useState('');
  const [manualCity, setManualCity] = useState('');

  // Primero declaramos los callbacks para que estén disponibles antes de usarlos
  const successCallback = async (position) => {
    const { latitude, longitude } = position.coords;
    setStatus('fetching');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setStatus('denied');
        setError('Debes iniciar sesión para acceder a esta función.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/places/nearby?latitude=${latitude}&longitude=${longitude}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        setStatus('denied');
        setError('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        return;
      }

      if (!response.ok) {
        throw new Error('La respuesta del servidor no fue exitosa.');
      }

      const data = await response.json();
      setServices(data.places || []);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError('No se pudieron cargar los servicios cercanos. Inténtalo de nuevo más tarde.');
      console.error(err);
    }
  };

  const errorCallback = (error) => {
    setStatus('awaiting_user_choice');
    if (error.code === error.PERMISSION_DENIED) {
      setError('Permiso denegado. Inténtalo de nuevo o selecciona una ciudad.');
    } else {
      setError('No se pudo obtener tu ubicación. Por favor, selecciona una ciudad.');
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus('denied');
      setError('La geolocalización no es compatible con tu navegador.');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  };

  const handleManualSearch = () => {
    if (!manualCity) return;
    const selected = cities.find(c => c.name === manualCity);
    if (!selected) return;
    setStatus('fetching');
    successCallback({ coords: { latitude: selected.latitude, longitude: selected.longitude } });
  };

  const handleReturnToChoice = () => {
    setStatus('awaiting_user_choice');
    setError(''); // Limpiar errores previos
    setServices([]); // Limpiar resultados
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setStatus('denied');
      setError('Debes iniciar sesión para acceder a esta función.');
      return;
    }

    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestLocation();
        } else {
          setStatus('awaiting_user_choice');
        }
      }).catch(() => {
        setStatus('awaiting_user_choice');
      });
    } else {
      setStatus('awaiting_user_choice');
    }
  }, []);

  const renderContent = () => {
    switch (status) {
      case 'initializing':
        return <div className="status-message">Inicializando...</div>;
      
      case 'awaiting_user_choice':
        return (
          <div className="status-message">
            <p>Para encontrar servicios cercanos, permite tu ubicación o selecciona una ciudad.</p>
            {error && <p className="text-sm error-message mt-2">{error}</p>}
            
            <div className="location-options">
              <button onClick={requestLocation} className="action-button">Permitir ubicación</button>
              <div className="or-divider">o</div>
              <div className="city-selector-container">
                <select className="city-selector" value={manualCity} onChange={(e) => setManualCity(e.target.value)}>
                  <option value="" disabled>Selecciona tu ciudad</option>
                  {cities.map(city => (<option key={city.name} value={city.name}>{city.name}</option>))}
                </select>
                <button disabled={!manualCity} onClick={handleManualSearch} className="action-button">Buscar</button>
              </div>
            </div>
          </div>
        );
      
      case 'locating':
        return <div className="status-message">🌍 Obteniendo tu ubicación...</div>;
        
      case 'fetching':
        return <div className="status-message">🔍 Buscando servicios para tu mascota...</div>;
        
      case 'denied':
        // Este caso puede mostrar un mensaje más específico o redirigir
        return (
          <div className="status-message">
            <p className="error-message">⚠️ {error}</p>
            <div className="location-options mt-4">
               <button onClick={handleReturnToChoice} className="action-button">Volver a intentar</button>
            </div>
          </div>
        );

      case 'error':
        return <div className="status-message error-message">😢 {error}</div>;
        
      case 'success':
        return (
          <>
            <div className="flex items-center mb-4">
              <button onClick={handleReturnToChoice} className="p-2 mr-2 text-2xl text-gray-600 hover:text-gray-900">
                <IoArrowBack />
              </button>
              <h2 className="text-xl font-bold text-gray-800">Resultados</h2>
            </div>
            {services.length > 0 ? (
              <div className="services-list">{services.map(service => <ServiceCard key={service.id} service={service} />)}</div>
            ) : (
              <div className="status-message">
                <p>🤷‍♀️ No se encontraron servicios cercanos.</p>
                <button onClick={handleReturnToChoice} className="action-button mt-4">Buscar de nuevo</button>
              </div>
            )}
          </>
        );
        
      default:
        return <div className="status-message">Cargando...</div>;
    }
  };

  return (
    <div className="nearby-services-container">
      {status !== 'success' && <h1 className="page-title">Servicios Cercanos</h1>}
      {renderContent()}
    </div>
  );
};

export default NearbyServices; 