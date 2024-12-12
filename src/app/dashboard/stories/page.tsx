'use client';
import React from 'react';

export default function Stories() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Stories
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Example story cards */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Story Title {i}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              A brief preview of the story goes here...
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Last edited 2d ago</span>
              <span>2 min read</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
