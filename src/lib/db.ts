import { invoke } from '@tauri-apps/api/core';

// User operations
export async function findOrCreateUser(email: string) {
  return await invoke('find_or_create_user', { email });
}

export async function updateUserTheme(userId: string, theme: {
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  backgroundImage?: string;
}) {
  return await invoke('update_user_theme', { userId, theme });
}

// Link operations
export async function getUserLinks(userId: string) {
  return await invoke('get_user_links', { userId });
}

export async function createLink(userId: string, link: {
  title: string;
  url: string;
  sortOrder: number;
}) {
  return await invoke('create_link', { userId, link });
}

// Agent operations
export async function updateAgentConfig(userId: string, config: {
  prompt: string;
  agentId?: string;
}) {
  return await invoke('update_agent_config', { userId, config });
}

export async function getAgentConfig(userId: string) {
  return await invoke('get_agent_config', { userId });
}

// Payment operations
export async function recordPayment(userId: string, payment: {
  amount: number;
  zapritePaymentId: string;
}) {
  return await invoke('record_payment', { userId, payment });
}

export async function getUserPayments(userId: string) {
  return await invoke('get_user_payments', { userId });
}

// Search operations
export async function searchUsers(query: string) {
  return await invoke('search_users', { query });
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