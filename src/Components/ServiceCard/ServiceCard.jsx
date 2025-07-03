import React from 'react';
import './ServiceCard.css';
import { FiMapPin, FiPhone, FiGlobe, FiStar, FiClock } from 'react-icons/fi';

const ServiceCard = ({ service }) => {
  const {
    displayName,
    formattedAddress,
    rating,
    userRatingCount,
    googleMapsUri,
    internationalPhoneNumber,
    regularOpeningHours,
    websiteUri
  } = service;

  const isOpen = regularOpeningHours ? regularOpeningHours.openNow : null;
  const placeType = service.types.includes('veterinary_care') ? 'Veterinaria' : 'Tienda de Mascotas';

  return (
    <div className="service-card">
      <div className="card-header">
        <h3 className="place-name">{displayName?.text}</h3>
        <span className={`place-type ${placeType.replace(/\s+/g, '-').toLowerCase()}`}>{placeType}</span>
      </div>
      
      <div className="place-details">
        <div className="detail-item">
          <FiMapPin className="icon" />
          <span>{formattedAddress}</span>
        </div>

        {rating && (
          <div className="detail-item">
            <FiStar className="icon" style={{ color: '#ffcc00' }} />
            <span>{rating} de 5 estrellas</span>
          </div>
        )}
        
        {isOpen !== null && (
          <div className="detail-item">
            <FiClock className="icon" />
            <span className={`place-status ${isOpen ? 'open' : 'closed'}`}>
              {isOpen ? 'Abierto ahora' : 'Cerrado ahora'}
            </span>
          </div>
        )}
      </div>

      <div className="card-actions">
        {internationalPhoneNumber && (
          <a href={`tel:${internationalPhoneNumber}`} className="action-button call-button">
            <FiPhone /> Llamar
          </a>
        )}
        <a href={googleMapsUri} target="_blank" rel="noopener noreferrer" className="action-button map-button">
          <FiMapPin /> Mapa
        </a>
        {websiteUri && (
          <a href={websiteUri} target="_blank" rel="noopener noreferrer" className="action-button web-button">
            <FiGlobe /> Web
          </a>
        )}
      </div>
    </div>
  );
};

export default ServiceCard; 