// @ts-nocheck
"use client";
import AddAttendeeForm from "@/components/forms/AddAttendeeForm";
import useDisclose from "@/hooks/common/useDisclose";
import { TAttendee } from "@/types/attendee";
import { calculateAndSetMaxHeight } from "@/utils/helpers";
import { useRef, useState, useLayoutEffect } from "react";
import FirstSection from "./FirstSection";
import SecondSection from "./SecondSection";
import ThirdSection from "./ThirdSection";

interface ReusablePeopleComponentProps {
  attendees: TAttendee[];
  getAttendees: () => Promise<void>;
  isLoading: boolean;
  error: boolean;
}

const ReusablePeopleComponent: React.FC<ReusablePeopleComponentProps> = ({
  attendees,
  getAttendees,
  isLoading,
  error,
}) => {
  const {
    isOpen: attendeeFormIsOpen,
    onOpen: onOpenAttendeeForm,
    onClose: onCloseAttendeeForm,
  } = useDisclose();

  const [selectedAttendee, setSelectedAttendee] = useState<TAttendee>(null);

  const selectAttendee = (attendee: TAttendee) => setSelectedAttendee(attendee);

  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const div = divRef.current;

    // Get the distance from the top of the div to the bottom of the screen
    const distanceToBottom = window.innerHeight - div.offsetTop;

    // Set the maximum height of the div
    div.style.height = `${distanceToBottom}px`;
  }, []);

  return (
    <section
      className="relative h-fit border-t-[1px] border-[#F3F3F3] w-full grid grid-cols-10 overflow-hidden"
      ref={divRef}
    >
      <section className="col-span-3 border-r-[1px] border-[#F3F3F3] pt-2">
        <FirstSection
          onOpen={onOpenAttendeeForm}
          onSelectAttendee={selectAttendee}
          selectedAttendee={selectedAttendee}
          attendees={attendees}
          isLoading={isLoading}
          getAttendees={getAttendees}
        />
      </section>
      {selectedAttendee ? (
        <>
          <section className="col-span-4 space-y-4 border-r-[1px] overflow-auto no-scrollbar max-h-full">
            <SecondSection
              attendee={selectedAttendee}
              getAttendees={getAttendees}
            />
          </section>
          <section className="flex flex-col col-span-3 pt-2">
            <ThirdSection attendee={selectedAttendee} />
          </section>
        </>
      ) : (
        <div className="flex flex-col h-96 w-full col-span-7 items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={50}
            height={50}
            viewBox="0 0 65 64"
            fill="none"
          >
            <g style={{ mixBlendMode: "luminosity" }}>
              <path
                d="M30.8479 50.5894L33.9895 63.8674L30.8479 50.5894Z"
                fill="#9FC5FF"
              />
              <path
                d="M17.3462 43.3887C8.62532 45.3968 2.12231 53.2085 2.12231 62.5392V63.9998H22.9356L29.6471 54.9752L28.9438 48.9955L17.3462 43.3887Z"
                fill="#E6F8FC"
              />
              <path
                d="M55.7655 62.5392C55.7655 53.2085 49.2626 45.3968 40.5416 43.3887L28.9438 48.9955L30.8478 56.9642L34.9522 63.9998H50.1626L55.7655 62.5392Z"
                fill="#D0E8FF"
              />
              <path
                d="M28.9439 48.9961H26.9978L22.9355 64.0002H28.9439L29.6472 55.2111L28.9439 48.9961Z"
                fill="#6354B1"
              />
              <path
                d="M28.9438 48.9961H30.89L34.9522 64.0002H28.9438V48.9961Z"
                fill="#54469C"
              />
              <path
                d="M21.7738 42.8882C20.2513 42.8882 18.7692 43.0614 17.3462 43.3892L20.5788 52.7139L28.9439 48.9961L29.6472 45.5707L28.9439 42.8882H21.7738Z"
                fill="#D0E8FF"
              />
              <path
                d="M36.114 42.8882H28.9438V48.9961L37.309 52.7139L40.5416 43.3892C39.1186 43.0614 37.6365 42.8882 36.114 42.8882Z"
                fill="#9DCFFF"
              />
              <path
                d="M23.3673 37.2207L21.7739 42.8882L28.9441 48.9961L29.4264 41.5967L28.9441 37.2207H23.3673Z"
                fill="#FFDDCE"
              />
              <path
                d="M34.5206 37.2207H28.9438V48.9961L36.114 42.8882L34.5206 37.2207Z"
                fill="#FFBDA9"
              />
              <path
                d="M24.6356 0C20.3417 0 16.8608 3.48088 16.8608 7.77475V16.5123H28.9438L30.5007 7.8475L28.9438 0L24.6356 0Z"
                fill="#6354B1"
              />
              <path
                d="M41.027 7.93525C41.027 5.97263 39.436 4.38175 37.4735 4.38175H35.4502V3.5535C35.4502 1.591 33.8592 0 31.8966 0H28.9438V16.5124H41.0268V7.93525H41.027Z"
                fill="#54469C"
              />
              <path
                d="M26.2884 14.7385L25.0299 13.3541C24.1402 12.3754 22.8788 11.8174 21.556 11.8174C18.9632 11.8174 16.8612 13.9194 16.8612 16.5123V20.4481H15.5334C13.3334 20.4481 11.55 22.2315 11.55 24.4315C11.55 26.6315 13.3334 28.4149 15.5334 28.4149H16.9845C17.8223 34.2704 22.8572 38.7718 28.9443 38.7718L30.5012 23.9004L28.9443 14.7385H26.2884Z"
                fill="#FFF0E6"
              />
              <path
                d="M42.3546 20.4481H41.0268V16.5123C41.0268 13.9194 38.9248 11.8174 36.332 11.8174C35.0092 11.8174 33.7478 12.3754 32.858 13.3541L31.5995 14.7385H28.9438V38.7718C35.031 38.7718 40.0658 34.2704 40.9036 28.4149H42.3547C44.5547 28.4149 46.3381 26.6315 46.3381 24.4315C46.338 22.2316 44.5546 20.4481 42.3546 20.4481Z"
                fill="#FFDDCE"
              />
              <path
                d="M26.782 26.9546H23.032C23.032 30.2145 25.6841 32.8666 28.944 32.8666L30.1784 30.8503L28.944 29.1166C27.7519 29.1166 26.782 28.1467 26.782 26.9546Z"
                fill="#FFDDCE"
              />
              <path
                d="M31.1058 26.9546C31.1058 28.1467 30.136 29.1166 28.9438 29.1166V32.8666C32.2037 32.8666 34.8558 30.2145 34.8558 26.9546H31.1058Z"
                fill="#FFBDA9"
              />
              <path
                d="M37.4478 51.2852C37.4478 58.3074 43.1404 64.0001 50.1626 64.0001L51.738 51.6282L50.1626 38.5703C43.1404 38.5703 37.4478 44.2629 37.4478 51.2852Z"
                fill="#00DDC0"
              />
              <path
                d="M50.1626 38.5703V64.0001C57.1848 64.0001 62.8775 58.3074 62.8775 51.2852C62.8775 44.2629 57.1848 38.5703 50.1626 38.5703Z"
                fill="#00B5BD"
              />
              <path
                d="M48.5765 51.736L46.3247 49.4844L43.6731 52.136L48.5765 57.0393L50.1627 55.453L50.9621 51.8498L50.1627 50.1497L48.5765 51.736Z"
                fill="#E6F8FC"
              />
              <path
                d="M54.0006 46.312L50.1626 50.15V55.4533L56.6522 48.9636L54.0006 46.312Z"
                fill="#D0E8FF"
              />
            </g>
          </svg>
          <p className="text-sm px-2 font-medium text-gray-700 text-center w-1/2">
            Select an attendee from the list to view their profile information.
          </p>
        </div>
      )}
      <AddAttendeeForm
        isOpen={attendeeFormIsOpen}
        onClose={onCloseAttendeeForm}
      />
    </section>
  );
};

export default ReusablePeopleComponent;
