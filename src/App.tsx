import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { invoke } from "@tauri-apps/api/core";
import { MainLayout } from './components/layout/MainLayout';
import { PodPage } from './components/pod/PodPage';
import { Login } from './components/auth/Login';
import { SearchPods } from './components/search/SearchPods';
import { WalletSettings } from './components/wallet/WalletSettings';
import { AgentEditor } from './components/agent/AgentEditor';
import { AppearanceSettings } from './components/settings/AppearanceSettings';
import "./App.css";

function App() {
  // Keep the invoke function for Tauri commands
  async function greet(name: string) {
    return await invoke("greet", { name });
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PodPage />} />
          <Route path="pod/:id" element={<PodPage />} />
          <Route path="search" element={<SearchPods />} />
          <Route path="wallet" element={<WalletSettings />} />
          <Route path="agent" element={<AgentEditor />} />
          <Route path="appearance" element={<AppearanceSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;