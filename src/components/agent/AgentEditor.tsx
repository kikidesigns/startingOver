import { useState, useEffect } from 'react';
import { updateAgentConfig } from '../../lib/db';

export const AgentEditor = () => {
  const [prompt, setPrompt] = useState('');
  const [agentId, setAgentId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    // TODO: Load existing agent config from DB
    loadAgentConfig();
  }, []);

  const loadAgentConfig = async () => {
    try {
      // TODO: Get actual user ID from auth context
      const userId = 'current-user-id';
      // Load agent config from DB
    } catch (error) {
      console.error('Error loading agent config:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Get actual user ID from auth context
      const userId = 'current-user-id';
      
      // Create/update agent on OpenAgents
      const agentResponse = await fetch('https://openagents.com/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          // Add other agent configuration as needed
        })
      });
      const agentData = await agentResponse.json();
      setAgentId(agentData.agentId);

      // Save to local DB
      await updateAgentConfig(userId, prompt);
    } catch (error) {
      console.error('Error saving agent config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testMessage.trim() || !agentId) return;

    try {
      const response = await fetch('https://openagents.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agentId,
          message: testMessage
        })
      });
      const data = await response.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error testing agent:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Agent Editor</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Configure Your Agent</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Prompt/Context
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="w-full p-2 border rounded"
            placeholder="You are the personal steward of this POD..."
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:bg-blue-300"
        >
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Test Your Agent</h2>
        
        <div className="mb-4">
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
          disabled={!agentId}
          className="w-full bg-green-500 text-white py-2 px-4 rounded disabled:bg-green-300 mb-4"
        >
          Test Agent
        </button>

        {response && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Agent Response:</h3>
            <p className="text-gray-600 bg-gray-50 p-3 rounded">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};