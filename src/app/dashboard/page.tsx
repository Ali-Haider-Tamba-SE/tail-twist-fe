'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// You can customize these navigation items
const navigationItems = [
  { name: 'Home', href: '/dashboard', icon: '🏠' },
  { name: 'Projects', href: '/dashboard/projects', icon: '📁' },
  { name: 'Tasks', href: '/dashboard/tasks', icon: '✓' },
  { name: 'Messages', href: '/dashboard/messages', icon: '✉️' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Image
                src="/story.webp"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-xl font-semibold">Your App</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        } transition-margin duration-300`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Header Right Section */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <span className="text-xl">🔔</span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <span className="text-xl">⚙️</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            {/* Your page content will go here */}
            <p>Welcome to your dashboard! Add your components here.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
