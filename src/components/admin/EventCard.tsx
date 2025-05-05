"use client";

import Link from "next/link";
import { Event } from "../../types/event"; // Adjusted path

interface EventCardProps {
  event: Event;
  onToggleActive?: (id: string, active: boolean) => void;
  onDelete?: (id: string) => void;
  onAdd?: (event: Event) => void;
  isInMyEvents?: boolean;
}

export function EventCard({
  event,
  onToggleActive,
  onDelete,
  onAdd,
  isInMyEvents,
}: EventCardProps) {
  const handleToggle = () => {
    if (onToggleActive && event.id) {
      onToggleActive(event.id, !event.active);
    }
  };

  const handleDelete = () => {
    if (
      onDelete &&
      event.id &&
      window.confirm(`Are you sure you want to delete "${event.title}"?`)
    ) {
      onDelete(event.id);
    }
  };

  // Encode the URL for safe use in a query parameter
  // Also add the view the user is coming from
  const currentViewParam = onToggleActive ? "myEvents" : "allEvents";
  const previewLink = `/generator?previewUrl=${encodeURIComponent(event.url)}&fromView=${currentViewParam}`;

  // Determine border color based on view and state
  const borderColorClass = onToggleActive
    ? event.active
      ? "border-green-700" // My Events view: Active
      : "border-gray-700/50" // My Events view: Inactive
    : isInMyEvents
      ? "border-teal-500" // All Events view: Following
      : "border-gray-700/50"; // All Events view: Not Following

  return (
    <div
      className={`relative bg-gray-800 border ${borderColorClass} rounded-2xl p-4 shadow-lg flex flex-col justify-between h-full transition-colors duration-200 min-h-[250px]`}
    >
      {/* Delete Button (Top Right) */}
      {onDelete && (
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
      )}

      {/* Card Header */}
      <div className="flex-grow mb-3 mr-6">
        {/* Removed Added Badge from here */}

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

        {/* Following Badge (Moved Below Instagram) */}
        {isInMyEvents && (
          <span className="inline-block bg-teal-600 text-teal-100 text-xs font-semibold px-2 py-0.5 rounded-full mt-2">
            Following
          </span>
        )}
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
          {/* Conditionally render Active/Inactive status only if onToggleActive exists */}
          {onToggleActive && (
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
              <span
                className={`h-3 w-3 rounded-full ${event.active ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              <span>{event.active ? "Active" : "Inactive"}</span>
            </div>
          )}
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
          {/* Toggle Active Button */}
          {onToggleActive && event.id && (
            <button
              onClick={handleToggle}
              className={`px-2 py-1 rounded text-xs transition-colors duration-150 ${event.active ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
              title={event.active ? "Deactivate" : "Activate"}
            >
              {event.active ? "Deactivate" : "Activate"}
            </button>
          )}

          {/* Delete Button */}
          {onDelete && event.id && (
            <button
              onClick={handleDelete}
              className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
            >
              Delete
            </button>
          )}

          {/* Add to My Events Button - Modify appearance based on isInMyEvents */}
          {onAdd && (
            <button
              onClick={() => !isInMyEvents && onAdd(event)}
              className={`text-xs px-3 py-1 rounded transition-colors whitespace-nowrap ${isInMyEvents ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              disabled={isInMyEvents}
              title={isInMyEvents ? "Already in My Events" : "Add to My Events"}
            >
              {isInMyEvents ? "Added ✓" : "Add to My Events"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
