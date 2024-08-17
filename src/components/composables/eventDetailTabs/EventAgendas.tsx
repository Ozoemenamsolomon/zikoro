import Agenda from "@/components/agenda/Agenda";

export function EventAgendas({eventId}:{eventId:string;}) {
    return (
        <div className="w-full py-3  bg-white">
            <Agenda eventId={eventId} isReception/>

        </div>
    )
}