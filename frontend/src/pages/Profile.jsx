import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, Mail, Calendar, Award, Camera, Phone, 
  MessageCircle, Share2, Edit, Github, Linkedin 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingSkeleton from '../components/LoadingState';
import TrustScore from '../components/TrustScore';
import CommunityRewards from '../components/CommunityRewards';
import SmartMatch from '../components/SmartMatch';

// Lazy load components
const TrustScoreLazy = React.lazy(() => import('../components/TrustScore'));
const CommunityRewardsLazy = React.lazy(() => import('../components/CommunityRewards'));
const SmartMatchLazy = React.lazy(() => import('../components/SmartMatch'));

const Profile = () => {
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userItems, setUserItems] = useState([]);
  const [displayUser, setDisplayUser] = useState(null);
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Get user's items
        const itemsResponse = await api.get(`/items?userId=${user.id}`);
        setUserItems(itemsResponse.data);

        // Set display user to current user if no specific user is being viewed
        setDisplayUser(user);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  // Construct avatar URL with all necessary parameters
  const getAvatarUrl = (seed) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,91e2c3&clothingColor=1e319d,7c1ea3,e0ddff,ffeba4,ffd5dc,6bd9e9&eyes=happy&eyebrows=default&mouth=smile&skinColor=f2d3b1`;
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!displayUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${displayUser.name}'s Profile`,
        text: 'Check out my Lost & Found profile!',
        url: window.location.href
      });
    } catch (error) {
      toast.error('Sharing failed');
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Content */}
        <div className="lg:col-span-2">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="px-6 py-4 relative">
              <div className="absolute -top-16 left-6">
                <img
                  src={getAvatarUrl(displayUser.name)}
                  alt={displayUser.name}
                  className="w-32 h-32 rounded-full border-4 border-white bg-white"
                  onError={() => setImageError(true)}
                />
              </div>
              <div className="ml-36 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{displayUser.name}</h1>
                  <p className="text-gray-600">{displayUser.bio}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Contact
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User's Items */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {userItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <MapPin size={16} className="mr-1" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Suspense fallback={<div className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>}>
            <TrustScoreLazy user={displayUser} />
          </Suspense>
          <Suspense fallback={<div className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>}>
            <CommunityRewardsLazy user={displayUser} />
          </Suspense>
          {item && (
            <Suspense fallback={<div className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>}>
              <SmartMatchLazy item={item} />
            </Suspense>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Contact {displayUser.name}</h3>
            <div className="space-y-4">
              {displayUser.phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-600" />
                  <span>{displayUser.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-gray-600" />
                <span>{displayUser.email}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MessageCircle className="text-gray-600" />
                <span>Send a message</span>
              </div>
            </div>
            <button
              onClick={() => setShowContactModal(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 