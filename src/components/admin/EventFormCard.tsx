"use client";

import { useState } from "react";

interface EventFormCardProps {
  initialTitle?: string;
  initialUrl?: string;
  onSave: (title: string, url: string) => void;
  onCancel: () => void;
}

export function EventFormCard({
  initialTitle = "",
  initialUrl = "",
  onSave,
  onCancel,
}: EventFormCardProps) {
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);

  const handleSaveClick = () => {
    // Basic validation could be added here before calling onSave if desired
    onSave(title, url);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md flex flex-col justify-between h-full min-h-[250px]">
      {/* Form Content */}
      <div className="flex-grow">
        <h2 className="text-lg font-semibold text-gray-100 mb-3">
          Add New Event
        </h2>
        <div className="mb-3">
          <label htmlFor="eventFormTitle" className="sr-only">
            Title
          </label>
          <input
            type="text"
            id="eventFormTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded w-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            aria-label="Event Title"
          />
        </div>
        <div>
          <label htmlFor="eventFormUrl" className="sr-only">
            URL
          </label>
          <input
            type="text"
            id="eventFormUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded w-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            aria-label="Event URL"
          />
        </div>
      </div>

      {/* Form Footer */}
      <div className="border-t border-gray-700 pt-3 mt-4 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="bg-gray-600 text-gray-100 px-3 py-1.5 rounded text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 ease-in-out"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveClick}
          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 ease-in-out"
        >
          Save
        </button>
      </div>
    </div>
  );
}
