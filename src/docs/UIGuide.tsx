import { useState } from 'react';
import { Login } from '../components/auth/Login';
import { PodPage } from '../components/pod/PodPage';
import { SearchPods } from '../components/search/SearchPods';
import { WalletSettings } from '../components/wallet/WalletSettings';
import { AgentEditor } from '../components/agent/AgentEditor';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { MainLayout } from '../components/layout/MainLayout';

const screens = [
  { id: 'login', name: 'Login', component: Login },
  { id: 'pod', name: 'POD Page', component: PodPage },
  { id: 'search', name: 'Search PODs', component: SearchPods },
  { id: 'wallet', name: 'Wallet Settings', component: WalletSettings },
  { id: 'agent', name: 'Agent Editor', component: AgentEditor },
  { id: 'appearance', name: 'Appearance Settings', component: AppearanceSettings }
];

export const UIGuide = () => {
  const [activeScreen, setActiveScreen] = useState('login');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">PODS UI Guide</h1>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {screens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => setActiveScreen(screen.id)}
                className={`px-4 py-2 rounded ${
                  activeScreen === screen.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {screen.name}
              </button>
            ))}
          </div>
        </div>

        {/* Screen Preview */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">
            {screens.find(s => s.id === activeScreen)?.name}
          </h2>

          <div className="border rounded-lg overflow-hidden">
            {screens.find(s => s.id === activeScreen)?.component({})}
          </div>
        </div>

        {/* Screen Documentation */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Documentation</h2>

          {activeScreen === 'login' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Login Screen</h3>
              <p>Simple email-based authentication for MVP:</p>
              <ul className="list-disc pl-6">
                <li>Email-only login (no password required)</li>
                <li>Creates/fetches user from local SQLite database</li>
                <li>Redirects to main POD page after login</li>
              </ul>
            </div>
          )}

          {activeScreen === 'pod' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">POD Page</h3>
              <p>Main content display for each user's POD:</p>
              <ul className="list-disc pl-6">
                <li>Custom links with sorting</li>
                <li>Bitcoin/Lightning donation button via Zaprite</li>
                <li>Embedded AI chatbot using OpenAgents</li>
                <li>Edit mode for POD owners</li>
                <li>Theme customization applied</li>
              </ul>
            </div>
          )}

          {activeScreen === 'search' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Search PODs</h3>
              <p>Find other users' PODs:</p>
              <ul className="list-disc pl-6">
                <li>Search by email/username</li>
                <li>Real-time search results</li>
                <li>Click to view POD pages</li>
                <li>Loading states and error handling</li>
              </ul>
            </div>
          )}

          {activeScreen === 'wallet' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Wallet Settings</h3>
              <p>Manage Bitcoin/Lightning payments:</p>
              <ul className="list-disc pl-6">
                <li>Zaprite API key configuration</li>
                <li>Wallet balance display</li>
                <li>Bitcoin & Lightning addresses</li>
                <li>Transaction history</li>
                <li>Copy-to-clipboard functionality</li>
              </ul>
            </div>
          )}

          {activeScreen === 'agent' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Agent Editor</h3>
              <p>Configure your POD's AI assistant:</p>
              <ul className="list-disc pl-6">
                <li>OpenAgents API key setup</li>
                <li>Prompt/context configuration</li>
                <li>System message customization</li>
                <li>Temperature and token settings</li>
                <li>Test interface with live preview</li>
              </ul>
            </div>
          )}

          {activeScreen === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Appearance Settings</h3>
              <p>Customize your POD's look:</p>
              <ul className="list-disc pl-6">
                <li>Background color/image selection</li>
                <li>Text and link color customization</li>
                <li>Live preview of changes</li>
                <li>Theme persistence in database</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};