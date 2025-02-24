import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check, MapPin, Clock } from 'lucide-react';

const SmartMatch = ({ item }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate match percentage based on various factors
  const calculateMatchScore = (item1, item2) => {
    let score = 0;
    
    // Location proximity (using Haversine formula)
    const distance = calculateDistance(
      item1.location.lat, 
      item1.location.lng,
      item2.location.lat, 
      item2.location.lng
    );
    if (distance < 0.5) score += 40; // Within 500m
    else if (distance < 1) score += 30; // Within 1km
    else if (distance < 2) score += 20; // Within 2km

    // Time proximity
    const timeDiff = Math.abs(new Date(item1.date) - new Date(item2.date));
    if (timeDiff < 86400000) score += 30; // Within 24 hours
    else if (timeDiff < 172800000) score += 20; // Within 48 hours

    // Category match
    if (item1.category === item2.category) score += 20;

    // Tags match
    const commonTags = item1.tags.filter(tag => item2.tags.includes(tag));
    score += (commonTags.length * 5);

    return Math.min(score, 100);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Smart Matches</h3>
      {matches.map((match) => (
        <div key={match.id} className="border-b last:border-0 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-lg ${
                match.score > 80 ? 'bg-green-100' : 
                match.score > 60 ? 'bg-yellow-100' : 'bg-red-100'
              } flex items-center justify-center`}>
                <span className="text-lg font-bold">{match.score}%</span>
              </div>
              <div>
                <h4 className="font-medium">{match.item.name}</h4>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin size={14} className="mr-1" />
                  <span>{match.item.location.address}</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              View Match
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartMatch; 