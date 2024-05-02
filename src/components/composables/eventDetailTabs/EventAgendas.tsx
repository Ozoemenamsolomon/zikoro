import Agenda from "@/components/agenda/Agenda";

export function EventAgendas({eventId}:{eventId:string;}) {
    return (
        <div className="w-full">
            <Agenda eventId={eventId} isReception/>

        </div>
    )
}