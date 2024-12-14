'use client';
import { X } from 'lucide-react';
import { Message } from '@/types/story';

type StoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  messages: Message[];
};

export default function StoryModal({
  isOpen,
  onClose,
  title,
  messages,
}: StoryModalProps) {
  if (!isOpen) return null;

  const botMessages = messages.filter((message) => message.isBot);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)] space-y-4">
          {botMessages.map((message, index) => (
            <div
              key={message.id}
              className="prose dark:prose-invert max-w-none"
            >
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
