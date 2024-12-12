'use client';
import React from 'react';

export default function Dashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Welcome Back!
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-indigo-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-2">
            Your Stories
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            2 published this week
          </p>
        </div>
        <div className="p-6 bg-indigo-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-2">
            Total Views
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            1.2k
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            +10% from last week
          </p>
        </div>
        <div className="p-6 bg-indigo-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-2">
            Engagement
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            85%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Based on likes & comments
          </p>
        </div>
      </div>
    </div>
  );
}
