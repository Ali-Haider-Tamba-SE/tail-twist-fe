'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/user-context';
import { Story, Message } from '@/types/story';
import StoryModal from '@/components/story-modal';
import { formatDistanceToNow } from 'date-fns';
import { BookOpen, Clock, BookCheck } from 'lucide-react';

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<{
    id: number;
    title: string;
    messages: Message[];
    status: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    fetchStories();
  }, [user]);

  const fetchStories = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/stories?userId=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setStories(data.stories);
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoryClick = async (storyId: number, title: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}/messages`);
      const data = await response.json();
      if (response.ok) {
        setSelectedStory({
          id: storyId,
          title,
          messages: data.messages,
          status: data.status,
        });
      }
    } catch (error) {
      console.error('Failed to fetch story messages:', error);
    }
  };

  if (isLoading) {
    return <div>Loading stories...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
        <BookOpen className="w-7 h-7" />
        Your Stories
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => handleStoryClick(story.id, story.title)}
            className="group relative bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Story Preview Image */}
            <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
              {story.status === 'completed' && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10 flex items-center gap-1">
                  <BookCheck className="w-4 h-4" />
                  Completed
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-semibold mb-1 group-hover:translate-y-[-4px] transition-transform duration-300">
                  {story.title}
                </h3>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDistanceToNow(new Date(story.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            {/* Story Info */}
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    story.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {story.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
                <button className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 text-sm font-medium">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedStory && (
        <StoryModal
          isOpen={!!selectedStory}
          onClose={() => setSelectedStory(null)}
          title={selectedStory.title}
          messages={selectedStory.messages}
          status={selectedStory.status}
          storyId={selectedStory.id}
        />
      )}
    </div>
  );
}
