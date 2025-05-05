"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import hooks
import { Event } from "../types/event"; // Adjusted path
import { useLocalStorage } from "../lib/hooks/useLocalStorage"; // Adjusted path
import { EventGrid } from "../components/admin/EventGrid"; // Import the new component

// Interface for the fetched events cache
interface FetchedEventsCache {
  data: Event[];
  timestamp: number | null;
}

// Basic UUID generator (replace with a robust library like `uuid` if needed)
const generateUUID = () =>
  "xxxx-xxxx-xxx-xxxx".replace(/[x]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// Renamed component to reflect it's now the main page
export default function MainPage() {
  const router = useRouter(); // Get router instance
  const searchParams = useSearchParams(); // Get search params

  const [events, setEvents] = useLocalStorage<Event[]>("adminEvents", []);
  const [showAddForm, setShowAddForm] = useState(false);
  // Use useLocalStorage for the fetched events cache object
  const [fetchedEventsCache, setFetchedEventsCache] =
    useLocalStorage<FetchedEventsCache>("fetchedAdminEventsCache", {
      data: [],
      timestamp: null,
    });
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isClient, setIsClient] = useState(false); // State to track client mount
  // Initialize currentView based on URL parameter
  const [currentView, setCurrentView] = useState<"myEvents" | "allEvents">(
    () => {
      const viewParam = searchParams.get("view");
      return viewParam === "allEvents" ? "allEvents" : "myEvents";
    },
  ); // State for view selection

  // Function to fetch and parse events using the backend API route
  // Wrap in useCallback to prevent re-creation on every render
  const fetchEventsFromSource = useCallback(async () => {
    setIsLoading(true);
    // Don't clear previous results immediately, only on success
    // setFetchedEvents([]);
    try {
      // Call our own API endpoint
      const response = await fetch("/api/fetch-events");

      if (!response.ok) {
        // Try to get error message from response body
        const errorData = await response.json().catch(() => ({})); // Catch potential JSON parse error
        throw new Error(
          `API error! status: ${response.status}, message: ${errorData.message || "Unknown API error"}`,
        );
      }

      const data: Event[] = await response.json();
      // Update cache with data and current timestamp
      setFetchedEventsCache({ data, timestamp: Date.now() });
    } catch (error) {
      console.error("Error calling fetch API:", error);
      const displayMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Failed to fetch events: ${displayMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [setFetchedEventsCache]); // Dependency on the setter function

  // Effect to update view state when URL changes
  useEffect(() => {
    const viewParam = searchParams.get("view");
    const newView = viewParam === "allEvents" ? "allEvents" : "myEvents";
    if (newView !== currentView) {
      setCurrentView(newView);
    }
    // Only re-run if searchParams changes
  }, [searchParams, currentView]);

  // Set isClient to true only on the client side after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect to auto-fetch events based on view, cache state, and timestamp
  useEffect(() => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    const shouldFetch =
      currentView === "allEvents" &&
      !isLoading &&
      (!fetchedEventsCache.timestamp || // Fetch if no timestamp
        fetchedEventsCache.timestamp < fiveMinutesAgo || // Fetch if timestamp is too old
        fetchedEventsCache.data.length === 0); // Fetch if data is empty (e.g., first load or failed fetch)

    if (shouldFetch) {
      fetchEventsFromSource();
    }
    // Dependencies: view, cache timestamp/data length, loading state, fetch function
  }, [currentView, fetchedEventsCache, isLoading, fetchEventsFromSource]);

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

  // Function to add a fetched event to "My Events" (local storage)
  const handleAddFetchedEvent = (eventToAdd: Event) => {
    // Check if event with the same URL already exists in "My Events"
    const exists = events.some((e) => e.url === eventToAdd.url);
    if (exists) {
      alert(`Event "${eventToAdd.title}" is already in My Events.`);
      return;
    }

    const newEvent: Event = {
      ...eventToAdd, // Copy title and url
      id: generateUUID(), // Assign a new unique ID
      active: true, // Default to active
    };
    setEvents([...events, newEvent]);
    alert(`Added "${eventToAdd.title}" to My Events.`); // Optional confirmation
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        WMRT Results Video Generator
      </h1>

      {/* View Navigation */}
      <div className="mb-8 flex space-x-4 border-b border-gray-700 pb-2">
        <button
          className={`py-2 px-4 text-lg font-medium ${
            currentView === "myEvents"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => router.push("/?view=myEvents")}
        >
          My Events
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${
            currentView === "allEvents"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => router.push("/?view=allEvents")}
        >
          All Events
        </button>
      </div>

      {/* Conditional Content Based on View */}
      {currentView === "myEvents" && (
        <>
          <h1 className="text-3xl font-bold mb-6">My Events</h1>
          {/* Event Grid for My Events */}
          <EventGrid
            events={events}
            isClient={isClient}
            showAddForm={showAddForm}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteEvent}
            onSaveNewEvent={handleSaveNewEvent}
            onCancelAddEvent={handleCancelAddEvent}
            onAddEventClick={handleAddEventClick}
          />
        </>
      )}

      {currentView === "allEvents" && (
        <>
          <h1 className="text-3xl font-bold mb-6">All Events</h1>
          {/* Add Refresh Button - positioned near the title */}
          <div className="mb-4">
            <button
              onClick={() => fetchEventsFromSource()} // Fetch bypassing time check
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Refresh Events
            </button>
          </div>

          {/* Conditional Rendering Logic for All Events - Hydration Safe */}
          {!isClient || isLoading ? (
            // Show loading state initially on server and client, and when actually loading
            <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-500">
              <p>{isLoading ? "Fetching events..." : "Loading events..."}</p>
            </div>
          ) : fetchedEventsCache.data.length === 0 ? (
            // Show empty state only on client after loading & if cache is empty
            <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-500">
              <p>No events found in cache.</p>
            </div>
          ) : (
            // Show grid only on client after loading & if cache has data
            <EventGrid
              events={fetchedEventsCache.data} // Pass data from cache
              isClient={isClient} // isClient will be true here
              onAdd={handleAddFetchedEvent}
              myEventsList={events}
            />
          )}
        </>
      )}
    </div>
  );
}
