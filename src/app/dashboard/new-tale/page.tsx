'use client';
import React, { useState } from 'react';
import { Send } from 'lucide-react';

type Message = {
  id: number;
  content: string;
  isBot: boolean;
  choices?: string[];
};

const initialMessages: Message[] = [
  {
    id: 1,
    content:
      'In a mysterious forest, where the trees whispered ancient secrets, a young adventurer discovered a glowing crystal embedded in an old tree trunk. The crystal pulsed with an otherworldly light...',
    isBot: true,
    choices: [
      'Reach out and touch the crystal',
      'Look around for any signs of danger first',
      'Try to dig the crystal out carefully',
    ],
  },
];

export default function NewTale() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user's message
    const newUserMessage: Message = {
      id: messages.length + 1,
      content: userInput,
      isBot: false,
    };

    // Simulate bot response
    const botResponse: Message = {
      id: messages.length + 2,
      content:
        'As you touched the crystal, it pulsed brighter, and suddenly the forest around you seemed to shift and change. The trees began to glow with the same ethereal light...',
      isBot: true,
      choices: [
        'Close your eyes and embrace the energy',
        'Step back quickly',
        'Try to communicate with the forest',
      ],
    };

    setMessages([...messages, newUserMessage, botResponse]);
    setUserInput('');
  };

  const handleChoiceClick = (choice: string) => {
    setUserInput(choice);
    handleSendMessage({
      preventDefault: () => {},
      type: 'submit',
    } as React.FormEvent<HTMLFormElement>);
  };

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
              message.isBot ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.isBot
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'bg-indigo-600 text-white'
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
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="flex space-x-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          placeholder="Type your response or choose an option above..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
