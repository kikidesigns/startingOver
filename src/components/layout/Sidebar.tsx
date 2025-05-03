import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4">
      <div className="space-y-6">
        <div className="text-xl font-bold">PODS</div>
        
        <nav className="space-y-2">
          <Link to="/" className="block p-2 hover:bg-gray-800 rounded">
            Home
          </Link>
          <Link to="/search" className="block p-2 hover:bg-gray-800 rounded">
            Search PODs
          </Link>
          <Link to="/wallet" className="block p-2 hover:bg-gray-800 rounded">
            Wallet & Payments
          </Link>
          <Link to="/agent" className="block p-2 hover:bg-gray-800 rounded">
            Edit Agent
          </Link>
          <Link to="/appearance" className="block p-2 hover:bg-gray-800 rounded">
            Appearance
          </Link>
        </nav>

        <div className="pt-4 border-t border-gray-700">
          <button className="w-full p-2 text-left hover:bg-gray-800 rounded">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};