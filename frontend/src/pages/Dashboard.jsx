import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Your Items</h3>
          <div className="text-3xl font-bold text-blue-600">{user?.stats?.itemsFound || 0}</div>
          <p className="text-gray-600">Items Found</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Lost Items</h3>
          <div className="text-3xl font-bold text-red-600">{user?.stats?.itemsLost || 0}</div>
          <p className="text-gray-600">Items Lost</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
          <div className="text-3xl font-bold text-green-600">
            {user?.stats?.successfulMatches || 0}
          </div>
          <p className="text-gray-600">Successful Matches</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Add your recent activity items here */}
          <div className="p-4 border-b">
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 