import React from 'react';
import { Shield, CheckCircle, Clock, Users } from 'lucide-react';

const TrustScore = ({ user }) => {
  const calculateTrustScore = () => {
    let score = 0;
    
    // Base score from successful matches
    score += user.stats.successfulMatches * 10;
    
    // Additional points for helping others
    score += user.stats.helpedOthers * 5;
    
    // Points for account age (assuming we have joinDate)
    const accountAge = (new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24);
    score += Math.min(accountAge / 30, 10) * 5; // Max 50 points for 10 months
    
    // Points for profile completeness
    score += calculateProfileCompleteness(user) * 20;
    
    return Math.min(score, 100);
  };

  const calculateProfileCompleteness = (user) => {
    let completeness = 0;
    if (user.avatar) completeness += 0.2;
    if (user.bio) completeness += 0.2;
    if (user.phone) completeness += 0.2;
    if (user.location) completeness += 0.2;
    if (user.social && Object.keys(user.social).length > 0) completeness += 0.2;
    return completeness;
  };

  const trustScore = calculateTrustScore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Shield className={`w-12 h-12 ${
          trustScore > 80 ? 'text-green-500' :
          trustScore > 60 ? 'text-blue-500' :
          trustScore > 40 ? 'text-yellow-500' : 'text-red-500'
        }`} />
        <div>
          <h3 className="text-xl font-bold">Trust Score</h3>
          <div className="text-3xl font-bold">{Math.round(trustScore)}%</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500" />
            <span>Verified User</span>
          </div>
          <span className="text-sm text-gray-500">+20 points</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="text-blue-500" />
            <span>Response Time</span>
          </div>
          <span className="text-sm text-gray-500">
            {user.stats.averageResponseTime || 'Under 1 hour'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="text-purple-500" />
            <span>Community Rating</span>
          </div>
          <div className="flex items-center">
            {'★'.repeat(Math.floor(trustScore/20))}
            {'☆'.repeat(5 - Math.floor(trustScore/20))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustScore; 