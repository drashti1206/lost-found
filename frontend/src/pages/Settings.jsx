import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Lock, Globe, User, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    matches: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    locationSharing: true,
    contactInfo: 'registered'
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Settings updated successfully');
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Privacy settings updated');
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Picture</p>
              <p className="text-sm text-gray-500">Update your profile photo</p>
            </div>
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
              Change
            </button>
          </div>
          <div>
            <p className="font-medium">Bio</p>
            <textarea
              className="mt-1 w-full p-2 border rounded-lg"
              rows="3"
              defaultValue={user?.bio}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">{key} Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive {key} notifications about your items
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={value}
                  onChange={() => handleNotificationChange(key)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Privacy Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-gray-500">Control who can see your profile</p>
            </div>
            <select
              className="p-2 border rounded-lg"
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
            >
              <option value="public">Public</option>
              <option value="registered">Registered Users</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Location Sharing</p>
              <p className="text-sm text-gray-500">Share your location with others</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={privacy.locationSharing}
                onChange={() => handlePrivacyChange('locationSharing', !privacy.locationSharing)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 