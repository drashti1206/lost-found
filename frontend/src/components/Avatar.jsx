import React from 'react';

const Avatar = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const seed = user?.name || user?.email || user?.id || 'default';
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

  return (
    <img
      src={avatarUrl}
      alt={`${user?.name || 'User'}'s avatar`}
      className={`${sizeClasses[size]} rounded-full border-2 border-white shadow-sm`}
    />
  );
};

export default Avatar; 