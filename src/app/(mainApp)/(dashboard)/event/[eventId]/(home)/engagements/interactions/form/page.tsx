import AttendeeFillForm from "@/components/engagements/interactions/_components/interactionForm/fill/AttendeeFillForm";

export default function Page({params: {eventId}}:{params: {eventId:string}}) {
    return <AttendeeFillForm eventId={eventId}/>
}