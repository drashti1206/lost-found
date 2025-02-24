import React from 'react';
import { X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from './Avatar';

const ItemDetails = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="absolute top-4 right-4 w-96 bg-white rounded-lg shadow-lg overflow-hidden z-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
            <span className={`inline-block px-2 py-1 text-sm rounded-full mt-1 ${
              item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Description */}
          <div>
            <p className="text-gray-600">{item.description}</p>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Location</h3>
            <p className="text-sm text-gray-600">{item.location}</p>
          </div>

          {/* Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Date</h3>
            <p className="text-sm text-gray-600">
              {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
            </p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <Avatar user={{ id: item.userId }} size="sm" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Contact</p>
                <p className="text-sm text-gray-500">
                  Preferred: {item.contactPreference}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Contact Owner
          </button>
          {item.type === 'lost' && (
            <button
              className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              I Found This
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails; 