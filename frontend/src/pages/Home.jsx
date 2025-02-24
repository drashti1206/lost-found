import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { itemService } from '../services/api';
import MapPin from '../components/MapPin';
import ItemDetails from '../components/ItemDetails';
import { Link } from 'react-router-dom';
import { Search, PlusCircle } from 'lucide-react';

const Home = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeReports: 0,
    itemsFound: 0,
    recentMatches: 0
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await itemService.getAll();
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await itemService.getStats();
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handlePinClick = (item) => {
    setSelectedItem(item);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="relative h-screen">
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {items.map(item => (
          <MapPin
            key={item.id}
            item={item}
            onPinClick={handlePinClick}
          />
        ))}
      </MapContainer>

      {selectedItem && (
        <ItemDetails
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Overlays with higher z-index */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Quick Actions */}
        <div className="absolute top-8 left-8 space-y-4 pointer-events-auto">
          <Link
            to="/search"
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          >
            <Search size={20} className="text-blue-600" />
            <span className="text-sm font-medium">Search Items</span>
          </Link>
          <Link
            to="/report"
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          >
            <PlusCircle size={20} className="text-blue-600" />
            <span className="text-sm font-medium">Report Lost Item</span>
          </Link>
        </div>

        {/* Stats Panel */}
        <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg pointer-events-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-500">Active Reports</p>
              <p className="text-xl font-bold text-blue-600">{stats.activeReports}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Items Found</p>
              <p className="text-xl font-bold text-green-600">{stats.itemsFound}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Recent Matches</p>
              <p className="text-xl font-bold text-orange-600">{stats.recentMatches}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;