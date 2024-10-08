"use client"

import Agenda from "@/components/agenda/Agenda";
import { useSearchParams } from "next/navigation";

export function EventAgendas({eventId}:{eventId:string;}) {
    const params = useSearchParams()
    const a = params.get("a")
    const date = params.get("date")
    return (
        <div className="w-full p-3  bg-white">
            <div className="w-full rounded-lg border p-2">
                    <h3 className="pb-2 invisible w-full text-center">
                      Event Agendas
                    </h3>
            <Agenda searchParams={{a:a, date:date}} eventId={eventId} isReception/>
</div>
        </div>
    )
}