'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import {
  Home,
  FolderKanban,
  CheckSquare,
  MessageSquare,
  Settings,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

// You can customize these navigation items
const navigationItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Overlay for mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 overflow-hidden
          ${isSidebarOpen ? 'w-64' : 'w-16'} 
          ${
            isMobile
              ? isSidebarOpen
                ? 'translate-x-0'
                : '-translate-x-full'
              : 'translate-x-0'
          }
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Link
              href="/dashboard"
              className={`flex items-center ${
                !isSidebarOpen ? 'justify-center' : ''
              }`}
            >
              <div className="flex items-center justify-center w-6">
                <Image
                  src="/story.webp"
                  alt="TwistTale Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              {isSidebarOpen && (
                <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white truncate">
                  TwistTale
                </span>
              )}
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center min-h-[48px] text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group relative w-full overflow-visible ${
                    isSidebarOpen ? 'px-3' : 'justify-center'
                  }`}
                >
                  <div className="flex items-center justify-center w-6">
                    <Icon className="w-6 h-6 relative z-10" strokeWidth={1.5} />
                  </div>
                  {isSidebarOpen ? (
                    <span className="ml-3 truncate">{item.name}</span>
                  ) : (
                    !isMobile && (
                      <div className="fixed z-50 left-[4.5rem] top-auto bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                        {item.name}
                      </div>
                    )
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div
            className={`p-4 border-t border-gray-200 dark:border-gray-700 ${
              !isSidebarOpen ? 'flex justify-center' : ''
            }`}
          >
            <div
              className={`flex items-center group relative min-h-[40px] w-full ${
                isSidebarOpen ? 'space-x-3' : 'justify-center'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 relative z-10" />
              {isSidebarOpen ? (
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    John Doe
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    john@example.com
                  </p>
                </div>
              ) : (
                !isMobile && (
                  <div className="fixed z-50 left-[4.5rem] top-auto bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                    John Doe
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        }`}
      >
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isSidebarOpen ? (
                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              )}
            </button>

            {/* Header Right Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <Sun className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                )}
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Settings className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              Welcome to your dashboard! Add your components here.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
