import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { ScannedComponent } from '../ScannedComponent/ScannedComponent';
import 'leaflet/dist/leaflet.css';
import { FiMapPin } from 'react-icons/fi';

const ScanLocationMap = ({ location }) => {
  const position = [location.latitude, location.longitude];
  
  return (
    <div className="h-48 rounded-lg overflow-hidden mt-4 border">
      <MapContainer 
        center={position} 
        zoom={14} 
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}></Marker>
      </MapContainer>
    </div>
  );
};

const ManualLocationInfo = ({ location }) => {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center text-gray-700">
        <FiMapPin className="mr-3 text-orange-500 text-xl" />
        <div>
          <p className="font-semibold text-sm">Dirección registrada:</p>
          <p className="text-gray-600 text-base">{location.address}</p>
        </div>
      </div>
    </div>
  );
};

export const ScanCard = ({ scanData }) => {
  // Unificar el acceso a la ubicación
  const location = scanData?.location || scanData?.ubicacion;

  const hasCoordinates = location?.latitude != null && location?.longitude != null;
  const hasAddress = location?.address && location.address !== 'No disponible';

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col h-full">
      <div className="flex-grow">
        <ScannedComponent scanData={scanData} />
      </div>
      
      {hasCoordinates ? (
        <ScanLocationMap location={location} />
      ) : hasAddress ? (
        <ManualLocationInfo location={location} />
      ) : (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
          <p>No hay datos de ubicación para este escaneo.</p>
        </div>
      )}
    </div>
  );
}; 