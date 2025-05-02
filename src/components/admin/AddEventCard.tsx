"use client";

// import { Plus } from "lucide-react"; // Or your preferred icon library

interface AddEventCardProps {
  onClick: () => void;
}

export function AddEventCard({ onClick }: AddEventCardProps) {
  // Changed export to named export
  return (
    <button
      onClick={onClick}
      // Adjusted styles for dark theme and consistency with EventCard
      // Removed aspect ratio classes: aspect-[4/3] sm:aspect-square
      // Added minimum height
      className="bg-gray-800/50 border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-lg p-4 flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 cursor-pointer h-full text-gray-500 hover:text-gray-400 transition duration-150 ease-in-out min-h-[250px]"
      aria-label="Add new event"
    >
      {/* <Plus className="h-12 w-12" /> */}
      <span className="text-6xl font-thin">+</span>
      <span className="mt-2 block text-sm font-medium">Add New Event</span>
    </button>
  );
}
