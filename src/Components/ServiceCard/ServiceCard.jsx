import React from 'react';
import './ServiceCard.css';

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
      
      {rating && (
        <div className="place-rating">
          <span className="rating-score">{rating} ★</span>
          <span className="rating-count">({userRatingCount} opiniones)</span>
        </div>
      )}

      <p className="place-address">{formattedAddress}</p>
      
      {isOpen !== null && (
        <div className={`place-status ${isOpen ? 'open' : 'closed'}`}>
          {isOpen ? 'Abierto ahora' : 'Cerrado ahora'}
        </div>
      )}

      <div className="card-actions">
        {internationalPhoneNumber && (
          <a href={`tel:${internationalPhoneNumber}`} className="action-button call-button">
            Llamar
          </a>
        )}
        <a href={googleMapsUri} target="_blank" rel="noopener noreferrer" className="action-button map-button">
          Ver en Mapa
        </a>
        {websiteUri && (
          <a href={websiteUri} target="_blank" rel="noopener noreferrer" className="action-button web-button">
            Sitio Web
          </a>
        )}
      </div>
    </div>
  );
};

export default ServiceCard; 