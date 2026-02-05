import { ChatMessage, ChatResponse } from '@/types/chat';

const API_BASE = '/api/chat';

/**
 * Get the initial AI greeting message.
 */
export async function getGreeting(): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/greeting`);
  if (!response.ok) {
    throw new Error(`Failed to get greeting: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Send a message to the AI and get a response with extracted fields.
 */
export async function sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || 'Failed to send message');
  }

  return response.json();
}
