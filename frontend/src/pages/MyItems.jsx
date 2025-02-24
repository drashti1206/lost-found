import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, Tag, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const MyItems = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, lost, found

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get(`/items?userId=${user.id}`);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
        toast.error('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user.id]);

  const filteredItems = items.filter(item => 
    filter === 'all' ? true : item.type === filter
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setFilter('lost')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'lost' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Lost Items
        </button>
        <button
          onClick={() => setFilter('found')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'found' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Found Items
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {item.image && (
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.type === 'lost' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {item.type}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                {item.category && (
                  <div className="flex items-center">
                    <Tag size={16} className="mr-2" />
                    <span>{item.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No items found</p>
        </div>
      )}
    </div>
  );
};

export default MyItems; 