import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationPicker = ({ location, onChange }) => {
  const [pins, setPins] = useState([]);
  const defaultPosition = [40.7128, -74.0060];
  const position = location ? [location.lat, location.lng] : defaultPosition;

  const addPin = async (location) => {
    try {
      // Reverse geocoding to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
      );
      const data = await response.json();
      const address = data.display_name;

      setPins(prev => [...prev, { 
        position: [location.lat, location.lng],
        description: address || 'New Pin',
        address
      }]);
    } catch (error) {
      console.error('Error getting address:', error);
      setPins(prev => [...prev, { 
        position: [location.lat, location.lng],
        description: 'New Pin'
      }]);
    }
  };

  const removePin = (index) => {
    setPins(pins.filter((_, i) => i !== index));
  };

  // Create route lines between pins
  const routeLines = pins.length > 1 ? 
    pins.map((pin, index) => {
      if (index === pins.length - 1) return null;
      return [
        pin.position,
        pins[index + 1].position
      ];
    }).filter(Boolean) : [];

  return (
    <div className="space-y-4">
      <div className="h-[400px] w-full rounded-lg overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          onClick={(e) => {
            const { lat, lng } = e.latlng;
            onChange({ lat, lng });
            addPin({ lat, lng });
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Draw route lines */}
          {routeLines.map((line, index) => (
            <Polyline
              key={index}
              positions={line}
              color="#6366F1"
              weight={4}
            />
          ))}
          
          {/* Draw markers */}
          {pins.map((pin, index) => (
            <Marker 
              key={index} 
              position={pin.position}
              icon={customIcon}
            >
              <Popup>
                <div className="max-w-xs">
                  <p className="font-semibold">Stop {index + 1}</p>
                  <p className="text-sm mt-1">{pin.description}</p>
                  <button 
                    onClick={() => removePin(index)}
                    className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Route Stops</h3>
        </div>
        
        {pins.length === 0 ? (
          <p className="text-gray-500">Click on the map to add stops</p>
        ) : (
          <ul className="space-y-2">
            {pins.map((pin, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div>
                  <span className="font-semibold">Stop {index + 1}:</span>
                  <p className="text-sm text-gray-600 mt-1">{pin.description}</p>
                </div>
                <button
                  onClick={() => removePin(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LocationPicker; 