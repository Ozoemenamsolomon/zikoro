import CreateInteractionForm from "@/components/engagements/interactions/_components/interactionForm/create/CreateInteractionForm";

export default function Page({params : {eventId, formId}}: {params: {formId:string;  eventId: string}}) {
    return <CreateInteractionForm
    eventId={eventId}
    formId={formId}
    />
}