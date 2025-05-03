import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export const Sidebar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <div 
      className="fixed left-0 top-0 h-full w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 space-y-8">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xl font-bold">P</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
            PODS
          </span>
        </div>
        
        <nav className="space-y-1">
          {[
            { path: '/', label: 'Home', icon: '🏠' },
            { path: '/search', label: 'Search PODs', icon: '🔍' },
            { path: '/wallet', label: 'Wallet & Payments', icon: '💳' },
            { path: '/agent', label: 'Edit Agent', icon: '🤖' },
            { path: '/appearance', label: 'Appearance', icon: '🎨' },
          ].map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActiveLink(path)
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full px-4 py-3 flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200">
            <span className="text-xl">👋</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};