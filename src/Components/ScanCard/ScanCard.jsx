import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ScannedComponent } from '../ScannedComponent/ScannedComponent';
import 'leaflet/dist/leaflet.css';

const ScanLocationMap = ({ scanData }) => {
  if (!scanData || !scanData.location || !scanData.location.latitude || !scanData.location.longitude) {
    return (
      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No hay datos de ubicación disponibles</p>
      </div>
    );
  }
  
  const position = [scanData.location.latitude, scanData.location.longitude];
  
  return (
    <div className="h-48 rounded-lg overflow-hidden">
      <MapContainer 
        center={position} 
        zoom={14} 
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            {scanData.location.address || 'Ubicación de escaneo'}
            <br />
            {scanData.fecha} {scanData.hora}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export const ScanCard = ({ scanData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <ScannedComponent scanData={scanData} />
      <ScanLocationMap scanData={scanData} />
    </div>
  );
}; 