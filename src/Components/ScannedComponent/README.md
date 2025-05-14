# ScannedComponent

Este componente muestra información detallada de los escaneos de códigos QR asociados a las mascotas, incluyendo un mapa interactivo de la ubicación del escaneo.

## Dependencias

El componente carga dinámicamente Leaflet desde CDN, pero si prefieres instalarlo como dependencia de npm, sigue estos pasos:

1. Instala Leaflet y React-Leaflet
```bash
npm install leaflet react-leaflet
```

2. Modifica el componente ScannedComponent.jsx para importar Leaflet:
```jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
```

3. Reemplaza el div del mapa con MapContainer de react-leaflet:
```jsx
<MapContainer 
  center={[scanData.ubicacion.latitude, scanData.ubicacion.longitude]} 
  zoom={15} 
  style={{ height: '100%', width: '100%' }}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
  <Marker 
    position={[scanData.ubicacion.latitude, scanData.ubicacion.longitude]}
    icon={petIcon}
  >
    <Popup>
      <b>{scanData.mascotaDetectada}</b><br />
      Escaneado el {scanData.fecha} a las {scanData.hora}<br />
      <small>{scanData.ubicacion.address || `${scanData.departamento}, ${scanData.ciudad}`}</small>
    </Popup>
  </Marker>
</MapContainer>
```

## Uso

Para usar el componente, simplemente importalo y pásale los datos del escaneo:

```jsx
import { ScannedComponent } from '../../Components/ScannedComponent/ScannedComponent';

// ...

<ScannedComponent scanData={scanData} />
```

Los datos deben tener el siguiente formato:

```javascript
{
  mascotaDetectada: "Nombre de la mascota",
  departamento: "Departamento",
  ciudad: "Ciudad",
  fecha: "DD/MM/YYYY",
  hora: "HH:MM",
  ubicacion: {
    latitude: 4.6097,
    longitude: -74.0817,
    address: "Dirección completa (opcional)"
  },
  escaneadoPor: {
    id: "id-usuario",
    nombre: "Nombre de quien escaneó",
    email: "email@ejemplo.com"
  }
}
``` 