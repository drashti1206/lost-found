import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Star, Shield, Award, Target, Users, ThumbsUp } from 'lucide-react';

const Achievements = () => {
  const { user } = useAuth();

  const achievements = [
    {
      title: 'First Find',
      description: 'Found your first item',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      completed: user.stats.itemsFound > 0
    },
    {
      title: 'Helper',
      description: 'Helped 5 people find their items',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      completed: user.stats.helpedOthers >= 5
    },
    {
      title: 'Match Maker',
      description: 'Made 3 successful matches',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      completed: user.stats.successfulMatches >= 3
    },
    // Add more achievements as needed
  ];

  const levels = [
    { level: 1, points: 0, title: 'Beginner' },
    { level: 2, points: 100, title: 'Helper' },
    { level: 3, points: 250, title: 'Trusted Member' },
    { level: 4, points: 500, title: 'Expert Finder' },
    { level: 5, points: 1000, title: 'Community Leader' }
  ];

  const calculatePoints = () => {
    return (user.stats.itemsFound * 10) +
           (user.stats.successfulMatches * 15) +
           (user.stats.helpedOthers * 5);
  };

  const currentPoints = calculatePoints();
  const currentLevel = levels.find(l => l.points <= currentPoints);
  const nextLevel = levels.find(l => l.points > currentPoints);

  return (
    <div className="w-full">
      {/* Level Progress */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">{currentLevel.title}</h2>
            <p className="text-gray-600">Level {currentLevel.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Points</p>
            <p className="text-2xl font-bold text-blue-600">{currentPoints}</p>
          </div>
        </div>
        
        {nextLevel && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Level {nextLevel.level}</span>
              <span>{nextLevel.points - currentPoints} points needed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(currentPoints / nextLevel.points) * 100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <div 
            key={index}
            className={`bg-white rounded-lg shadow-lg p-6 ${
              achievement.completed ? 'border-2 border-green-500' : 'opacity-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${achievement.bgColor}`}>
                <achievement.icon 
                  size={24} 
                  className={achievement.color}
                />
              </div>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements; 