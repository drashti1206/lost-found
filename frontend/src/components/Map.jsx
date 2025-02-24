import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Custom marker icons for different types
const createCustomIcon = (color) => {
  return L.icon({
    iconUrl: `/markers/${color}-marker.svg`,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  });
};

const lostIcon = createCustomIcon('red');
const foundIcon = createCustomIcon('green');
const userIcon = createCustomIcon('user');

const Map = ({ items = [], center, zoom = 5 }) => {
  const defaultCenter = [20.5937, 78.9629]; // India's center coordinates
  const mapCenter = center || defaultCenter;

  return (
    <div className="map-container">
      <MapContainer 
        center={mapCenter}
        zoom={zoom}
        className="leaflet-container"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Sample markers */}
        <Marker position={[28.6139, 77.2090]} icon={lostIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">Lost Item in Delhi</h3>
              <p className="text-sm">Sample item</p>
            </div>
          </Popup>
        </Marker>

        {/* Dynamic markers */}
        {items.map((item) => (
          <Marker 
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={item.type === 'lost' ? lostIcon : foundIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm">{item.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map; 