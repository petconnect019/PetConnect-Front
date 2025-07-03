import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceCard from '../../Components/ServiceCard/ServiceCard';
import { VITE_API_URL } from '../../Utils/config';
import './NearbyServices.css'; // Crearemos este archivo para los estilos

const NearbyServices = () => {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState('locating'); // 'locating', 'fetching', 'success', 'denied', 'error'
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      setError('La geolocalización no es compatible con tu navegador.');
      return;
    }

    const successCallback = async (position) => {
      setStatus('fetching');
      const { latitude, longitude } = position.coords;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${VITE_API_URL}/places/nearby`, {
          params: { latitude, longitude },
          headers: { Authorization: `Bearer ${token}` }
        });
        setServices(response.data.places || []);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError('No se pudieron cargar los servicios cercanos. Inténtalo de nuevo más tarde.');
        console.error(err);
      }
    };

    const errorCallback = (error) => {
      setStatus('denied');
      if (error.code === error.PERMISSION_DENIED) {
        setError('Permiso de ubicación denegado. Activa la ubicación en tu navegador para encontrar servicios cercanos.');
      } else {
        setError('No se pudo obtener tu ubicación.');
      }
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  const renderContent = () => {
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