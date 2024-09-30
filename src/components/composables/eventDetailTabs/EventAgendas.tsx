import Agenda from "@/components/agenda/Agenda";

export function EventAgendas({eventId}:{eventId:string;}) {
    return (
        <div className="w-full p-3  bg-white">
            <div className="w-full rounded-lg border p-2">
                    <h3 className="pb-2 w-full text-center border-b">
                      Event Agendas
                    </h3>
            <Agenda eventId={eventId} isReception/>
</div>
        </div>
    )
}