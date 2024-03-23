import UpdateEvent from "@/components/contents/event/UpdateEvent";

export default function Page({params: {eventId}}:{params: {eventId:string}}) {
    return <UpdateEvent eventId={eventId}/>
}