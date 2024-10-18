import { TFormattedEngagementFormAnswer } from "@/types/engagements";

export function RatingTypeResponse({responses}:{responses: TFormattedEngagementFormAnswer[]}) {
    
    const mappedRating = responses?.map((item) => Number(item?.response));
    const ratingCount = responses?.length;
    const reduced = mappedRating?.reduce((a, b) => a + b, 0);
        
       const ratingAverage = reduced / ratingCount;
    return (
        <div className="w-[95%] max-w-xl rounded-lg border flex flex-col items-center justify-center px-4 py-10">

            <p>Average Rating</p>

        </div>
    )
}