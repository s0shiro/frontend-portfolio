import { useMutation } from '@tanstack/react-query';
import { clientEnv } from '@/lib/env';
import type { ChatRequest, ChatResponse } from './types';

export const useChatMutation = () => {
  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: async (data: ChatRequest) => {
      const response = await fetch(`${clientEnv.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
  });
};
