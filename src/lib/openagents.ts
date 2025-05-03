// OpenAgents API configuration
const OPENAGENTS_API_URL = 'https://openagents.com/api';

interface AgentConfig {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  systemMessage?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class OpenAgentsService {
  private apiKey: string;
  private agentId: string | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${OPENAGENTS_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`OpenAgents API error: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  async createAgent(config: AgentConfig) {
    const response = await this.fetchApi('/agent', {
      method: 'POST',
      body: JSON.stringify({
        prompt: config.prompt,
        temperature: config.temperature || 0.7,
        maxTokens: config.maxTokens || 150,
        systemMessage: config.systemMessage || 'You are a helpful AI assistant.',
      }),
    });

    this.agentId = response.agentId;
    return response;
  }

  async updateAgent(agentId: string, config: Partial<AgentConfig>) {
    return await this.fetchApi(`/agent/${agentId}`, {
      method: 'PATCH',
      body: JSON.stringify(config),
    });
  }

  async deleteAgent(agentId: string) {
    return await this.fetchApi(`/agent/${agentId}`, {
      method: 'DELETE',
    });
  }

  async chat(message: string, agentId?: string) {
    const targetAgentId = agentId || this.agentId;
    if (!targetAgentId) {
      throw new Error('No agent ID provided or set');
    }

    return await this.fetchApi('/chat', {
      method: 'POST',
      body: JSON.stringify({
        agentId: targetAgentId,
        message,
      }),
    });
  }

  async getChatHistory(agentId?: string) {
    const targetAgentId = agentId || this.agentId;
    if (!targetAgentId) {
      throw new Error('No agent ID provided or set');
    }

    return await this.fetchApi(`/chat/${targetAgentId}/history`);
  }

  setAgentId(agentId: string) {
    this.agentId = agentId;
  }

  getAgentId() {
    return this.agentId;
  }
}

// Create a context for the OpenAgents service
export const createPodAgent = async (username: string, description: string) => {
  const systemMessage = `You are the personal steward of ${username}'s POD. 
Your role is to:
- Help visitors understand ${username}'s work and offerings
- Share relevant links and information
- Encourage Bitcoin/Lightning support through Zaprite
- Maintain a friendly, professional tone
- Stay focused on ${username}'s content and purpose

POD Description:
${description}`;

  const config: AgentConfig = {
    prompt: `As ${username}'s POD assistant, help visitors discover their content and support their work.`,
    systemMessage,
    temperature: 0.7,
    maxTokens: 150
  };

  const service = new OpenAgentsService(process.env.OPENAGENTS_API_KEY || '');
  const agent = await service.createAgent(config);
  return agent;
};