import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Camera, Upload, X, MapPin } from 'lucide-react';

const ReportLost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    date: '',
    time: '',
    type: 'lost', // or 'found'
    reward: '',
    tags: '',
  });

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/items', {
          params: {
            _limit: 5,
            _sort: 'date',
            _order: 'desc'
          }
        });
        setRecentItems(response.data);
      } catch (error) {
        console.error('Error fetching recent items:', error);
        toast.error('Failed to load recent items');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemData = {
        ...formData,
        userId: user.id,
        status: 'pending',
        date: new Date().toISOString(),
        tags: formData.tags.split(',').map(tag => tag.trim()),
        image: imagePreview || 'https://via.placeholder.com/150',
      };

      const response = await api.post('/items', itemData);
      toast.success('Item reported successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Error reporting item');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Form */}
        <div className="lg:col-span-2">
          <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Report an Item</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Item Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'lost' })}
                    className={`p-4 text-center rounded-lg border ${
                      formData.type === 'lost'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-red-500 hover:bg-red-50'
                    }`}
                  >
                    Lost Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'found' })}
                    className={`p-4 text-center rounded-lg border ${
                      formData.type === 'found'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                    }`}
                  >
                    Found Item
                  </button>
                </div>

                {/* Item Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="electronics">Electronics</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="documents">Documents</option>
                      <option value="pets">Pets</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., phone, black, samsung"
                    />
                  </div>

                  {formData.type === 'lost' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Reward (optional)
                      </label>
                      <input
                        type="number"
                        value={formData.reward}
                        onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter amount in INR"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Recent Reports Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    item.type === 'lost' ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <MapPin size={12} className="mr-1" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportLost; 