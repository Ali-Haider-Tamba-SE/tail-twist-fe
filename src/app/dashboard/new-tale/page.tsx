'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Send } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';

type Message = {
  id: number;
  content: string;
  isBot: boolean;
  choices?: string[];
};

export default function NewTale() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [storyId, setStoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const [messageCount, setMessageCount] = useState(0);
  const initRef = useRef(false);

  const startNewStory = useCallback(async () => {
    if (!user || storyId || initRef.current) return;
    initRef.current = true;
    setIsLoading(true);
    try {
      const response = await fetch('/api/story/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setStoryId(data.story.id);
      setMessages([data.message]);
    } catch (error) {
      console.error('Failed to start story:', error);
      initRef.current = false; // Reset on error
    } finally {
      setIsLoading(false);
    }
  }, [user, storyId]);

  useEffect(() => {
    startNewStory();
  }, [startNewStory]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim() || !storyId || !user) return;

    const userMessage = userInput;
    setUserInput('');
    setIsLoading(true);
    const currentCount = messageCount + 1;
    setMessageCount(currentCount);

    try {
      const response = await fetch('/api/story/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          storyId,
          userInput: userMessage,
          messageCount: currentCount,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, content: userMessage, isBot: false },
        data.message,
      ]);

      if (data.isComplete) {
        setTimeout(() => {
          router.push('/dashboard/stories');
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to continue story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoiceClick = (choice: string) => {
    setUserInput(choice);
    const form = document.querySelector('form');
    if (form) form.requestSubmit();
  };

  // Rest of your component JSX remains the same, but add loading state handling
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Interactive Tale
      </h1>

      {/* Chat/Story Area */}
      <div className="space-y-6 mb-6 h-[calc(100vh-300px)] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isBot ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.isBot
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm">{message.content}</p>

              {/* Choice Buttons */}
              {message.choices && (
                <div className="mt-4 space-y-2">
                  {message.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleChoiceClick(choice)}
                      className="block w-full text-left px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-500 dark:text-gray-400">
              Generating story...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="flex space-x-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          placeholder="Type your response or choose an option above..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
