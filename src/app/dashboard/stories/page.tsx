'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/user-context';
import { Story, Message } from '@/types/story';
import StoryModal from '@/components/story-modal';
import { formatDistanceToNow } from 'date-fns';

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<{
    id: number;
    title: string;
    messages: Message[];
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
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Your Stories
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => handleStoryClick(story.id, story.title)}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {story.title}
            </h3>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>
                {formatDistanceToNow(new Date(story.created_at), {
                  addSuffix: true,
                })}
              </span>
              <span>{story.status}</span>
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
        />
      )}
    </div>
  );
}
