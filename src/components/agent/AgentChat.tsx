import { useState, useEffect, useRef } from 'react';
import { OpenAgentsService } from '../../lib/openagents';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentChatProps {
  agentId?: string;
  apiKey?: string;
}

export const AgentChat = ({ agentId, apiKey }: AgentChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const agentService = useRef<OpenAgentsService | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (apiKey) {
      agentService.current = new OpenAgentsService(apiKey);
      if (agentId) {
        agentService.current.setAgentId(agentId);
        loadChatHistory();
      }
    }
  }, [apiKey, agentId]);

  const loadChatHistory = async () => {
    if (!agentService.current) return;

    try {
      const history = await agentService.current.getChatHistory();
      setMessages(history.messages);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history');
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !agentService.current) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setError(null);
    setIsLoading(true);

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await agentService.current.chat(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to send message');
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Chat with POD Assistant</h3>
      </div>

      <div 
        ref={chatContainerRef}
        className="h-[400px] overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 rounded-lg p-3">
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 text-sm py-2">
            {error}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !agentId}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim() || !agentId}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        
        {!agentId && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            Chat is not available. Please configure the POD assistant first.
          </p>
        )}
      </div>
    </div>
  );
};