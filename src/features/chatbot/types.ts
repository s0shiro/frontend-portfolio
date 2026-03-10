export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponseData {
  sessionId: string;
  message: string;
  type: 'command' | 'conversation';
}

export interface ChatResponse {
  success: boolean;
  data: ChatResponseData;
}
