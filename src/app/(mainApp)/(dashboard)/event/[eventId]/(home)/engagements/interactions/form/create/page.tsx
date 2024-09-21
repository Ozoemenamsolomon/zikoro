import CreateInteractionForm from "@/components/engagements/interactions/_components/interactionForm/create/CreateInteractionForm";

export default function Page({params : {eventId}}: {params: {eventId: string}}) {
    return <CreateInteractionForm
    eventId={eventId}
    />
}