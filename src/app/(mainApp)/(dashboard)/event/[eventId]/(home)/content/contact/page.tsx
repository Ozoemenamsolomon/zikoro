import Contact from "@/components/contents/contact/Contact";

export default function Page({params: {eventId}}:{params: {eventId:string}}) {
    return <Contact eventId={eventId}/>
}