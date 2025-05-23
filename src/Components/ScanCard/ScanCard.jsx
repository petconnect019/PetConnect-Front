import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ScannedComponent } from '../ScannedComponent/ScannedComponent';
import 'leaflet/dist/leaflet.css';

const ScanLocationMap = ({ scanData }) => {
  // Verificar si tenemos datos de ubicación válidos
  const hasValidLocation = scanData?.location?.latitude && scanData?.location?.longitude;
  
  if (!hasValidLocation) {
    return null;
  }
  
  const position = [scanData.location.latitude, scanData.location.longitude];
  
  return (
    <div className="h-48 rounded-lg overflow-hidden mt-4">
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
            Fecha: {new Date(scanData.scanDate || scanData.createdAt).toLocaleDateString()}
            <br />
            Hora: {new Date(scanData.scanDate || scanData.createdAt).toLocaleTimeString()}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export const ScanCard = ({ scanData }) => {
  const hasLocation = scanData?.location?.latitude && scanData?.location?.longitude;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <ScannedComponent scanData={scanData} />
      {hasLocation && <ScanLocationMap scanData={scanData} />}
    </div>
  );
};