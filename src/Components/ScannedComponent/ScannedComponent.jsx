import { useRef, useEffect } from 'react';
import { FiMapPin, FiCalendar, FiClock, FiMap, FiNavigation2 } from 'react-icons/fi';
import { MdPets } from 'react-icons/md';
import PropTypes from 'prop-types';
import './ScannedComponent.css';

export const ScannedComponent = ({ scanData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Si no hay datos de ubicación o no se ha cargado Leaflet, no renderizar el mapa
    if (!scanData?.ubicacion?.latitude || !scanData?.ubicacion?.longitude || !window.L) {
      return;
    }

    // Si ya existe una instancia del mapa, limpiarla
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Inicializar el mapa
    const map = window.L.map(mapRef.current).setView(
      [scanData.ubicacion.latitude, scanData.ubicacion.longitude], 
      15
    );

    // Añadir tile layer (OpenStreetMap)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Crear icono personalizado de mascota
    const petIcon = window.L.divIcon({
      html: `<div class="pet-marker">
              <div class="pet-marker-inner">
                <i class="pet-icon">🐾</i>
              </div>
            </div>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    // Añadir marcador con icono personalizado
    const marker = window.L.marker(
      [scanData.ubicacion.latitude, scanData.ubicacion.longitude], 
      { icon: petIcon }
    ).addTo(map);

    // Añadir popup con información
    marker.bindPopup(`
      <b>${scanData.mascotaDetectada}</b><br>
      Escaneado el ${scanData.fecha} a las ${scanData.hora}<br>
      <small>${scanData.ubicacion.address || `${scanData.departamento}, ${scanData.ciudad}`}</small>
    `).openPopup();

    // Guardar referencias para limpieza
    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Invalidar tamaño del mapa después de que se haya renderizado
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Limpieza al desmontar
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [scanData]);

  const handleOpenMapView = () => {
    if (scanData?.ubicacion?.latitude && scanData?.ubicacion?.longitude) {
      // Abrir en la aplicación de mapas nativa usando el esquema mapview
      window.location.href = `mapview://?latitude=${scanData.ubicacion.latitude}&longitude=${scanData.ubicacion.longitude}`;
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:scale-[1.01]">
      {/* Encabezado */}
      <div className="p-4 bg-gradient-to-r from-orange-100 to-amber-50 border-b">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <MdPets className="mr-2 text-orange-500" /> 
          Mascota detectada
        </h3>
      </div>

      {/* Información principal */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Departamento */}
          <div className="flex flex-col">
            <div className="flex items-center mb-1 text-gray-500 text-sm">
              <FiMapPin className="mr-1 text-orange-500" /> Departamento
            </div>
            <p className="font-medium text-gray-900 truncate">{scanData?.departamento || 'No disponible'}</p>
          </div>

          {/* Ciudad */}
          <div className="flex flex-col">
            <div className="flex items-center mb-1 text-gray-500 text-sm">
              <FiMapPin className="mr-1 text-orange-500" /> Ciudad
            </div>
            <p className="font-medium text-gray-900 truncate">{scanData?.ciudad || 'No disponible'}</p>
          </div>

          {/* Fecha */}
          <div className="flex flex-col">
            <div className="flex items-center mb-1 text-gray-500 text-sm">
              <FiCalendar className="mr-1 text-orange-500" /> Fecha
            </div>
            <p className="font-medium text-gray-900">{scanData?.fecha || 'No disponible'}</p>
          </div>

          {/* Hora */}
          <div className="flex flex-col">
            <div className="flex items-center mb-1 text-gray-500 text-sm">
              <FiClock className="mr-1 text-orange-500" /> Hora
            </div>
            <p className="font-medium text-gray-900">{scanData?.hora || 'No disponible'}</p>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-4 relative">
          <div 
            ref={mapRef} 
            className="w-full h-48 rounded-lg overflow-hidden border border-gray-200"
            style={{ background: '#f0f0f0' }}
          >
            {(!scanData?.ubicacion?.latitude || !scanData?.ubicacion?.longitude) && (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                <FiMap className="mr-2" /> No hay ubicación disponible
              </div>
            )}
          </div>

          {/* Botón abrir mapa */}
          {scanData?.ubicacion?.latitude && scanData?.ubicacion?.longitude && (
            <button 
              onClick={handleOpenMapView}
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-orange-50 transition-colors"
              title="Abrir en aplicación de mapas"
            >
              <FiNavigation2 className="text-orange-500" />
            </button>
          )}
        </div>

        {/* Información de quien escaneó */}
        {scanData?.escaneadoPor && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Escaneado por: <span className="font-medium text-gray-700">{scanData.escaneadoPor.nombre}</span>
            </p>
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
    ubicacion: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      address: PropTypes.string,
    }),
    escaneadoPor: PropTypes.shape({
      id: PropTypes.string,
      nombre: PropTypes.string,
      email: PropTypes.string,
    }),
  }).isRequired,
}; 