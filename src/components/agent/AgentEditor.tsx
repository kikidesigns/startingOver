import { useState, useEffect } from 'react';
import { OpenAgentsService, createPodAgent } from '../../lib/openagents';
import { updateAgentConfig } from '../../lib/db';

interface AgentConfig {
  prompt: string;
  systemMessage?: string;
  temperature?: number;
  maxTokens?: number;
}

export const AgentEditor = () => {
  const [config, setConfig] = useState<AgentConfig>({
    prompt: '',
    systemMessage: '',
    temperature: 0.7,
    maxTokens: 150
  });
  const [agentId, setAgentId] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      // TODO: Get actual user data from auth context
      const userId = 'current-user-id';
      const username = 'current-user';
      
      // Load agent config from DB
      // const userConfig = await loadUserAgentConfig(userId);
      // setConfig(userConfig);
      // setAgentId(userConfig.agentId);
      
      // Load API key from environment or secure storage
      const savedApiKey = process.env.OPENAGENTS_API_KEY;
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    } catch (error) {
      console.error('Error loading config:', error);
      setError('Failed to load configuration');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // TODO: Get actual user data from auth context
      const userId = 'current-user-id';
      const username = 'current-user';

      const agentService = new OpenAgentsService(apiKey);

      if (agentId) {
        // Update existing agent
        await agentService.updateAgent(agentId, config);
      } else {
        // Create new agent
        const agent = await createPodAgent(username, config.systemMessage || '');
        setAgentId(agent.agentId);
      }

      // Save to local DB
      await updateAgentConfig(userId, config.prompt);

      // Show success message
      setError('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      setError('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testMessage.trim() || !agentId || !apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const agentService = new OpenAgentsService(apiKey);
      agentService.setAgentId(agentId);
      
      const response = await agentService.chat(testMessage);
      setTestResponse(response.message);
    } catch (error) {
      console.error('Error testing agent:', error);
      setError('Failed to test agent');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Agent Editor</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Configure Your Agent</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAgents API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your OpenAgents API key"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Prompt
            </label>
            <textarea
              value={config.prompt}
              onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
              rows={4}
              className="w-full p-2 border rounded"
              placeholder="Enter the main prompt for your agent..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Message
            </label>
            <textarea
              value={config.systemMessage}
              onChange={(e) => setConfig({ ...config, systemMessage: e.target.value })}
              rows={4}
              className="w-full p-2 border rounded"
              placeholder="Enter system message (context and instructions)..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                max="2048"
                value={config.maxTokens}
                onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || !apiKey}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>

          {error && (
            <p className="text-sm text-red-500 mt-2">
              {error}
            </p>
          )}
        </div>
      </div>

      {agentId && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Your Agent</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Message
              </label>
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter a test message..."
              />
            </div>

            <button
              onClick={handleTest}
              disabled={isLoading || !testMessage.trim()}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-green-300"
            >
              {isLoading ? 'Testing...' : 'Test Agent'}
            </button>

            {testResponse && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Agent Response:</h3>
                <div className="bg-gray-50 p-4 rounded">
                  {testResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};