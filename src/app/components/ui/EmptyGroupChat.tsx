import React from "react";

function EmptyGroupChats() {
  return (
    <div className="w-full h-12 px-3 flex items-center justify-center bg-gray-50 dark:bg-gray-900 my-1 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <svg
          className="w-4 h-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Coming Soon...
        </span>
      </div>
    </div>
  );
}

export default EmptyGroupChats;
