import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const ScanMap = ({ 
  scans, 
  height = "100%", 
  zoom = 12,
  title,
  showTitle = false,
  className = "",
  markerContent = (scan) => `Ubicación de escaneo: ${scan.fecha} ${scan.hora}`
}) => {
  // Filtrar escaneos que tienen datos de ubicación
  const validScans = scans.filter(scan => 
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
    <div className={`bg-white rounded-lg overflow-hidden ${className}`}>
      {showTitle && title && (
        <h3 className="text-lg font-semibold text-gray-800 p-4">{title}</h3>
      )}
      <div style={{ height }} className="w-full">
        <MapContainer 
          center={center} 
          zoom={zoom} 
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
                {typeof markerContent === 'function' ? markerContent(scan) : markerContent}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}; 