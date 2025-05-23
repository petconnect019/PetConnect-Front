import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const AllScansMap = ({ scanHistory, selectedPet }) => {
  if (!scanHistory || scanHistory.length === 0) {
    return null;
  }
  
  // Filtrar escaneos que tienen datos de ubicación
  const validScans = scanHistory.filter(scan => 
    scan.location && scan.location.latitude && scan.location.longitude
  );
  
  if (validScans.length === 0) {
    return null;
  }
  
  // Calcular el centro del mapa (promedio de todas las ubicaciones)
  const center = validScans.reduce(
    (acc, scan) => {
      return [
        acc[0] + scan.location.latitude / validScans.length,
        acc[1] + scan.location.longitude / validScans.length
      ];
    },
    [0, 0]
  );
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Mapa de escaneos</h3>
      <div className="h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg overflow-hidden">
        <MapContainer 
          center={center} 
          zoom={12} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {validScans.map((scan, index) => (
            <Marker 
              key={`marker-${index}`} 
              position={[scan.location.latitude, scan.location.longitude]}
            >
              <Popup>
                <strong>{selectedPet?.name || 'Mascota'}</strong><br />
                {scan.location.address || 'Ubicación de escaneo'}<br />
                Escaneado: {scan.fecha} {scan.hora}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}; 