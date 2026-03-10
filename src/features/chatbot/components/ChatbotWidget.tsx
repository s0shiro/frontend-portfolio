import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, GripHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatMutation } from '../api';
import { TypewriterMessage } from './TypewriterMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface MessagePayload {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'command' | 'conversation';
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessagePayload[]>(() => {
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch {
        console.error('Failed to parse cached chat messages');
      }
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I am Neilven's AI. What would you like to know about my experience, skills, or projects?",
        type: 'conversation',
      }
    ];
  });
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>(() => {
    return localStorage.getItem('chat_session_id') || undefined;
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: sendMessage, isPending } = useChatMutation();

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('chat_session_id', sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    // Small timeout ensures DOM is fully updated before scrolling
    const timeoutId = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isPending, isOpen]);

  useEffect(() => {
    // Re-focus the input after the AI finishes replying
    if (!isPending && isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPending, isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim() || isPending) return;

    const userMsg: MessagePayload = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      type: 'conversation',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    sendMessage(
      { message: userMsg.content, sessionId },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            setSessionId(res.data.sessionId);
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: res.data.message,
                type: res.data.type,
              },
            ]);
          }
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const commandVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            dragConstraints={{ left: -800, right: 0, top: -800, bottom: 0 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] sm:w-[400px]"
            style={{ touchAction: "none" }}
          >
            <Card className="flex h-[500px] flex-col overflow-hidden border border-border bg-background/60 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3 cursor-move active:cursor-grabbing">
                <div className="flex items-center gap-2">
                  <GripHorizontal className="h-4 w-4 text-muted-foreground mr-1" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Portfolio AI</h3>
                    <p className="text-xs text-muted-foreground">DigitalOcean Serverless</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-4 pt-4">
                  <div className="flex flex-col gap-4 pb-4">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial="hidden"
                        animate="visible"
                        variants={commandVariants}
                        transition={{ delay: index * 0.05 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className={msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>

                        <div className={`flex max-w-[80%] flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          {msg.type === 'command' ? (
                            <div className="rounded-xl border border-border bg-muted/50 p-3 text-sm prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-p:my-1 prose-ul:my-1 prose-li:my-0 pb-1">
                              <div>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`rounded-2xl px-4 py-2 text-sm ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted/50 text-foreground prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-p:my-1 prose-ul:my-1 prose-li:my-0 pb-1'
                              }`}
                            >
                              {msg.role === 'user' ? (
                                msg.content
                              ) : (
                                index === messages.length - 1 && msg.id !== 'welcome' ? (
                                  <TypewriterMessage content={msg.content} />
                                ) : (
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {isPending && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 flex-row">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-muted">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex max-w-[80%] items-center gap-1 rounded-2xl bg-muted/50 px-4 py-2 text-sm text-foreground">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s]"></span>
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.15s]"></span>
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50"></span>
                        </div>
                      </motion.div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
              </div>

              <div className="shrink-0 border-t border-border bg-muted/30 p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Ask about my projects..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isPending}
                    className="flex-1 bg-background"
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 whitespace-nowrap" onClick={() => handleSend('/projects')}>/projects</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 whitespace-nowrap" onClick={() => handleSend('/experience')}>/experience</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 whitespace-nowrap" onClick={() => handleSend('/skills')}>/skills</Badge>
                  <Badge variant="default" className="cursor-pointer whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleSend('/contact')}>/contact</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>
    </div>
  );
}
