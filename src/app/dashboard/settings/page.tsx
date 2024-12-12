'use client';
import React from 'react';

export default function Settings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Settings
      </h1>
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Profile Settings
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                defaultValue="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                defaultValue="john@example.com"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Notifications
          </h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="comments"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                defaultChecked
              />
              <label
                htmlFor="comments"
                className="ml-3 text-sm text-gray-700 dark:text-gray-200"
              >
                Email me when someone comments on my story
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="likes"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                defaultChecked
              />
              <label
                htmlFor="likes"
                className="ml-3 text-sm text-gray-700 dark:text-gray-200"
              >
                Email me when someone likes my story
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
