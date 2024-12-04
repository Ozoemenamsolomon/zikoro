"use client";
import { useMemo, useState } from "react";
import { Star } from "styled-icons/fluentui-system-regular";
import { StarFullOutline } from "styled-icons/typicons";
import { Form, FormField, Button, Textarea } from "@/components";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { CollapsibleWidget } from "./CollapsibleWidget";
import { BoothStaffWidget } from "@/components/partners/sponsors/_components";
import { useForm } from "react-hook-form";
import { cn } from "@/lib";
import {
  TAgenda,
  TAttendee,
  TFeedBack,
  TOrgEvent,
  TReview,
  TSessionFile,
} from "@/types";
import { useSendReview } from "@/hooks";
import { Like } from "styled-icons/foundation";
import useUserStore from "@/store/globalUserStore";
import { useGetData } from "@/hooks/services/request";
import { EngagementsSettings } from "@/types/engagements";
import { FilePdf } from "styled-icons/fa-regular";
import Image from "next/image";
import Link from "next/link";
import { DeleteCard } from "./cards/DeleteCard";

const tabs = [
  { name: "Description", id: 1 },
  { name: "Review", id: 2 },
  { name: "Engagement", id: 3 },
];

function AddedFiles({ file }: { file: TSessionFile<string> }) {
  const [isDownloadFile, setOpenDownLoadModal] = useState(false);

  function onTogglemodal() {
    setOpenDownLoadModal((p) => !p);
  }

  async function download() {
    window.open(file.file);
    onTogglemodal();
  }

  return (
    <>
      <div
        onClick={onTogglemodal}
        key={file?.id}
        className="w-full group border relative rounded-lg p-3 flex items-start justify-start gap-x-2"
      >
        <FilePdf size={25} className="text-red-500" />
        <div className="space-y-1 w-full">
          <p className="text-[13px] w-full text-ellipsis whitespace-nowrap overflow-hidden sm:text-sm text-gray-500">
            {file?.name}
          </p>
          <p className="text-[11px] w-full sm:text-xs text-gray-400">
            {file?.size}
          </p>
        </div>
      </div>
      {isDownloadFile && (
        <DeleteCard
          close={onTogglemodal}
          loading={false}
          buttonText="Download"
          deletes={download}
          className="bg-basePrimary w-fit"
        />
      )}
    </>
  );
}

