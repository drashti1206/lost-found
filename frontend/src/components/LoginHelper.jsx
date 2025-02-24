import React from 'react';

const LoginHelper = () => {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <h3 className="text-sm font-medium text-blue-800">Demo Accounts:</h3>
      <div className="mt-2 text-sm text-blue-700">
        <p>1. John Doe</p>
        <ul className="ml-4 list-disc">
          <li>Email: john@example.com</li>
          <li>Password: password123</li>
        </ul>
        <p className="mt-2">2. Alice Smith</p>
        <ul className="ml-4 list-disc">
          <li>Email: alice@example.com</li>
          <li>Password: alice123</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginHelper; 