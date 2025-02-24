import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle } from 'lucide-react';

// Simple menu icons using SVG
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
        { path: '/search', icon: <Search size={20} />, label: 'Search' },
        { path: '/report', icon: <PlusCircle size={20} />, label: 'Report Item' },
      ]
    },
    // ... rest of your menu items
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">Lost & Found</h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/search" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Search
            </Link>
            <Link to="/report" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Report Item
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/search"
              className="block text-gray-700 hover:text-blue-600 px-3 py-2"
              onClick={() => setIsOpen(false)}
            >
              Search
            </Link>
            <Link
              to="/report"
              className="block text-gray-700 hover:text-blue-600 px-3 py-2"
              onClick={() => setIsOpen(false)}
            >
              Report Item
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left text-red-500 px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 