"use client"

import { Events } from ".";
import { EventsFilterProvider } from "@/context/EventFilterContext";
import {useValidateUser} from "@/hooks"
export default function PublishedEvent({ id }: { id: string }) {
 useValidateUser()
  return (
    <EventsFilterProvider>
      <Events id={id} />
    </EventsFilterProvider>
  );
}
