import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatbotWidget } from './ChatbotWidget';

vi.mock('../api', () => ({
  useChatMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I am Neilven's AI. What would you like to know about my experience, skills, or projects?",
  type: 'conversation',
};

const cachedUserMessage = {
  id: 'cached-user-message',
  role: 'user',
  content: 'Tell me about your projects',
  type: 'conversation',
};

describe('ChatbotWidget', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
    localStorage.clear();
  });

  it('only shows the clear control when cached chat history exists', async () => {
    const user = userEvent.setup();

    render(<ChatbotWidget />);
    await user.click(screen.getByRole('button', { name: /open chat/i }));

    expect(screen.queryByRole('button', { name: /clear chat history/i })).not.toBeInTheDocument();
  });

  it('clears cached messages and the chat session when requested', async () => {
    const user = userEvent.setup();
    localStorage.setItem('chat_messages', JSON.stringify([welcomeMessage, cachedUserMessage]));
    localStorage.setItem('chat_session_id', 'session-123');

    render(<ChatbotWidget />);
    await user.click(screen.getByRole('button', { name: /open chat/i }));

    expect(screen.getByText(cachedUserMessage.content)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear chat history/i }));

    expect(screen.queryByText(cachedUserMessage.content)).not.toBeInTheDocument();
    expect(screen.getByText(welcomeMessage.content)).toBeInTheDocument();
    expect(localStorage.getItem('chat_session_id')).toBeNull();

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('chat_messages') ?? '[]')).toEqual([welcomeMessage]);
    });
  });
});
