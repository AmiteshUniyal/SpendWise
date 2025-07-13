import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import axiosInstance from '../../api/axiosConfig';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const greetUser = () => {
      const greeting: Message = {
        content: "Hi there👋!!!! I'm your AI assistant. How can I help with your finances today☺️?",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages([greeting]);
    };
    greetUser();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/chat/assistant',
        { message: input.trim() },
        { withCredentials: true }
      );

      const botReply = response.data.reply || 'Sorry, no response.';

      const assistantMessage: Message = {
        content: botReply,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } 
    catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen min-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-indigo-600 px-6 py-4 text-white shadow-sm dark:bg-indigo-700">
        <h1 className="text-2xl font-semibold">AI Financial Assistant</h1>
        <p className="text-sm opacity-90">Ask anything about your expenses, savings, or goals</p>
      </div>

      {/* Chat Box */}
      <div className="flex-1 mt-4 flex flex-col rounded-2xl border bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2 text-sm shadow-sm
                  ${message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}
              >
                <p>{message.content}</p>
                <p className="mt-1 text-xs opacity-60">{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-xl bg-gray-100 px-4 py-2 dark:bg-gray-800">
                <div className="flex space-x-2 h-4 items-center">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-300" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-300" style={{ animationDelay: '0.2s' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-300" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Field */}
        <form onSubmit={handleSubmit} className="border-t p-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your financial question..."
              className="flex-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <FiSend className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistantPage;
