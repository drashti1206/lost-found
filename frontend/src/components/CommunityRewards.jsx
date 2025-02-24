import React from 'react';
import { Trophy, Star, Shield, Award } from 'lucide-react';

const CommunityRewards = ({ user }) => {
  // Default values if user or stats are undefined
  const stats = user?.stats || {
    itemsFound: 0,
    successfulMatches: 0,
    helpedOthers: 0
  };

  const calculateLevel = (stats) => {
    const points = (stats.itemsFound * 10) + 
                  (stats.successfulMatches * 15) + 
                  (stats.helpedOthers * 5);
    return Math.floor(points / 100) + 1;
  };

  const getNextMilestone = (stats) => {
    const currentPoints = (stats.itemsFound * 10) + 
                         (stats.successfulMatches * 15) + 
                         (stats.helpedOthers * 5);
    const nextLevel = Math.floor(currentPoints / 100) + 1;
    return (nextLevel * 100) - currentPoints;
  };

  // Default badges array
  const badges = [
    'Community Helper',
    'First Find',
    'Problem Solver',
    'Trusted Member'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Community Status</h3>
        <div className="flex items-center space-x-2">
          <Trophy className="text-yellow-500" />
          <span className="text-2xl font-bold">Level {calculateLevel(stats)}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress to Next Level */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to Next Level</span>
            <span>{getNextMilestone(stats)} points needed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${(calculateLevel(stats) % 1) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Badges */}
        <div>
          <h4 className="font-semibold mb-3">Badges Earned</h4>
          <div className="space-y-2">
            {badges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  {index % 4 === 0 && <Trophy className="text-yellow-500" />}
                  {index % 4 === 1 && <Star className="text-blue-500" />}
                  {index % 4 === 2 && <Shield className="text-green-500" />}
                  {index % 4 === 3 && <Award className="text-purple-500" />}
                </div>
                <span className="font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.successfulMatches}
            </div>
            <div className="text-sm text-gray-600">Successful Matches</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.helpedOthers}
            </div>
            <div className="text-sm text-gray-600">People Helped</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityRewards; 