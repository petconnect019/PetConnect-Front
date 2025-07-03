import React, { useState, useEffect } from 'react';
import ServiceCard from '../../Components/ServiceCard/ServiceCard';
import './NearbyServices.css'; // Crearemos este archivo para los estilos
import { cities } from '../../data/cities.js';

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
  const [status, setStatus] = useState('locating'); // 'locating', 'fetching', 'success', 'denied', 'error', 'manual'
  const [error, setError] = useState('');
  const [requiresInteraction, setRequiresInteraction] = useState(false);
  const [manualCity, setManualCity] = useState('');
  const [showOptions, setShowOptions] = useState(false); // muestra UI dual (permitir/seleccionar)

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
    if (isIOS() && isSafari()) {
      setStatus('manual');
      return;
    }
    setStatus('denied');
    if (error.code === error.PERMISSION_DENIED) {
      setError('Permiso de ubicación denegado. Activa la ubicación en tu navegador para encontrar servicios cercanos.');
    } else if (error.code === error.TIMEOUT) {
      setError('La solicitud de ubicación excedió el tiempo límite.');
    } else {
      setError('No se pudo obtener tu ubicación.');
    }
  };

  // Función que se llama al pulsar el botón en iOS Safari
  const requestLocation = () => {
    setRequiresInteraction(false); // Ocultar el botón tras la interacción

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

  // function to handle manual city selection
  const handleManualSearch = () => {
    if (!manualCity) return;
    const selected = cities.find(c => c.name === manualCity);
    if (!selected) return;
    successCallback({ coords: { latitude: selected.latitude, longitude: selected.longitude } });
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setStatus('denied');
      setError('Debes iniciar sesión para acceder a esta función.');
      return;
    }

    // Comprobamos si ya se concedió permiso anteriormente
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestLocation();
        } else if (result.state === 'prompt') {
          // Mostrar opciones al usuario
          setShowOptions(true);
          setStatus('idle');
        } else {
          // denied
          setStatus('manual');
        }
      }).catch(() => {
        // Fallback si Permissions API no está disponible
        if (isIOS() && isSafari()) {
          setRequiresInteraction(true);
        } else {
          setShowOptions(true);
        }
      });
    } else {
      // Si no hay Permissions API mantenemos la lógica previa
      if (isIOS() && isSafari()) {
        setRequiresInteraction(true);
      } else {
        setShowOptions(true);
      }
    }
  }, []);

  const renderContent = () => {
    if (showOptions) {
      return (
        <div className="status-message">
          <p>Para encontrar servicios cercanos puedes permitir tu ubicación o seleccionar tu ciudad.</p>
          <div className="flex flex-col gap-4 w-full mt-2">
            <button onClick={requestLocation} className="action-button map-button">Permitir ubicación</button>
            <div>
              <select className="mt-2 p-2 border rounded w-full" value={manualCity} onChange={(e)=>setManualCity(e.target.value)}>
                <option value="" disabled>Selecciona ciudad</option>
                {cities.map(city => (<option key={city.name} value={city.name}>{city.name}</option>))}
              </select>
              <button disabled={!manualCity} onClick={handleManualSearch} className="action-button map-button w-full mt-2 disabled:opacity-50">Buscar por ciudad</button>
            </div>
          </div>
        </div>
      );
    }
    switch (status) {
      case 'locating':
        return <div className="status-message">🌍 Obteniendo tu ubicación...</div>;
      case 'fetching':
        return <div className="status-message">🔍 Buscando servicios para tu mascota...</div>;
      case 'denied':
        return <div className="status-message error-message">⚠️ {error}</div>;
      case 'error':
        return <div className="status-message error-message">😢 {error}</div>;
      case 'success':
        return services.length > 0 ? (
          <div className="services-list">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="status-message">🤷‍♀️ No se encontraron servicios cercanos.</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="nearby-services-container">
      <h1 className="page-title">Servicios Cercanos</h1>
      {renderContent()}
    </div>
  );
};

export default NearbyServices; 