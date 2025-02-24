import React from 'react';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      title: 'New Match Found',
      message: 'We found a potential match for your lost item.',
      time: '2 hours ago',
      isRead: false,
    },
    {
      id: 2,
      title: 'Status Update',
      message: 'Your report has been processed.',
      time: '1 day ago',
      isRead: true,
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      <div className="bg-white rounded-lg shadow">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b last:border-b-0 ${
              !notification.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-gray-600 mt-1">{notification.message}</p>
                <span className="text-sm text-gray-500 mt-2">{notification.time}</span>
              </div>
              {!notification.isRead && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications; 