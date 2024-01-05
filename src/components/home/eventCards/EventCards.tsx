"use client"

import { EventCard } from ".."

export function EventCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center w-full h-full xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((_) => (
          <EventCard />
        ))}
      </div>
    )
}