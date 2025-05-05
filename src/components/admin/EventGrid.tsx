import React from "react";
import { Event } from "../../types/event";
import { EventCard } from "./EventCard";
import { AddEventCard } from "./AddEventCard";
import { EventFormCard } from "./EventFormCard";

interface EventGridProps {
  events: Event[];
  isClient: boolean;
  showAddForm?: boolean;
  onToggleActive?: (id: string, active: boolean) => void;
  onDelete?: (id: string) => void;
  onSaveNewEvent?: (title: string, url: string) => void;
  onCancelAddEvent?: () => void;
  onAddEventClick?: () => void;
  onAdd?: (event: Event) => void;
  myEventsList?: Event[];
}

// Helper function to extract year from URL
const getYearFromUrl = (url: string): number | null => {
  try {
    const pathSegments = new URL(url).pathname.split("/");
    // Assuming URL structure like https://domain.com/YEAR/event-slug/
    if (pathSegments.length > 1 && /^[0-9]{4}$/.test(pathSegments[1])) {
      return parseInt(pathSegments[1], 10);
    }
  } catch (error) {
    console.error(`Error parsing year from URL: ${url}`, error);
  }
  return null; // Return null if year cannot be parsed
};

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  isClient,
  showAddForm,
  onToggleActive,
  onDelete,
  onSaveNewEvent,
  onCancelAddEvent,
  onAddEventClick,
  onAdd,
  myEventsList,
}) => {
  const myEventUrls = new Set(myEventsList?.map((e) => e.url));

  // Group events by year
  const eventsByYear = React.useMemo(() => {
    return events.reduce(
      (acc, event) => {
        const year = getYearFromUrl(event.url) || "Unknown"; // Group events with unparseable years
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(event);
        return acc;
      },
      {} as Record<string | number, Event[]>,
    );
  }, [events]);

  // Get sorted years (descending)
  const sortedYears = React.useMemo(() => {
    return Object.keys(eventsByYear)
      .map(Number) // Convert keys to numbers for proper sorting
      .sort((a, b) => b - a); // Sort descending
  }, [eventsByYear]);

  // Determine if Add/Form cards should be shown (only in My Events view)
  const showAdminCards =
    isClient && onAddEventClick && onSaveNewEvent && onCancelAddEvent;

  return (
    <div>
      {" "}
      {/* Wrap everything in a container div */}
      {/* Render AddEventCard or EventFormCard at the top for My Events view */}
      {showAdminCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {showAddForm ? (
            <EventFormCard
              onSave={onSaveNewEvent!}
              onCancel={onCancelAddEvent!}
            />
          ) : (
            <AddEventCard onClick={onAddEventClick!} />
          )}
        </div>
      )}
      {/* Render events grouped by year */}
      {isClient &&
        sortedYears.map((year, index) => {
          const yearEvents = eventsByYear[year];
          if (!yearEvents || yearEvents.length === 0) return null;

          return (
            <React.Fragment key={year}>
              {/* Add separator above year group, except for the first one */}
              {index > 0 && <hr className="my-8 border-gray-600" />}
              {/* Year Title */}
              <h2 className="text-2xl font-semibold text-gray-300 mb-4">
                {String(year) === "NaN" || String(year) === "Unknown"
                  ? "Events with Unknown Year"
                  : year}
              </h2>
              {/* Grid for this year's events */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {yearEvents.map((event) => {
                  const isInMyEvents = myEventUrls.has(event.url);
                  return (
                    <EventCard
                      key={event.id || event.url}
                      event={event}
                      onToggleActive={onToggleActive}
                      onDelete={onDelete}
                      onAdd={onAdd}
                      isInMyEvents={isInMyEvents}
                    />
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}
      {/* Placeholder for initial server render / before hydration */}
      {!isClient &&
        !showAdminCards && ( // Avoid showing loading if admin cards are shown
          <div className="bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center min-h-[100px]">
            <span className="text-gray-500">Loading...</span>
          </div>
        )}
    </div>
  );
};
