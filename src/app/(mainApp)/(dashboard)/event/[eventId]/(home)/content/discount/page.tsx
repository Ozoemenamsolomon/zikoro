import Discount from "@/components/contents/discount/Discount";

export default function Page({params: {eventId}}:{params: {eventId:string}}) {
    return <Discount eventId={eventId}/>
}