export function Engagement({
  agenda,
  id,
  attendees,
  reviews,
  isIdPresent,
  isOrganizer,
  refetch,
  refetchSession,
  event,
}: {
  id: string;
  attendees: TAttendee[];
  agenda: TAgenda;
  reviews: TFeedBack[];
  isIdPresent: boolean;
  isOrganizer: boolean;
  refetch: () => Promise<any>;
  refetchSession: () => Promise<any>;
  event: TOrgEvent | null;
}) {
  const [rating, setRating] = useState(0);
  const { user, setUser } = useUserStore();
  const [active, setActive] = useState(1);

  //const { reviews } = useGetEventReviews(id);
  const [isSent, setSent] = useState(false);
  const { data: engagementsSettings } = useGetData<EngagementsSettings>(
    `engagements/${id}/settings`
  );

  // const user = getCookie("user");

  const attendeeId = useMemo(() => {
    return attendees?.find(
      ({ email, eventAlias }) => eventAlias === id && email === user?.userEmail
    )?.id;
  }, [attendees]);

  useMemo(() => {
    if (attendeeId && reviews) {
      setSent(reviews?.some((review) => review?.attendeeId === attendeeId));
    } else {
      setSent(false);
    }
  }, [attendeeId, reviews]);

  return (
    <div className=" w-full">
      <div className="w-full flex bg-gray-100 items-center  gap-x-8 border-b border-gray-300 px-4 pt-4">
        {tabs.map((v, index) => (
          <button
            key={index}
            onClick={() => setActive(v?.id)}
            className={cn(
              "text-sm sm:text-base px-2 pb-4 font-medium",
              active === v?.id && "font-semibold border-b  border-basePrimary"
            )}
          >
            {v?.name}
          </button>
        ))}
        {/* {!isSent && <Button className="w-fit h-fit px-0" onClick={() => setRating(0)}>
            <CloseOutline size={22} />
          </Button>} */}
      </div>
      {active === 1 && (
        <section className="w-full flex bg-gray-100 flex-col p-2 lg:p-4 ">
          <div className="items-start text-[13px] sm:text-sm text-gray-600  justify-start flex w-full flex-wrap">
            {agenda?.description ?? ""}
          </div>
        </section>
      )}

      {active === 2 && (
        <div className="p-2 lg:p-4 w-full  h-fit bg-gray-100 ">
          {rating > 0 || isSent ? (
            <ReviewComment
              rating={rating}
              sessionAlias={agenda?.sessionAlias}
              attendeeId={attendeeId}
              eventId={id}
              reviews={reviews}
              engagementsSettings={engagementsSettings}
              isSent={isSent}
              setSent={setSent}
            />
          ) : (
            <div className="w-full flex flex-col p-6 items-start justify-start gap-y-2">
              <h3 className="text-base sm:text-lg font-semibold">
                How would you rate this session?
              </h3>
              <div className="w-[80%] mx-auto space-y-2">
                <div className="grid text-gray-500 grid-cols-5 gap-3 w-full">
                  {[1, 2, 3, 4, 5]?.map((v, index) => (
                    <button
                      onClick={() => setRating(index + 1)}
                      key={v}
                      className={cn(index + 1 <= rating && "text-basePrimary")}
                    >
                      {index + 1 <= rating ? (
                        <StarFullOutline size={40} />
                      ) : (
                        <Star size={40} />
                      )}
                    </button>
                  ))}
                </div>
                <div className="w-full grid grid-cols-2 items-center text-gray-500">
                  <p className="text-xs flex item-start justify-start">Bad</p>
                  <p className="text-xs flex items-end justify-end">
                    Excellent
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {active === 3 && (
        <>
          {agenda?.engagementAlias ? (
            <iframe
              width="100%"
              height="550"
              style={{ border: "none", borderRadius: "4px" }}
              src={
                agenda?.engagementType === "form"
                  ? `${window.location.origin}/engagements/${agenda?.eventAlias}/form/${agenda?.engagementAlias}`
                  : `${window.location.origin}/${agenda?.engagementType}/${agenda?.eventAlias}/present/${agenda?.engagementAlias}`
              }
              className="w-full h-[550px]"
            ></iframe>
          ) : (
            <div className="my-6 font-semibold">
              You did not connect any engagement
            </div>
          )}
        </>
      )}
      {/** collapsible widgets */}
      {active === 1 && (
        <>
          <CollapsibleWidget
            title="Speakers"
            session={agenda}
            isNotAttendee={isIdPresent || isOrganizer}
            event={event}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid  grid-cols-1 items-center gap-4">
              {Array.isArray(agenda?.sessionSpeakers) &&
                agenda?.sessionSpeakers?.length === 0 && (
                  <div className="w-full col-span-full h-[200px] flex items-center justify-center">
                    <p className="font-semibold">No Speaker</p>
                  </div>
                )}
              {Array.isArray(agenda?.sessionSpeakers) &&
                agenda?.sessionSpeakers.map((attendee, index) => (
                  <BoothStaffWidget
                    company={attendee?.organization ?? ""}
                    image={attendee?.profilePicture || null}
                    name={`${attendee?.firstName} ${attendee?.lastName}`}
                    profession={attendee?.jobTitle ?? ""}
                    email={attendee?.email ?? ""}
                    key={index}
                  />
                ))}
            </div>
          </CollapsibleWidget>
          <CollapsibleWidget
            title="Moderator"
            session={agenda}
            isNotAttendee={isIdPresent || isOrganizer}
            event={event}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid  grid-cols-1 items-center gap-4">
              {Array.isArray(agenda?.sessionModerators) &&
                agenda?.sessionModerators?.length === 0 && (
                  <div className="w-full col-span-full h-[200px] flex items-center justify-center">
                    <p className="font-semibold">No Moderator</p>
                  </div>
                )}
              {Array.isArray(agenda?.sessionModerators) &&
                agenda?.sessionModerators.map((attendee, index) => (
                  <BoothStaffWidget
                    company={attendee?.organization ?? ""}
                    image={attendee?.profilePicture || null}
                    name={`${attendee?.firstName} ${attendee?.lastName}`}
                    profession={attendee?.jobTitle ?? ""}
                    email={attendee?.email ?? ""}
                    key={index}
                  />
                ))}
            </div>
          </CollapsibleWidget>
          <CollapsibleWidget
            title="Sponsors"
            session={agenda}
            event={event}
            isNotAttendee={isIdPresent || isOrganizer}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 items-center gap-4">
              {Array.isArray(agenda?.sessionSponsors) &&
                agenda?.sessionSponsors?.length === 0 && (
                  <div className="w-full col-span-full h-[200px] flex items-center justify-center">
                    <p className="font-semibold">No Sponsor</p>
                  </div>
                )}
              {Array.isArray(agenda?.sessionSponsors) &&
                agenda?.sessionSponsors.map((sponsor) => (
                  <Image
                    src={sponsor?.companyLogo ?? ""}
                    alt="sponsor"
                    width={200}
                    height={100}
                    className=" w-[100px] object-contain h-[40px]"
                  />
                ))}
            </div>
          </CollapsibleWidget>
          <CollapsibleWidget
            title="File"
            session={agenda}
            isNotAttendee={isIdPresent || isOrganizer}
            event={event}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 items-center gap-4">
              {Array.isArray(agenda?.sessionFiles) &&
                agenda?.sessionFiles?.length === 0 && (
                  <div className="w-full col-span-full h-[200px] flex items-center justify-center">
                    <p className="font-semibold">No File</p>
                  </div>
                )}
              {Array.isArray(agenda?.sessionFiles) &&
                agenda?.sessionFiles.map((item) => <AddedFiles file={item} />)}
            </div>
          </CollapsibleWidget>
        </>
      )}
    </div>
  );
}

type FormValue = {
  comments: string;
};
function ReviewComment({
  rating,
  sessionAlias,
  attendeeId,
  eventId,
  reviews,
  engagementsSettings,
  isSent,
  setSent,
}: {
  sessionAlias?: string;
  rating: number;
  attendeeId?: number;
  eventId?: string;
  reviews: TReview[];
  engagementsSettings: EngagementsSettings | null;
  isSent: boolean;
  setSent: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<FormValue>({});
  const { sendReview, isLoading } = useSendReview();

  async function onSubmit(values: FormValue) {
    //
    const myAgendapointsAllocation =
      engagementsSettings?.pointsAllocation["rate a session"];
    let payload: Partial<TReview> = {
      ...values,
      rating,
      sessionAlias,
      attendeeId,
      eventAlias: eventId,
    };
    if (myAgendapointsAllocation?.status && attendeeId) {
      const filtered = reviews?.filter(
        (review) => review?.attendeeId === attendeeId
      );
      if (filtered && filtered?.length > 0) {
        const sum = filtered?.reduce(
          (acc, review) => acc + (review?.points || 0),
          0
        );
        if (
          sum >=
          myAgendapointsAllocation?.points *
            myAgendapointsAllocation?.maxOccurrence
        ) {
          payload = payload;
          return;
        }

        payload = {
          ...payload,
          points: sum + myAgendapointsAllocation?.points,
        };
      } else {
        payload = {
          ...payload,
          points: 0 + myAgendapointsAllocation?.points,
        };
      }
    }

    await sendReview({ payload });

    setSent(true);
  }
  return (
    <div className="w-full ">
      <>
        {!isSent ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col  py-6 px-4 items-start justify-start gap-y-3"
            >
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <InputOffsetLabel label="">
                    <Textarea
                      placeholder="Please share your thoughts"
                      {...form.register("comments")}
                      className="placeholder:text-sm h-40 bg-gray-100 border-gray-300 focus:border-gray-500 placeholder:text-gray-500 text-gray-700"
                    ></Textarea>
                  </InputOffsetLabel>
                )}
              />

              <Button
                disabled={isLoading}
                className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
              >
                {isLoading && <LoaderAlt size={22} className="animate-spin" />}
                <span>Send Review</span>
              </Button>
            </form>
          </Form>
        ) : (
          <div className="w-full h-[250px] flex items-center justify-center flex-col gap-y-3">
            <Like size={40} className="text-basePrimary " />
            <p className="text-sm">Thanks for your feedback</p>
          </div>
        )}
      </>
    </div>
  );
}
