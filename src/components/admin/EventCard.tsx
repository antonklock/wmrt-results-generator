"use client";

import Link from "next/link";
import { Event } from "../../types/event"; // Adjusted path

interface EventCardProps {
  event: Event;
  onToggleActive: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

export function EventCard({ event, onToggleActive, onDelete }: EventCardProps) {
  const handleToggle = () => {
    onToggleActive(event.id, !event.active);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      onDelete(event.id);
    }
  };

  // Encode the URL for safe use in a query parameter
  const previewLink = `/generator?previewUrl=${encodeURIComponent(event.url)}`;

  return (
    <div
      className={`relative bg-gray-800 border ${event.active ? "border-green-600" : "border-gray-700"} rounded-lg p-4 shadow-md flex flex-col justify-between h-full transition-colors duration-200 min-h-[250px]`}
    >
      {/* Delete Button (Top Right) */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 bg-gray-700/50 hover:bg-gray-600/70 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-150 z-10"
        title="Delete"
        aria-label="Delete event"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Card Header */}
      <div className="flex-grow mb-3 mr-6">
        <h2
          className="text-lg font-semibold text-gray-100 truncate mb-1"
          title={event.title}
        >
          {event.title}
        </h2>
        <p className="text-xs text-gray-400 truncate mb-2" title={event.url}>
          {event.url}
        </p>

        {/* Instagram Link Placeholder */}
        <div className="flex items-center text-sm text-gray-400 mt-2">
          <span>Instagram account: </span>
          <span className="text-gray-500 italic ml-1">unlinked</span>
          <button
            onClick={() => alert("Functionality not yet implemented")}
            className="flex items-center ml-2 px-2 py-0.5 text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 hover:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-colors duration-150"
            title="Link Instagram account (not implemented)"
            aria-label="Link Instagram account (feature not implemented)"
          >
            <span>Link</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-gray-700 pt-3 mt-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Left side: Preview Link & Status */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href={previewLink}
            className="text-blue-400 hover:text-blue-300 hover:underline text-sm whitespace-nowrap"
            // target="_blank" // Open in new tab
            rel="noopener noreferrer"
          >
            Preview
          </Link>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${event.active ? "bg-green-900 text-green-200" : "bg-gray-700 text-gray-300"}`}
          >
            {event.active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
          {/* Toggle Active Button */}
          <button
            onClick={handleToggle}
            className={`px-2 py-1 rounded text-xs transition-colors duration-150 ${event.active ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
            title={event.active ? "Deactivate" : "Activate"}
          >
            {event.active ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}
