'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Sparkles, BookOpen } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { useRouter, useSearchParams } from 'next/navigation';

type Message = {
  id: number;
  content: string;
  is_bot: boolean;
  choices?: string[];
  image_url?: string;
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
  const searchParams = useSearchParams();
  const continueStoryId = searchParams.get('storyId');
  const [generatingImages, setGeneratingImages] = useState<number[]>([]);

  const startNewStory = useCallback(async () => {
    if (!user || storyId || initRef.current) return;
    initRef.current = true;
    setIsLoading(true);
    try {
      if (continueStoryId) {
        const response = await fetch(
          `/api/stories/${continueStoryId}/messages`
        );
        const data = await response.json();

        if (response.ok) {
          setStoryId(parseInt(continueStoryId));
          const formattedMessages = data.messages.map((msg: Message) => ({
            id: msg.id,
            content: msg.content,
            is_bot: msg.is_bot,
            choices: msg.choices,
            image_url: msg.image_url,
          }));
          setMessages(formattedMessages);
          setMessageCount(
            formattedMessages.filter((m: Message) => !m.is_bot).length
          );

          // Generate missing images for bot messages
          formattedMessages.forEach((msg: Message) => {
            if (msg.is_bot && !msg.image_url) {
              generateImage(msg.id, msg.content);
            }
          });
        }
      } else {
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
        console.log('New story generated, received data:', data);
        if (!response.ok) throw new Error(data.error);

        setStoryId(data.story.id);
        setMessages([data.message]);

        if (data.message.is_bot) {
          generateImage(data.message.id, data.message.content);
        }
      }
    } catch (error) {
      console.error('Failed to start/continue story:', error);
      initRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [user, storyId, continueStoryId]);

  useEffect(() => {
    startNewStory();
  }, [startNewStory]);

  useEffect(() => {
    console.log('Current messages:', messages);
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      console.log('Current messages state:', messages);
      console.log('Last message:', messages[messages.length - 1]);
    }
  }, [messages]);

  const checkForImage = async (messageId: number) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`);
      const data = await response.json();

      if (data.image_url) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, image_url: data.image_url } : msg
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to check for image:', error);
      return false;
    }
  };

  const generateImage = async (messageId: number, content: string) => {
    try {
      setGeneratingImages((prev) => [...prev, messageId]);

      // Start image generation
      await fetch('/api/story/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, content }),
      });

      // Poll for image every 2 seconds
      const pollInterval = setInterval(async () => {
        const hasImage = await checkForImage(messageId);
        if (hasImage) {
          clearInterval(pollInterval);
          setGeneratingImages((prev) => prev.filter((id) => id !== messageId));
        }
      }, 2000);

      // Stop polling after 30 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        setGeneratingImages((prev) => prev.filter((id) => id !== messageId));
      }, 30000);
    } catch (error) {
      console.error('Failed to generate image:', error);
      setGeneratingImages((prev) => prev.filter((id) => id !== messageId));
    }
  };

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

      const newMessages = [
        ...messages,
        { id: messages.length + 1, content: userMessage, is_bot: false },
        data.message,
      ];
      setMessages(newMessages);

      if (data.message.is_bot) {
        generateImage(data.message.id, data.message.content);
      }

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
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <BookOpen className="w-6 h-6" />
        Interactive Tale
      </h1>

      {/* Chat/Story Area */}
      <div className="space-y-6 mb-6 h-[calc(100vh-300px)] overflow-y-auto p-4">
        {messages.map((message) => {
          console.log('Rendering message:', message);
          return (
            <div
              key={message.id}
              className={`flex ${
                message.is_bot ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.is_bot
                    ? 'bg-indigo-50 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {message.is_bot && (
                  <div className="mb-4">
                    {message.image_url ? (
                      <img
                        src={message.image_url}
                        alt="Story illustration"
                        className="w-full rounded-lg shadow-lg"
                        onError={(e) => {
                          console.error(
                            'Image failed to load:',
                            message.image_url
                          );
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : generatingImages.includes(message.id) ? (
                      <div className="w-full h-48 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Generating image...
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>

                {message.is_bot &&
                  message.choices &&
                  Array.isArray(message.choices) &&
                  message.choices.length > 0 && (
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
          );
        })}
        {isLoading && (
          <div className="flex justify-center items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            <div className="text-gray-500 dark:text-gray-400">
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
