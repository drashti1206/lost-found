import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Search, PlusCircle, Settings, 
  Bell, User, HelpCircle, LogOut,
  MapPin, Award, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMapPage = location.pathname === '/'; // Check if we're on home/map page

  const menuItems = [
    {
      title: 'Main',
      items: [
        { path: '/', icon: <Home size={20} />, label: 'Home' },
        { path: '/search', icon: <Search size={20} />, label: 'Search' },
        { path: '/report', icon: <PlusCircle size={20} />, label: 'Report Item' },
      ]
    },
    {
      title: 'Personal',
      items: [
        { path: '/notifications', icon: <Bell size={20} />, label: 'Notifications', badge: '3' },
        { path: '/profile', icon: <User size={20} />, label: 'Profile' },
        { path: '/my-items', icon: <MapPin size={20} />, label: 'My Items' },
        { path: '/achievements', icon: <Award size={20} />, label: 'Achievements' },
      ]
    },
    {
      title: 'Other',
      items: [
        { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
        { path: '/help', icon: <HelpCircle size={20} />, label: 'Help & Support' },
      ]
    }
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const Sidebar = ({ isStatic = false }) => (
    <aside className={`
      ${isStatic ? 'hidden lg:flex' : 'flex'}
      ${!isStatic && (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')}
      flex-col fixed lg:static inset-y-0 left-0 z-50 w-64 
      bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
      ${isMapPage ? 'lg:bg-opacity-90' : ''} // Semi-transparent on map page
    `}>
      <div className="flex flex-col h-full">
        {/* Logo and Close Button */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">Lost & Found</h1>
          {!isStatic && (
            <button onClick={closeSidebar} className="lg:hidden p-2">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto pt-5 pb-4">
          {menuItems.map((section, index) => (
            <div key={index} className="px-3 mb-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={item.path}
                    onClick={closeSidebar}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center w-full group"
          >
            <Avatar user={user} size="md" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {user?.name}
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                Logout
              </p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex">
      {/* Static Sidebar - Only visible on large screens */}
      <Sidebar isStatic={true} />

      {/* Mobile Sidebar - Only visible on small screens when menu is open */}
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
          <Sidebar />
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header - Only visible on small screens */}
        <header className={`
          lg:hidden bg-white border-b border-gray-200 
          ${isMapPage ? 'bg-opacity-90' : ''} 
          p-4 flex items-center justify-between
        `}>
          <button 
            onClick={toggleSidebar} 
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-blue-600">Lost & Found</h1>
          <div className="w-8" />
        </header>

        {/* Main Content Area - Adjusted for map page */}
        <main className={`
          flex-1 overflow-y-auto bg-gray-50 
          ${isMapPage ? 'p-0' : 'p-4'}
        `}>
          <div className={`
            w-full 
            ${isMapPage ? '' : 'max-w-7xl mx-auto pt-8 lg:pt-16'}
          `}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 