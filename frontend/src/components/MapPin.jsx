import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { formatDistanceToNow } from 'date-fns';

// Custom icons for lost and found items
const createCustomIcon = (type) => {
  return L.divIcon({
    className: `custom-pin ${type}`,
    html: `<div class="pin-container ${type}">
      <div class="pin-icon ${type === 'lost' ? 'bg-red-500' : 'bg-green-500'}">
        ${type === 'lost' ? '?' : '✓'}
      </div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const lostIcon = createCustomIcon('lost');
const foundIcon = createCustomIcon('found');

const MapPin = ({ item, onPinClick }) => {
  const icon = item.type === 'lost' ? lostIcon : foundIcon;
  
  return (
    <Marker
      position={[item.latitude, item.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onPinClick && onPinClick(item)
      }}
    >
      <Popup>
        <div className="min-w-[200px]">
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.userId}`}
              alt="User avatar"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
            </span>
          </div>
          <div className="mt-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapPin; 