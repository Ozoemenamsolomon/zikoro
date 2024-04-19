"use client";

import { AboutSession, Engagement } from "./_components";

export default function SingleAgenda({agendaId}:{agendaId: string}) {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-8 items-start gap-3">
      <AboutSession />
      <Engagement />
    </div>
  );
}
