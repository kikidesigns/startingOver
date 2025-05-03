import { useState } from 'react';

export const AgentChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{text: string; isUser: boolean}>>([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    
    try {
      // TODO: Implement OpenAgents API call
      // const response = await fetch('https://openagents.com/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message, agentId: '...' })
      // });
      
      // Temporary mock response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "Hello! I'm the POD's AI assistant. How can I help you today?",
          isUser: false
        }]);
      }, 1000);
      
      setMessage('');
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Chat with POD Assistant</h3>
      
      <div className="h-64 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.isUser
                ? 'bg-blue-100 ml-auto'
                : 'bg-gray-100'
            } max-w-[80%]`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};