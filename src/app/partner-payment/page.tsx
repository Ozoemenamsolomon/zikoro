import PartnerPayment from "@/components/partners/PartnerPayment";

type SearchParams = {
    [key: string]: string | string[] | undefined; // Adjust based on your expected parameters
};
export default function Page({searchParams}:{searchParams:any}) {
    return <PartnerPayment searchParams={searchParams}/>
}