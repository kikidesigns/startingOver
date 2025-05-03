import { invoke } from '@tauri-apps/api';

// User operations
export async function findOrCreateUser(email: string) {
  try {
    return await invoke('find_or_create_user', { email });
  } catch (error) {
    console.error('Error in findOrCreateUser:', error);
    throw error;
  }
}

export async function updateUserTheme(userId: string, theme: {
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  backgroundImage?: string;
}) {
  try {
    return await invoke('update_user_theme', { userId, theme });
  } catch (error) {
    console.error('Error in updateUserTheme:', error);
    throw error;
  }
}

// Link operations
export async function getUserLinks(userId: string) {
  try {
    return await invoke('get_user_links', { userId });
  } catch (error) {
    console.error('Error in getUserLinks:', error);
    throw error;
  }
}

export async function createLink(userId: string, link: {
  title: string;
  url: string;
  sortOrder: number;
}) {
  try {
    return await invoke('create_link', { userId, link });
  } catch (error) {
    console.error('Error in createLink:', error);
    throw error;
  }
}

// Agent operations
export async function updateAgentConfig(userId: string, config: {
  prompt: string;
  agentId?: string;
}) {
  try {
    return await invoke('update_agent_config', { userId, config });
  } catch (error) {
    console.error('Error in updateAgentConfig:', error);
    throw error;
  }
}

export async function getAgentConfig(userId: string) {
  try {
    return await invoke('get_agent_config', { userId });
  } catch (error) {
    console.error('Error in getAgentConfig:', error);
    throw error;
  }
}

// Payment operations
export async function recordPayment(userId: string, payment: {
  amount: number;
  zapritePaymentId: string;
}) {
  try {
    return await invoke('record_payment', { userId, payment });
  } catch (error) {
    console.error('Error in recordPayment:', error);
    throw error;
  }
}

export async function getUserPayments(userId: string) {
  try {
    return await invoke('get_user_payments', { userId });
  } catch (error) {
    console.error('Error in getUserPayments:', error);
    throw error;
  }
}

// Search operations
export async function searchUsers(query: string) {
  try {
    return await invoke('search_users', { query });
  } catch (error) {
    console.error('Error in searchUsers:', error);
    throw error;
  }
}

// Types
export interface User {
  id: string;
  email: string;
  zapriteKey?: string;
  agentId?: string;
  theme?: Theme;
}

export interface Theme {
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  backgroundImage?: string;
}

export interface Link {
  id: string;
  userId: string;
  title: string;
  url: string;
  sortOrder: number;
}

export interface AgentConfig {
  userId: string;
  prompt: string;
  agentId?: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  zapritePaymentId: string;
  date: string;
}