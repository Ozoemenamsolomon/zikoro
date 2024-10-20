import FormSettings from "@/components/engagements/interactions/_components/interactionForm/settings/FormSettings";

export default function Page({params : {eventId}}: {params: {eventId: string}}) {
    return <FormSettings
    eventId={eventId}
    />
}