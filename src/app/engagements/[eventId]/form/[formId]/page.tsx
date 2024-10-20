import AttendeeFillForm from "@/components/engagements/interactions/_components/interactionForm/fill/AttendeeFillForm";

export default function Page({params: {eventId, formId}}:{params:{eventId:string, formId:string}}) {
return <AttendeeFillForm eventId={eventId} formId={formId}/>
}