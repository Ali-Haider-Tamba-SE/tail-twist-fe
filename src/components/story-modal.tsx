'use client';
import { X, BookOpen, ArrowRightCircle } from 'lucide-react';
import { Message } from '@/types/story';
import { useRouter } from 'next/navigation';

type StoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  messages: Message[];
  status: string;
  storyId: number;
};

export default function StoryModal({
  isOpen,
  onClose,
  title,
  messages,
  status,
  storyId,
}: StoryModalProps) {
  const router = useRouter();
  if (!isOpen) return null;

  const botMessages = messages.filter((message) => message.is_bot);

  const handleContinue = () => {
    const lastMessage = messages[messages.length - 1];
    onClose();
    router.push(
      `/dashboard/new-tale?storyId=${storyId}&lastMessageId=${lastMessage.id}`
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
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
              key={message.id + index}
              className="prose dark:prose-invert max-w-none space-y-4"
            >
              {message.image_url && (
                <img
                  src={message.image_url}
                  alt="Story illustration"
                  className="w-full rounded-lg shadow-lg max-w-md mx-auto"
                  onError={(e) => {
                    console.error('Image failed to load:', message.image_url);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          ))}
        </div>
        {status === 'in_progress' && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Story
              <ArrowRightCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
