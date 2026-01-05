import { useState, useRef, useEffect } from 'react';
import { AIChatbotService } from '@/core/services/ai-chatbot.service';
import { useAuthStore } from '@/core/store/auth.store';
import { Input } from '@/shared/components/ui/input';
import { Loader2, Send, Bot, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetMemberQuery } from '@/modules/client/profile/query/useMemberQuery';
import { Image } from '@/shared/components/ui/image';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProactiveMessage, setShowProactiveMessage] = useState(true);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const { data: member } = useGetMemberQuery(user?.id || '');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (showProactiveMessage) {
      const timer = setTimeout(() => {
        setShowProactiveMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showProactiveMessage]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setShowProactiveMessage(false);
    if (!isOpen) {
      inputRef.current?.focus();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await AIChatbotService.sendMessage(userMessage, conversationId);
      
      if (response.conversation_id && !conversationId) {
        setConversationId(response.conversation_id);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Mensaje Proactivo */}
      <AnimatePresence>
        {showProactiveMessage && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-[90px] right-5 z-[9998] bg-background text-foreground p-3 rounded-2xl shadow-lg border max-w-[230px] w-[calc(100%-40px)] flex items-center justify-between gap-3 cursor-pointer"
            onClick={handleToggle}
            style={{
              boxShadow: '0px 2px 11px 0px rgba(0, 0, 0, 0.1)',
            }}
          >
            <span className="text-sm">Hola 👋, Si tienes alguna pregunta, aquí estoy.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Flotante */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
            className="fixed bottom-5 right-5 z-[9999] w-[60px] h-[60px] rounded-full bg-primary text-primary-foreground flex items-center justify-center border-none cursor-pointer shadow-lg hover:shadow-xl transition-shadow md:bottom-5 md:right-5"
        style={{
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.15)',
        }}
        aria-label={isOpen ? 'Cerrar chatbot' : 'Abrir chatbot'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6" />
        )}
      </motion.button>

      {/* Widget del Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-[90px] right-5 z-[9999] w-[320px] max-w-[calc(100vw-40px)] h-[500px] bg-background border rounded-lg shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold text-sm">FitDesk IA</span>
              </div>
              <button
                onClick={handleToggle}
                className="bg-transparent border-none text-primary-foreground cursor-pointer p-0 m-0 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 bg-background space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-6">
                  <p className="text-sm">Hola como puedo ayudarte?</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-background">
                      {member?.profileImageUrl ? (
                        <Image
                          src={member.profileImageUrl}
                          alt={member.firstName || 'Usuario'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <span className="animate-pulse">Escribiendo</span>
                      <span className="flex gap-1">
                        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                      </span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t bg-background p-3">
              <div className="flex items-center gap-2 w-full max-w-[90%] border border-border rounded-full px-2 py-1 bg-background">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Mensaje..."
                  disabled={isLoading}
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm"
                  maxLength={500}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="h-8 w-8 rounded-full text-primary hover:bg-primary/10 flex-shrink-0 flex items-center justify-center border-0 bg-transparent cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

