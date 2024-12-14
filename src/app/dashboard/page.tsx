'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/user-context';
import { Story } from '@/types/story';
import { BookOpen, BookCheck, BookPlus } from 'lucide-react';
import Link from 'next/link';

type StoryStats = {
  total: number;
  completed: number;
  inProgress: number;
};

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<StoryStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentStories, setRecentStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/stories?userId=${user.id}`);
        const data = await response.json();
        if (response.ok) {
          const stories = data.stories;
          setStats({
            total: stories.length,
            completed: stories.filter((s: Story) => s.status === 'completed')
              .length,
            inProgress: stories.filter((s: Story) => s.status === 'in_progress')
              .length,
          });
          // Get 5 most recent stories
          setRecentStories(stories.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch story stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Stories
              </p>
              <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <BookOpen className="w-12 h-12 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed Stories
              </p>
              <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                {stats.completed}
              </p>
            </div>
            <BookCheck className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                In Progress
              </p>
              <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                {stats.inProgress}
              </p>
            </div>
            <BookPlus className="w-12 h-12 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Recent Stories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Stories
          </h2>
          <div className="space-y-4">
            {recentStories.length > 0 ? (
              recentStories.map((story) => (
                <div
                  key={story.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(story.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      story.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {story.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">
                  No stories yet.{' '}
                  <Link
                    href="/dashboard/new-tale"
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    Create your first story!
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/new-tale"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <BookPlus className="w-5 h-5" />
            Start New Story
          </Link>
          <Link
            href="/dashboard/stories"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            View All Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
