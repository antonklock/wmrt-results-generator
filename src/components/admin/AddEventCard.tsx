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
      // Changed: Solid bg, removed dashed border, added rounded-2xl, shadow-lg, adjusted hover/focus, text colors
      className="bg-gray-800 hover:bg-gray-700/80 border border-gray-700/50 hover:border-gray-600 rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 cursor-pointer h-full text-gray-500 hover:text-gray-300 transition duration-150 ease-in-out min-h-[250px]"
      aria-label="Add new event"
    >
      {/* <Plus className="h-12 w-12" /> */}
      <span className="text-6xl font-thin">+</span>
      <span className="mt-2 block text-sm font-medium">Add New Event</span>
    </button>
  );
}
