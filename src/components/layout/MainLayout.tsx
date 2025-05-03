import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-2xl shadow-xl p-6 transition-all duration-300">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};