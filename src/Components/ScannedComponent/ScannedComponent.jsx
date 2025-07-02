import React from 'react';
import { FiMapPin, FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import PropTypes from 'prop-types';
import './ScannedComponent.css';
import { useNavigate } from 'react-router-dom';


export const ScannedComponent = ({ scanData }) => {
  const navigate = useNavigate();
  if (!scanData) return null;
  console.log(scanData);
  

  const { fecha, hora, location, scannedBy } = scanData;
  const hasLocation = location && location.latitude && location.longitude;
  const hasUser = scannedBy && scannedBy._id;
  
  // Function to format address
  const formatAddress = () => {
    if (!location) return 'Ubicación no disponible';
    
    const addressParts = [];
    if (location.address) addressParts.push(location.address);
    if (location.ciudad) addressParts.push(location.ciudad);
    if (location.departamento) addressParts.push(location.departamento);
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'Ubicación no disponible';
  };

  // Function to handle redirection to user profile
  const handleViewUserProfile = () => {
    if (hasUser) {
      navigate(`/user-profile/${scannedBy._id}`);
    }
  };

  // Function to open Google Maps with the scanned location
  const handleOpenMaps = () => {
    if (hasLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6">
      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-3">
        Escaneo registrado
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-start">
          <FiCalendar className="text-orange-500 mr-2 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Fecha</p>
            <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700">{fecha || 'No disponible'}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <FiClock className="text-orange-500 mr-2 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Hora</p>
            <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700">{hora || 'No disponible'}</p>
          </div>
        </div>
        
        <div className="flex items-start col-span-2">
          <FiMapPin className="text-orange-500 mr-2 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-gray-500">Ubicación</p>
            <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700">{formatAddress()}</p>
            {hasLocation && (
              <button
                onClick={handleOpenMaps}
                className="mt-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-2 rounded transition-colors"
              >
                Ver en Google Maps
              </button>
            )}
          </div>
        </div>
        
        {/* User information */}
        {hasUser && (
          <div className="flex items-start col-span-2 mt-2">
            <FiUser className="text-orange-500 mr-2 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-500">Escaneado por</p>
              <div className="flex justify-between items-center">
                <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700">
                  {scannedBy.name || 'Usuario'}
                </p>
                <button 
                  onClick={handleViewUserProfile}
                  className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 py-1 px-2 rounded transition-colors"
                >
                  Ver perfil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ScannedComponent.propTypes = {
  scanData: PropTypes.shape({
    mascotaDetectada: PropTypes.string,
    departamento: PropTypes.string,
    ciudad: PropTypes.string,
    fecha: PropTypes.string,
    hora: PropTypes.string,
    location: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      address: PropTypes.string,
      ciudad: PropTypes.string,
      departamento: PropTypes.string
    }),
    scannedBy: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      profile_picture: PropTypes.string
    })
  }).isRequired,
}; 