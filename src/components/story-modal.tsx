'use client';
import { X, BookOpen, ArrowRightCircle } from 'lucide-react';
import { Message } from '@/types/story';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [currentPage, setCurrentPage] = useState(0);
  const botMessages = messages.filter((message) => message.is_bot);

  if (!isOpen) return null;

  const handleContinue = () => {
    const lastMessage = messages[messages.length - 1];
    onClose();
    router.push(
      `/dashboard/new-tale?storyId=${storyId}&lastMessageId=${lastMessage.id}`
    );
  };

  const nextPage = () => {
    if (currentPage < botMessages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {title}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Page {currentPage + 1} of {botMessages.length}
            </span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        <div className="relative h-[calc(80vh-8rem)] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="p-4 h-full overflow-y-auto"
            >
              <div className="prose dark:prose-invert max-w-none space-y-4">
                {botMessages[currentPage]?.image_url && (
                  <img
                    src={botMessages[currentPage].image_url}
                    alt="Story illustration"
                    className="w-full rounded-lg shadow-lg max-w-md mx-auto"
                    onError={(e) => {
                      console.error(
                        'Image failed to load:',
                        botMessages[currentPage].image_url
                      );
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="text-sm whitespace-pre-wrap">
                  {botMessages[currentPage]?.content}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between bg-gradient-to-t from-white dark:from-gray-800">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === botMessages.length - 1}
              className="px-4 py-2 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
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
