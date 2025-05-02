"use client";

import { useState, useEffect } from "react";
import { Event } from "../types/event"; // Adjusted path
import { useLocalStorage } from "../lib/hooks/useLocalStorage"; // Adjusted path
import { EventCard } from "../components/admin/EventCard"; // Adjusted path
import { AddEventCard } from "../components/admin/AddEventCard"; // Re-enabled import
import { EventFormCard } from "../components/admin/EventFormCard"; // Import new form card

// Basic UUID generator (replace with a robust library like `uuid` if needed)
const generateUUID = () =>
  "xxxx-xxxx-xxx-xxxx".replace(/[x]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// Renamed component to reflect it's now the main page
export default function AdminDashboardPage() {
  const [events, setEvents] = useLocalStorage<Event[]>("adminEvents", []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isClient, setIsClient] = useState(false); // State to track client mount

  // Set isClient to true only on the client side after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddEventClick = () => {
    setShowAddForm(true);
  };

  const handleCancelAddEvent = () => {
    setShowAddForm(false);
  };

  // Modified to accept title/url and perform validation here
  const handleSaveNewEvent = (title: string, urlValue: string) => {
    const trimmedTitle = title.trim();
    let trimmedUrl = urlValue.trim();

    if (!trimmedTitle) {
      alert("Please enter a title.");
      return;
    }

    if (!trimmedUrl) {
      alert("Please enter a URL.");
      return;
    }

    if (
      !trimmedUrl.startsWith("http://") &&
      !trimmedUrl.startsWith("https://")
    ) {
      trimmedUrl = "https://" + trimmedUrl; // Assume https if no protocol
    }
    try {
      new URL(trimmedUrl); // Check if URL is valid
    } catch /* _ */ {
      alert("Please enter a valid URL.");
      return;
    }

    const newEvent: Event = {
      id: generateUUID(),
      title: trimmedTitle,
      url: trimmedUrl,
      active: true, // Default to active
    };
    setEvents([...events, newEvent]);
    setShowAddForm(false); // Hide form after saving
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setEvents(
      events.map((event: Event) =>
        event.id === id ? { ...event, active } : event,
      ),
    );
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <div className="container mx-auto p-4 md:p-8 text-gray-100 min-h-screen">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        WMRT Results Video Generator
      </h1>
      <h1 className="text-3xl font-bold mb-6 mt-12">Events</h1>

      {/* Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[100px]">
        {/* Render existing event cards (only on client) */}
        {isClient &&
          events.map((event: Event) => (
            <EventCard
              key={event.id}
              event={event}
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteEvent}
            />
          ))}

        {/* Render AddEventCard or EventFormCard (only on client) */}
        {isClient &&
          (showAddForm ? (
            <EventFormCard
              onSave={handleSaveNewEvent}
              onCancel={handleCancelAddEvent}
            />
          ) : (
            <AddEventCard onClick={handleAddEventClick} />
          ))}

        {/* Placeholder for initial server render / before hydration */}
        {!isClient && (
          <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center aspect-[4/3] sm:aspect-square h-full">
            {/* Skeleton or loading state can go here */}
          </div>
        )}
      </div>
    </div>
  );
}
