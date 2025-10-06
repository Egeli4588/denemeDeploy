
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Role } from './types';
import { sendMessageStream } from './services/geminiService';
import Message from './components/Message';
import ChatInput from './components/ChatInput';
import { BotIcon } from './components/Icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;

    const newUserMessage: ChatMessage = { role: Role.USER, content: input };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);
    setError(null);
    
    // Add a placeholder for the model's response
    const placeholderMessage: ChatMessage = { role: Role.MODEL, content: '' };
    setMessages((prevMessages) => [...prevMessages, placeholderMessage]);

    try {
      const stream = await sendMessageStream(input);
      let fullResponse = '';
      for await (const chunkText of stream) {
        fullResponse += chunkText;
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = { role: Role.MODEL, content: fullResponse };
          return newMessages;
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Bir hata oluştu.';
      setError(`Hata: ${errorMessage}`);
      // Remove placeholder and add error message
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 shadow-md p-4 flex items-center space-x-4">
        <BotIcon className="w-8 h-8 text-cyan-400" />
        <div>
          <h1 className="text-xl font-bold text-gray-100">Bilişim Teknolojileri Asistanı</h1>
          <p className="text-sm text-gray-400">Gemini Destekli Öğretmeniniz</p>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {error && (
            <div className="flex justify-start">
                <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg max-w-2xl">
                    <p>{error}</p>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-gray-800/50 border-t border-gray-700 p-4 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;
