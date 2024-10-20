import { TFormattedEngagementFormAnswer } from "@/types/engagements";
import { FaStar, FaRegStar } from "react-icons/fa";

function Rating({ average, rating }: { average: number; rating: number }) {
  return (
    <div className="flex items-center  gap-x-1">
      {Array.from({ length: rating })
        .map((_, index) => index + 1)
        .map((value) => {
          return (
            <button key={value} className="text-basePrimary">
              {value <= average ? (
                <FaStar size={24} />
              ) : (
                <FaRegStar size={24} />
              )}
            </button>
          );
        })}
    </div>
  );
}

export function RatingTypeResponse({
  responses,
}: {
  responses: TFormattedEngagementFormAnswer[];
}) {
  const mappedRating = responses?.map((item) => Number(item?.response));
  const ratingCount = responses?.length;
  const reduced = mappedRating?.reduce((a, b) => a + b, 0);

  const ratingAverage = reduced / ratingCount;
  return (
    <div className="w-[95%] max-w-2xl mx-auto rounded-lg border gap-y-4 flex flex-col items-center justify-center px-4 py-10">
      <p>Average Rating</p>
      <div className="flex items-end">
        <h2 className="font-bold text-4xl">{ratingAverage?.toFixed(1)}</h2>
        <span className="font-semibold">/{responses[0]?.optionFields}</span>
      </div>
      <Rating
        average={Math.round(ratingAverage)}
        rating={responses[0]?.optionFields as number}
      />
      <div className="w-full max-w-2xl mx-auto">
        {[...Array(responses[0]?.optionFields as number).keys()]
          .reverse()
          .map((val, index) => {
            const reviewRate = responses?.filter(
              ({ response }) => Number(response) === val
            )?.length;
            const numberOfResponses = responses?.filter((v) => v?.response === val)?.length;
            return (
              <div
                key={index}
                className="w-full justify-center mx-auto gap-2 items-center mb-2 grid grid-cols-10"
              >
                <p className="col-span-1">Level {val}</p>
                <div className="col-span-7 relative w-full rounded-3xl h-3 bg-gray-200">
                  <span
                    style={{
                      width: reviewRate
                        ? `${((reviewRate / responses?.length) * 100).toFixed(
                            0
                          )}%`
                        : "0%",
                    }}
                    className="absolute rounded-3xl inset-0 bg-[#001fcc] h-full"
                  ></span>
                </div>
                <p className="col-span-2"> {numberOfResponses} Responses</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
