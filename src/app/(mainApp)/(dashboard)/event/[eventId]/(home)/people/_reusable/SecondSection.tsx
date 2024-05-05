// @ts-nocheck
"use client";
import { useGetnote } from "@/hooks/services/notes";
import {
  useGetAttendeeTags,
  useUpdateAttendeeTags,
} from "@/hooks/services/tags";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddAttendeeTagForm from "@/components/forms/AddAttendeeTagForm";
import AddNotesForm from "@/components/forms/AddNoteForm";
import AttendeeBadge from "@/components/AttendeeBadge";
import { usePDF } from "react-to-pdf";
import { Button } from "@/components/ui/button";
import {
  useGetAttendeeCertificates,
  useGetCertificates,
  useGetEventCertificates,
  useReleaseAttendeeCertificate,
  useUpdateAttendeeCertificates,
} from "@/hooks/services/certificate";
import SelectCertificateModal from "@/components/selectCertificateModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isPast } from "date-fns";
import AttendeeCertificate from "@/components/AttendeeCertificate";
import { TCertificate } from "@/types/certificates";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import AddAttendeeForm from "@/components/forms/AddAttendeeForm";
import useDisclose from "@/hooks/common/useDisclose";
import {
  getCookie,
  useCreateAttendee,
  useGetBadges,
  useGetEvent,
  useGetEventAgendas,
} from "@/hooks";
import { TAgenda } from "@/types";
import SlideToReveal from "@/components/SlideToReveal";

export default function SecondSection({
  attendee,
  getAttendees,
  event,
  eventAgendasIsLoading,
  eventAgendas,
}: {
  attendee: TAttendee;
  getAttendees?: () => Promise<void>;
  event: Event;
  eventAgendasIsLoading: boolean;
  eventAgendas: TAgenda;
}) {
  const router = useRouter();
  const {
    userEmail,
    firstName,
    lastName,
    email,
    jobTitle,
    organization,
    city,
    country,
    phoneNumber,
    whatsappNumber,
    bio,
    x,
    linkedin,
    instagram,
    facebook,
    certificate,
    profilePicture,
    attendeeType,
    eventId,
    checkin,
    id,
    ticketType,
    registrationDate,
    websiteUrl,
  } = attendee;

  console.log(attendee);

  const user = getCookie("user");

  const attendeeModeratingAt = eventAgendas?.filter(
    ({ sessionModerators }) =>
      !!sessionModerators &&
      !!sessionModerators?.find(({ id: moderatorId }) => id === moderatorId)
  );

  const attendeeSpeakingAt = eventAgendas?.filter(
    ({ sessionSpeakers }) =>
      !!sessionSpeakers &&
      !!sessionSpeakers?.find(({ id: speakerId }) => id === speakerId)
  );

  console.log(eventAgendas);

  const {
    note,
    isLoading: noteIsLoading,
    error,
    getnote,
  } = useGetnote({ attendeeId: id });

  const {
    attendeeTags,
    isLoading: attendeeTagsisLoading,
    // error,
    getAttendeeTags,
  } = useGetAttendeeTags({ attendeeId: id });

  const { updateAttendeeTags, isLoading: updatetagsIsLoading } =
    useUpdateAttendeeTags({
      attendeeId: id,
    });

  const { badges, isLoading: badgeIsLoading } = useGetBadges({
    eventId: event.eventAlias,
  });

  const [selectedBadge, setBadge] = useState<TBadge | null>(null);

  const {
    attendeeCertificates,
    isLoading: attendeeCertificatesIsLoading,
    getAttendeeCertificates,
  } = useGetAttendeeCertificates({
    eventId,
    attendeeId: id,
  });
  console.log(attendeeCertificates, "attendee certificates");

  const {
    certificates: eventCertificates,
    isLoading: getEventCertificatesIsLoading,
  } = useGetCertificates({
    eventId,
  });
  console.log(eventCertificates, "event certificates");

  const { updateAttendeeCertificates } = useUpdateAttendeeCertificates({
    eventId: 5,
  });

  const { releaseAttendeeCertificate, isLoading } =
    useReleaseAttendeeCertificate();

  useEffect(() => {
    getnote();
  }, [attendee]);

  async function removeAttendeeTag(tag: TTag) {
    const payload: TAttendeeTags = {
      ...attendeeTags,
      attendeeTags: attendeeTags.attendeeTags.filter(
        (prevTag) => prevTag !== tag
      ),
    };

    await updateAttendeeTags({ payload });
    await getAttendeeTags();
  }

  const sendMail = () => {
    const to = email;
    const subject = "";
    const body = `Hi ${firstName}`;

    // Construct the mailto URL
    const mailtoUrl = `mailto:${encodeURIComponent(
      to
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the user's default email client
    window.location.href = mailtoUrl;
  };

  function sendWhatsAppMessage() {
    // Replace the following values with your desired WhatsApp details
    const baseUrl = "https://web.whatsapp.com/send";

    // Construct the WhatsApp Web URL
    const whatsappWebUrl = `${baseUrl}?phone=${encodeURIComponent(
      whatsappNumber || phoneNumber
    )}&text=${encodeURIComponent(`hello ${firstName}`)}`;

    // Open the URL in a new tab or window
    window.open(whatsappWebUrl, "_blank");
  }

  const releaseCertificate = async (eventCertificate: TCertificate) => {
    await updateAttendeeCertificates({
      payload: {
        action: "release",
        attendeeInfo: [
          {
            attendeeId: id,
            attendeeEmail: email,
          },
        ],
        certificateInfo: {
          eventAlias: eventCertificate.eventId,
          CertificateGroupId: eventCertificate.id,
          CertificateName: eventCertificate.certificateName,
        },
      },
    });
    // await getAttendeeCertificates();
    // await getEventCertificates();

    const newAttendeeCertificate = await releaseAttendeeCertificate({
      payload: {
        eventAlias: eventCertificate.eventId,
        attendeeId: id,
        CertificateGroupId: eventCertificate.id,
        attendeeEmail: email,
        CertificateName: eventCertificate.certificateName,
      },
    });

    console.log(newAttendeeCertificate);

    await getAttendeeCertificates();

    // if (newAttendeeCertificate) {
    //   router.push(`/verify/${newAttendeeCertificate.certificateId}`);
    // }
  };

  const { toPDF, targetRef } = usePDF({
    filename: `${firstName}-${lastName}-badge.pdf`,
  });

  const parentCardRef = useRef<HTMLDivElement>(null);
  const innerCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parentCard = parentCardRef.current;
    const innerCard = innerCardRef.current;

    if (!parentCard || !innerCard) return;

    console.log(innerCard.style, parentCard.style);
    parentCard.style.height = `${innerCard.style.height}px`;
  }, [attendee]);

  const [cardIsFlipped, setFlipCard] = useState<boolean>(false);

  const flipCard = () => setFlipCard((prevFlip) => !prevFlip);

  const {
    isOpen: attendeeFormIsOpen,
    onOpen: onOpenattendeeForm,
    onClose: onCloseAttendeeForm,
  } = useDisclose();

  // const [certificateId, setCertificateId] = useState<string>("");

  console.log(
    event?.createdBy,
    String(user.id),
    String(event?.createdBy) === String(user.id)
  );

  const { createAttendee } = useCreateAttendee();

  const sliderBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="h-fit space-y-4">
      <div
        ref={parentCardRef}
        className="bg-transparent w-full [perspective:1000px] h-[250px]"
      >
        <div
          className={`relative w-full h-full text-center duration-700 transition-transform [transform-style:_preserve-3d] ${
            cardIsFlipped ? "[transform:_rotateY(180deg)]" : ""
          }`}
        >
          <section className="absolute w-full h-full [backface-visibility:_hidden] top-0">
            <div className="relative z-[1000]">
              <div className="absolute top-0 left-0">
                <button
                  onClick={flipCard}
                  className="bg-gray-200 [border-bottom-right-radius:75%] p-4 text-xs font-medium text-gray-700"
                >
                  Flip
                </button>
              </div>
              <div className="absolute top-2 right-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenattendeeForm();
                  }}
                  className={`text-gray-700 ${
                    (user && String(event?.createdBy) === String(user.id)) ||
                    user.userEmail === email
                      ? ""
                      : "hidden"
                  }`}
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 1024 1024"
                    height="1.5em"
                    width="1.5em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" />
                  </svg>
                </button>
              </div>
            </div>
            <div
              className=" pt-8 pb-4 px-2 bg-gray-50 relative h-full"
              ref={innerCardRef}
            >
              {window.innerWidth > 768 && (
                <img
                  src="/images/card_design.png"
                  alt="design"
                  className="grayscale bottom-0 left-0 absolute -z-10"
                />
              )}
              <div className="flex justify-center gap-4 h-full">
                <div className="flex-1 flex justify-center">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      className="h-full w-full object-cover"
                      src={profilePicture}
                    />
                    <AvatarFallback>
                      {firstName[0] + lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 flex flex-col gap-2 text-left h-full justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="uppercase">
                      <h3 className="text-gray-500 font-semibold text-xl md:text-2xl -tracking-wider">
                        {firstName}
                      </h3>
                      <h3 className="text-greyBlack font-semibold text-xl md:text-2xl">
                        {lastName}
                      </h3>
                    </div>
                    <div className="uppercase">
                      {jobTitle && (
                        <h4 className="text-grayBlack">{jobTitle}</h4>
                      )}
                      {organization && (
                        <h4 className="text-gray-500 text-sm">
                          {organization}
                        </h4>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 items-start">
                    {phoneNumber && (
                      <div className="w-12 h-12 rounded-[50%] flex justify-center items-center">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18 9.75H16.5C16.4994 9.15345 16.2622 8.5815 15.8403 8.15967C15.4185 7.73784 14.8466 7.5006 14.25 7.5V6C15.2442 6.00119 16.1973 6.39666 16.9003 7.09966C17.6033 7.80267 17.9988 8.7558 18 9.75Z"
                            fill="black"
                          />
                          <path
                            d="M21.0003 9.75001H19.5003C19.4987 8.35811 18.945 7.02367 17.9608 6.03945C16.9766 5.05523 15.6422 4.50159 14.2503 4.50001V3.00001C16.0399 3.00199 17.7556 3.71379 19.021 4.97923C20.2865 6.24467 20.9983 7.9604 21.0003 9.75001ZM15.25 16.1115L16.93 14.4315C17.1549 14.2066 17.4408 14.0526 17.7524 13.9886C18.0639 13.9246 18.3874 13.9534 18.6828 14.0715L20.7288 14.8905C21.0303 15.0112 21.2888 15.2194 21.4709 15.4884C21.653 15.7573 21.7503 16.0747 21.7503 16.3995V20.1203C21.7508 20.3414 21.7062 20.5603 21.6192 20.7636C21.5321 20.9669 21.4045 21.1504 21.2442 21.3026C21.0838 21.4549 20.8941 21.5729 20.6865 21.6493C20.479 21.7257 20.2581 21.7589 20.0373 21.747C5.69576 20.8545 2.79926 8.70751 2.26151 4.05601C2.23546 3.8286 2.25786 3.59826 2.32722 3.38013C2.39658 3.16201 2.51133 2.96104 2.66394 2.79044C2.81654 2.61984 3.00353 2.48349 3.21261 2.39034C3.42169 2.29719 3.64812 2.24937 3.87701 2.25001H7.53176C7.85656 2.25 8.17392 2.3473 8.44289 2.52938C8.71185 2.71146 8.9201 2.96995 9.04076 3.27151L9.85901 5.31751C9.97709 5.61284 10.0059 5.93633 9.94193 6.24788C9.87794 6.55944 9.72394 6.84538 9.49901 7.07026L7.81901 8.75026C7.81901 8.75026 8.75051 15.2993 15.25 16.1115Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                    )}
                    {(whatsappNumber || phoneNumber) && (
                      <button onClick={sendWhatsAppMessage} className="flex-1">
                        <div className=" w-12 h-12 rounded-[50%] flex justify-center items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="24"
                            viewBox="0 0 25 24"
                            fill="none"
                          >
                            <path
                              d="M12.501 2C18.024 2 22.501 6.477 22.501 12C22.501 17.523 18.024 22 12.501 22C10.7338 22.0029 8.99765 21.5352 7.47099 20.645L2.50499 22L3.85699 17.032C2.96608 15.5049 2.49804 13.768 2.50099 12C2.50099 6.477 6.97799 2 12.501 2ZM9.09299 7.3L8.89299 7.308C8.76351 7.31589 8.63697 7.3499 8.52099 7.408C8.41251 7.46943 8.31349 7.54622 8.22699 7.636C8.10699 7.749 8.03899 7.847 7.96599 7.942C7.59611 8.4229 7.39696 9.01331 7.39999 9.62C7.40199 10.11 7.52999 10.587 7.72999 11.033C8.13899 11.935 8.81199 12.89 9.69999 13.775C9.91399 13.988 10.124 14.202 10.35 14.401C11.4534 15.3725 12.7682 16.073 14.19 16.447L14.758 16.534C14.943 16.544 15.128 16.53 15.314 16.521C15.6052 16.506 15.8896 16.4271 16.147 16.29C16.2779 16.2225 16.4057 16.1491 16.53 16.07C16.53 16.07 16.573 16.042 16.655 15.98C16.79 15.88 16.873 15.809 16.985 15.692C17.068 15.606 17.14 15.505 17.195 15.39C17.273 15.227 17.351 14.916 17.383 14.657C17.407 14.459 17.4 14.351 17.397 14.284C17.393 14.177 17.304 14.066 17.207 14.019L16.625 13.758C16.625 13.758 15.755 13.379 15.223 13.137C15.1673 13.1127 15.1077 13.0988 15.047 13.096C14.9786 13.089 14.9094 13.0967 14.8442 13.1186C14.779 13.1405 14.7193 13.1761 14.669 13.223C14.664 13.221 14.597 13.278 13.874 14.154C13.8325 14.2098 13.7753 14.2519 13.7098 14.2751C13.6443 14.2982 13.5733 14.3013 13.506 14.284C13.4408 14.2665 13.377 14.2445 13.315 14.218C13.191 14.166 13.148 14.146 13.063 14.11C12.4891 13.8595 11.9577 13.5211 11.488 13.107C11.362 12.997 11.245 12.877 11.125 12.761C10.7316 12.3842 10.3887 11.958 10.105 11.493L10.046 11.398C10.0036 11.3342 9.96935 11.2653 9.94399 11.193C9.90599 11.046 10.005 10.928 10.005 10.928C10.005 10.928 10.248 10.662 10.361 10.518C10.471 10.378 10.564 10.242 10.624 10.145C10.742 9.955 10.779 9.76 10.717 9.609C10.437 8.925 10.147 8.244 9.84899 7.568C9.78999 7.434 9.61499 7.338 9.45599 7.319C9.40199 7.313 9.34799 7.307 9.29399 7.303C9.1597 7.29633 9.02513 7.29766 8.89099 7.307L9.09199 7.299L9.09299 7.3Z"
                              fill="#15161B"
                            />
                          </svg>
                        </div>
                        {/* <span className="text-xs text-[#3E404B] font-semibold text-center">
                    WhatsApp
                  </span> */}
                      </button>
                    )}
                    <button onClick={sendMail} className="flex-1">
                      <div className=" w-12 h-12 rounded-[50%] flex justify-center items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="24"
                          viewBox="0 0 25 24"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M5.5 20C4.70435 20 3.94129 19.6839 3.37868 19.1213C2.81607 18.5587 2.5 17.7956 2.5 17V7C2.5 6.20435 2.81607 5.44129 3.37868 4.87868C3.94129 4.31607 4.70435 4 5.5 4H19.5C20.2956 4 21.0587 4.31607 21.6213 4.87868C22.1839 5.44129 22.5 6.20435 22.5 7V17C22.5 17.7956 22.1839 18.5587 21.6213 19.1213C21.0587 19.6839 20.2956 20 19.5 20H5.5ZM8.125 8.22C8.02313 8.13302 7.90483 8.06739 7.77711 8.027C7.6494 7.98662 7.51487 7.97231 7.38151 7.98491C7.24816 7.99752 7.11869 8.03679 7.00081 8.1004C6.88292 8.164 6.77901 8.25064 6.69525 8.35517C6.61149 8.4597 6.54959 8.58 6.51321 8.70891C6.47684 8.83783 6.46673 8.97274 6.4835 9.10564C6.50026 9.23853 6.54356 9.36671 6.61081 9.48255C6.67806 9.59839 6.7679 9.69954 6.875 9.78L10.625 12.781C11.1571 13.207 11.8184 13.4391 12.5 13.4391C13.1816 13.4391 13.8429 13.207 14.375 12.781L18.125 9.781C18.2276 9.69892 18.313 9.59745 18.3763 9.48237C18.4396 9.3673 18.4797 9.24087 18.4942 9.11031C18.5087 8.97975 18.4973 8.84762 18.4607 8.72145C18.4241 8.59529 18.3631 8.47756 18.281 8.375C18.1989 8.27244 18.0974 8.18705 17.9824 8.1237C17.8673 8.06035 17.7409 8.02029 17.6103 8.00581C17.4798 7.99132 17.3476 8.00269 17.2215 8.03927C17.0953 8.07585 16.9776 8.13692 16.875 8.219L13.125 11.219C12.9476 11.361 12.7272 11.4384 12.5 11.4384C12.2728 11.4384 12.0524 11.361 11.875 11.219L8.125 8.219V8.22Z"
                            fill="#15161B"
                          />
                        </svg>
                      </div>
                    </button>
                    {
                      <div className="w-12 h-12 rounded-[50%] flex justify-center items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_11643_35877)">
                            <path
                              d="M16 14C17.3261 14 18.5979 14.5268 19.5355 15.4645C20.4732 16.4021 21 17.6739 21 19V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V19C3 17.6739 3.52678 16.4021 4.46447 15.4645C5.40215 14.5268 6.67392 14 8 14H16ZM20 8C20.2652 8 20.5196 8.10536 20.7071 8.29289C20.8946 8.48043 21 8.73478 21 9V10H22C22.2652 10 22.5196 10.1054 22.7071 10.2929C22.8946 10.4804 23 10.7348 23 11C23 11.2652 22.8946 11.5196 22.7071 11.7071C22.5196 11.8946 22.2652 12 22 12H21V13C21 13.2652 20.8946 13.5196 20.7071 13.7071C20.5196 13.8946 20.2652 14 20 14C19.7348 14 19.4804 13.8946 19.2929 13.7071C19.1054 13.5196 19 13.2652 19 13V12H18C17.7348 12 17.4804 11.8946 17.2929 11.7071C17.1054 11.5196 17 11.2652 17 11C17 10.7348 17.1054 10.4804 17.2929 10.2929C17.4804 10.1054 17.7348 10 18 10H19V9C19 8.73478 19.1054 8.48043 19.2929 8.29289C19.4804 8.10536 19.7348 8 20 8ZM12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7C17 8.32608 16.4732 9.59785 15.5355 10.5355C14.5979 11.4732 13.3261 12 12 12C10.6739 12 9.40215 11.4732 8.46447 10.5355C7.52678 9.59785 7 8.32608 7 7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2Z"
                              fill="#15161B"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_11643_35877">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    }
                    {/* <div className="flex-1 flex flex-col gap-2 items-center justify-center">
                <div className=" w-12 h-12 rounded-[50%] bg-[#F3F3F3] flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_11643_35897)">
                      <path
                        d="M22.0836 4.00008H19.4169V6.00008C19.4169 6.19268 19.379 6.3834 19.3053 6.56135C19.2316 6.73929 19.1235 6.90097 18.9873 7.03717C18.8512 7.17336 18.6895 7.28139 18.5115 7.3551C18.3336 7.42881 18.1429 7.46674 17.9503 7.46674C17.7576 7.46674 17.5669 7.42881 17.389 7.3551C17.211 7.28139 17.0494 7.17336 16.9132 7.03717C16.777 6.90097 16.6689 6.73929 16.5952 6.56135C16.5215 6.3834 16.4836 6.19268 16.4836 6.00008V4.00008H8.71692V6.00008C8.71692 6.38906 8.5624 6.76211 8.28734 7.03717C8.01229 7.31222 7.63924 7.46674 7.25025 7.46674C6.86127 7.46674 6.48822 7.31222 6.21316 7.03717C5.93811 6.76211 5.78359 6.38906 5.78359 6.00008V4.00008H3.11692C2.95827 3.99827 2.80087 4.0283 2.65402 4.08838C2.50718 4.14847 2.37387 4.23739 2.262 4.34989C2.15012 4.4624 2.06193 4.59619 2.00266 4.74336C1.94339 4.89054 1.91424 5.0481 1.91692 5.20674V20.1267C1.91427 20.2826 1.94235 20.4374 1.99955 20.5824C2.05675 20.7274 2.14195 20.8597 2.25029 20.9718C2.35863 21.0838 2.48799 21.1734 2.63096 21.2355C2.77394 21.2975 2.92774 21.3308 3.08359 21.3334H22.0836C22.2394 21.3308 22.3932 21.2975 22.5362 21.2355C22.6792 21.1734 22.8085 21.0838 22.9169 20.9718C23.0252 20.8597 23.1104 20.7274 23.1676 20.5824C23.2248 20.4374 23.2529 20.2826 23.2503 20.1267V5.20674C23.2529 5.0509 23.2248 4.89607 23.1676 4.75108C23.1104 4.60609 23.0252 4.47379 22.9169 4.36174C22.8085 4.24968 22.6792 4.16007 22.5362 4.09802C22.3932 4.03596 22.2394 4.00268 22.0836 4.00008ZM7.25025 17.3334H5.91692V16.0001H7.25025V17.3334ZM7.25025 14.0001H5.91692V12.6667H7.25025V14.0001ZM7.25025 10.6667H5.91692V9.33341H7.25025V10.6667ZM11.2503 17.3334H9.91692V16.0001H11.2503V17.3334ZM11.2503 14.0001H9.91692V12.6667H11.2503V14.0001ZM11.2503 10.6667H9.91692V9.33341H11.2503V10.6667ZM15.2503 17.3334H13.9169V16.0001H15.2503V17.3334ZM15.2503 14.0001H13.9169V12.6667H15.2503V14.0001ZM15.2503 10.6667H13.9169V9.33341H15.2503V10.6667ZM19.2503 17.3334H17.9169V16.0001H19.2503V17.3334ZM19.2503 14.0001H17.9169V12.6667H19.2503V14.0001ZM19.2503 10.6667H17.9169V9.33341H19.2503V10.6667Z"
                        fill="#15161B"
                      />
                      <path
                        d="M7.25016 6.66634C7.42697 6.66634 7.59654 6.5961 7.72157 6.47108C7.84659 6.34605 7.91683 6.17649 7.91683 5.99967V1.99967C7.91683 1.82286 7.84659 1.65329 7.72157 1.52827C7.59654 1.40325 7.42697 1.33301 7.25016 1.33301C7.07335 1.33301 6.90378 1.40325 6.77876 1.52827C6.65373 1.65329 6.5835 1.82286 6.5835 1.99967V5.99967C6.5835 6.17649 6.65373 6.34605 6.77876 6.47108C6.90378 6.5961 7.07335 6.66634 7.25016 6.66634Z"
                        fill="#15161B"
                      />
                      <path
                        d="M17.9169 6.66634C18.0937 6.66634 18.2633 6.5961 18.3883 6.47108C18.5133 6.34605 18.5836 6.17649 18.5836 5.99967V1.99967C18.5836 1.82286 18.5133 1.65329 18.3883 1.52827C18.2633 1.40325 18.0937 1.33301 17.9169 1.33301C17.7401 1.33301 17.5705 1.40325 17.4455 1.52827C17.3205 1.65329 17.2502 1.82286 17.2502 1.99967V5.99967C17.2502 6.17649 17.3205 6.34605 17.4455 6.47108C17.5705 6.5961 17.7401 6.66634 17.9169 6.66634Z"
                        fill="#15161B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_11643_35897">
                        <rect
                          width="24"
                          height="24"
                          fill="white"
                          transform="translate(0.583496)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span className=" text-xs text-[#3E404B] font-semibold text-center">
                  Schedule Appointment
                </span>
              </div> */}
                  </div>
                  <SlideToReveal action={() => console.log("hello world")} />
                </div>
              </div>
            </div>
          </section>
          <section className="[transform:_rotateY(180deg)] absolute [backface-visibility:_hidden] top-0 h-full w-full bg-gray-50 flex gap-2">
            <div className="relative z-[1000]">
              <div className="absolute top-0 left-0">
                <button
                  onClick={flipCard}
                  className="bg-gray-200  [border-top-right-radius:75%]
                  [border-bottom-right-radius:75%] p-4 text-xs font-medium text-gray-700"
                >
                  Flip
                </button>
              </div>
            </div>
            <div className="pt-8 pb-4 px-2 md:px-6 grid md:grid-cols-2 md:justify-center md:items-center gap-2 md:gap-8 w-full">
              <div className="flex flex-col gap-4 flex-1 h-full col-span-1">
                {phoneNumber && (
                  <div className="flex gap-1 items-center">
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 9.75H16.5C16.4994 9.15345 16.2622 8.5815 15.8403 8.15967C15.4185 7.73784 14.8466 7.5006 14.25 7.5V6C15.2442 6.00119 16.1973 6.39666 16.9003 7.09966C17.6033 7.80267 17.9988 8.7558 18 9.75Z"
                        fill="black"
                      />
                      <path
                        d="M21.0003 9.75001H19.5003C19.4987 8.35811 18.945 7.02367 17.9608 6.03945C16.9766 5.05523 15.6422 4.50159 14.2503 4.50001V3.00001C16.0399 3.00199 17.7556 3.71379 19.021 4.97923C20.2865 6.24467 20.9983 7.9604 21.0003 9.75001ZM15.25 16.1115L16.93 14.4315C17.1549 14.2066 17.4408 14.0526 17.7524 13.9886C18.0639 13.9246 18.3874 13.9534 18.6828 14.0715L20.7288 14.8905C21.0303 15.0112 21.2888 15.2194 21.4709 15.4884C21.653 15.7573 21.7503 16.0747 21.7503 16.3995V20.1203C21.7508 20.3414 21.7062 20.5603 21.6192 20.7636C21.5321 20.9669 21.4045 21.1504 21.2442 21.3026C21.0838 21.4549 20.8941 21.5729 20.6865 21.6493C20.479 21.7257 20.2581 21.7589 20.0373 21.747C5.69576 20.8545 2.79926 8.70751 2.26151 4.05601C2.23546 3.8286 2.25786 3.59826 2.32722 3.38013C2.39658 3.16201 2.51133 2.96104 2.66394 2.79044C2.81654 2.61984 3.00353 2.48349 3.21261 2.39034C3.42169 2.29719 3.64812 2.24937 3.87701 2.25001H7.53176C7.85656 2.25 8.17392 2.3473 8.44289 2.52938C8.71185 2.71146 8.9201 2.96995 9.04076 3.27151L9.85901 5.31751C9.97709 5.61284 10.0059 5.93633 9.94193 6.24788C9.87794 6.55944 9.72394 6.84538 9.49901 7.07026L7.81901 8.75026C7.81901 8.75026 8.75051 15.2993 15.25 16.1115Z"
                        fill="black"
                      />
                    </svg>
                    <span className="text-gray-500 text-xs md:text-sm truncate">
                      {phoneNumber}
                    </span>
                  </div>
                )}
                {(whatsappNumber || phoneNumber) && (
                  <div className="flex gap-1 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 25 24"
                      fill="none"
                    >
                      <path
                        d="M12.501 2C18.024 2 22.501 6.477 22.501 12C22.501 17.523 18.024 22 12.501 22C10.7338 22.0029 8.99765 21.5352 7.47099 20.645L2.50499 22L3.85699 17.032C2.96608 15.5049 2.49804 13.768 2.50099 12C2.50099 6.477 6.97799 2 12.501 2ZM9.09299 7.3L8.89299 7.308C8.76351 7.31589 8.63697 7.3499 8.52099 7.408C8.41251 7.46943 8.31349 7.54622 8.22699 7.636C8.10699 7.749 8.03899 7.847 7.96599 7.942C7.59611 8.4229 7.39696 9.01331 7.39999 9.62C7.40199 10.11 7.52999 10.587 7.72999 11.033C8.13899 11.935 8.81199 12.89 9.69999 13.775C9.91399 13.988 10.124 14.202 10.35 14.401C11.4534 15.3725 12.7682 16.073 14.19 16.447L14.758 16.534C14.943 16.544 15.128 16.53 15.314 16.521C15.6052 16.506 15.8896 16.4271 16.147 16.29C16.2779 16.2225 16.4057 16.1491 16.53 16.07C16.53 16.07 16.573 16.042 16.655 15.98C16.79 15.88 16.873 15.809 16.985 15.692C17.068 15.606 17.14 15.505 17.195 15.39C17.273 15.227 17.351 14.916 17.383 14.657C17.407 14.459 17.4 14.351 17.397 14.284C17.393 14.177 17.304 14.066 17.207 14.019L16.625 13.758C16.625 13.758 15.755 13.379 15.223 13.137C15.1673 13.1127 15.1077 13.0988 15.047 13.096C14.9786 13.089 14.9094 13.0967 14.8442 13.1186C14.779 13.1405 14.7193 13.1761 14.669 13.223C14.664 13.221 14.597 13.278 13.874 14.154C13.8325 14.2098 13.7753 14.2519 13.7098 14.2751C13.6443 14.2982 13.5733 14.3013 13.506 14.284C13.4408 14.2665 13.377 14.2445 13.315 14.218C13.191 14.166 13.148 14.146 13.063 14.11C12.4891 13.8595 11.9577 13.5211 11.488 13.107C11.362 12.997 11.245 12.877 11.125 12.761C10.7316 12.3842 10.3887 11.958 10.105 11.493L10.046 11.398C10.0036 11.3342 9.96935 11.2653 9.94399 11.193C9.90599 11.046 10.005 10.928 10.005 10.928C10.005 10.928 10.248 10.662 10.361 10.518C10.471 10.378 10.564 10.242 10.624 10.145C10.742 9.955 10.779 9.76 10.717 9.609C10.437 8.925 10.147 8.244 9.84899 7.568C9.78999 7.434 9.61499 7.338 9.45599 7.319C9.40199 7.313 9.34799 7.307 9.29399 7.303C9.1597 7.29633 9.02513 7.29766 8.89099 7.307L9.09199 7.299L9.09299 7.3Z"
                        fill="#15161B"
                      />
                    </svg>
                    <span className="text-gray-500 text-xs md:text-sm truncate">
                      {whatsappNumber || phoneNumber}
                    </span>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.5 20C4.70435 20 3.94129 19.6839 3.37868 19.1213C2.81607 18.5587 2.5 17.7956 2.5 17V7C2.5 6.20435 2.81607 5.44129 3.37868 4.87868C3.94129 4.31607 4.70435 4 5.5 4H19.5C20.2956 4 21.0587 4.31607 21.6213 4.87868C22.1839 5.44129 22.5 6.20435 22.5 7V17C22.5 17.7956 22.1839 18.5587 21.6213 19.1213C21.0587 19.6839 20.2956 20 19.5 20H5.5ZM8.125 8.22C8.02313 8.13302 7.90483 8.06739 7.77711 8.027C7.6494 7.98662 7.51487 7.97231 7.38151 7.98491C7.24816 7.99752 7.11869 8.03679 7.00081 8.1004C6.88292 8.164 6.77901 8.25064 6.69525 8.35517C6.61149 8.4597 6.54959 8.58 6.51321 8.70891C6.47684 8.83783 6.46673 8.97274 6.4835 9.10564C6.50026 9.23853 6.54356 9.36671 6.61081 9.48255C6.67806 9.59839 6.7679 9.69954 6.875 9.78L10.625 12.781C11.1571 13.207 11.8184 13.4391 12.5 13.4391C13.1816 13.4391 13.8429 13.207 14.375 12.781L18.125 9.781C18.2276 9.69892 18.313 9.59745 18.3763 9.48237C18.4396 9.3673 18.4797 9.24087 18.4942 9.11031C18.5087 8.97975 18.4973 8.84762 18.4607 8.72145C18.4241 8.59529 18.3631 8.47756 18.281 8.375C18.1989 8.27244 18.0974 8.18705 17.9824 8.1237C17.8673 8.06035 17.7409 8.02029 17.6103 8.00581C17.4798 7.99132 17.3476 8.00269 17.2215 8.03927C17.0953 8.07585 16.9776 8.13692 16.875 8.219L13.125 11.219C12.9476 11.361 12.7272 11.4384 12.5 11.4384C12.2728 11.4384 12.0524 11.361 11.875 11.219L8.125 8.219V8.22Z"
                      fill="#15161B"
                    />
                  </svg>
                  <span className="text-gray-500 text-xs md:text-sm truncate">
                    {email}
                  </span>
                </div>
                {
                  <div className="flex gap-2 items-center">
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      height={20}
                      width={20}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx={12} cy={12} r={10} />
                      <line x1={2} y1={12} x2={22} y2={12} />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span className="text-gray-500 text-xs md:text-sm truncate">
                      {websiteUrl}
                    </span>
                  </div>
                }
                {/* <div className="flex-1 flex flex-col gap-2 items-center justify-center">
                <div className=" w-12 h-12 rounded-[50%] bg-[#F3F3F3] flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_11643_35897)">
                      <path
                        d="M22.0836 4.00008H19.4169V6.00008C19.4169 6.19268 19.379 6.3834 19.3053 6.56135C19.2316 6.73929 19.1235 6.90097 18.9873 7.03717C18.8512 7.17336 18.6895 7.28139 18.5115 7.3551C18.3336 7.42881 18.1429 7.46674 17.9503 7.46674C17.7576 7.46674 17.5669 7.42881 17.389 7.3551C17.211 7.28139 17.0494 7.17336 16.9132 7.03717C16.777 6.90097 16.6689 6.73929 16.5952 6.56135C16.5215 6.3834 16.4836 6.19268 16.4836 6.00008V4.00008H8.71692V6.00008C8.71692 6.38906 8.5624 6.76211 8.28734 7.03717C8.01229 7.31222 7.63924 7.46674 7.25025 7.46674C6.86127 7.46674 6.48822 7.31222 6.21316 7.03717C5.93811 6.76211 5.78359 6.38906 5.78359 6.00008V4.00008H3.11692C2.95827 3.99827 2.80087 4.0283 2.65402 4.08838C2.50718 4.14847 2.37387 4.23739 2.262 4.34989C2.15012 4.4624 2.06193 4.59619 2.00266 4.74336C1.94339 4.89054 1.91424 5.0481 1.91692 5.20674V20.1267C1.91427 20.2826 1.94235 20.4374 1.99955 20.5824C2.05675 20.7274 2.14195 20.8597 2.25029 20.9718C2.35863 21.0838 2.48799 21.1734 2.63096 21.2355C2.77394 21.2975 2.92774 21.3308 3.08359 21.3334H22.0836C22.2394 21.3308 22.3932 21.2975 22.5362 21.2355C22.6792 21.1734 22.8085 21.0838 22.9169 20.9718C23.0252 20.8597 23.1104 20.7274 23.1676 20.5824C23.2248 20.4374 23.2529 20.2826 23.2503 20.1267V5.20674C23.2529 5.0509 23.2248 4.89607 23.1676 4.75108C23.1104 4.60609 23.0252 4.47379 22.9169 4.36174C22.8085 4.24968 22.6792 4.16007 22.5362 4.09802C22.3932 4.03596 22.2394 4.00268 22.0836 4.00008ZM7.25025 17.3334H5.91692V16.0001H7.25025V17.3334ZM7.25025 14.0001H5.91692V12.6667H7.25025V14.0001ZM7.25025 10.6667H5.91692V9.33341H7.25025V10.6667ZM11.2503 17.3334H9.91692V16.0001H11.2503V17.3334ZM11.2503 14.0001H9.91692V12.6667H11.2503V14.0001ZM11.2503 10.6667H9.91692V9.33341H11.2503V10.6667ZM15.2503 17.3334H13.9169V16.0001H15.2503V17.3334ZM15.2503 14.0001H13.9169V12.6667H15.2503V14.0001ZM15.2503 10.6667H13.9169V9.33341H15.2503V10.6667ZM19.2503 17.3334H17.9169V16.0001H19.2503V17.3334ZM19.2503 14.0001H17.9169V12.6667H19.2503V14.0001ZM19.2503 10.6667H17.9169V9.33341H19.2503V10.6667Z"
                        fill="#15161B"
                      />
                      <path
                        d="M7.25016 6.66634C7.42697 6.66634 7.59654 6.5961 7.72157 6.47108C7.84659 6.34605 7.91683 6.17649 7.91683 5.99967V1.99967C7.91683 1.82286 7.84659 1.65329 7.72157 1.52827C7.59654 1.40325 7.42697 1.33301 7.25016 1.33301C7.07335 1.33301 6.90378 1.40325 6.77876 1.52827C6.65373 1.65329 6.5835 1.82286 6.5835 1.99967V5.99967C6.5835 6.17649 6.65373 6.34605 6.77876 6.47108C6.90378 6.5961 7.07335 6.66634 7.25016 6.66634Z"
                        fill="#15161B"
                      />
                      <path
                        d="M17.9169 6.66634C18.0937 6.66634 18.2633 6.5961 18.3883 6.47108C18.5133 6.34605 18.5836 6.17649 18.5836 5.99967V1.99967C18.5836 1.82286 18.5133 1.65329 18.3883 1.52827C18.2633 1.40325 18.0937 1.33301 17.9169 1.33301C17.7401 1.33301 17.5705 1.40325 17.4455 1.52827C17.3205 1.65329 17.2502 1.82286 17.2502 1.99967V5.99967C17.2502 6.17649 17.3205 6.34605 17.4455 6.47108C17.5705 6.5961 17.7401 6.66634 17.9169 6.66634Z"
                        fill="#15161B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_11643_35897">
                        <rect
                          width="24"
                          height="24"
                          fill="white"
                          transform="translate(0.583496)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span className=" text-xs text-[#3E404B] font-semibold text-center">
                  Schedule Appointment
                </span>
              </div> */}
              </div>
              <div className="flex h-full flex-col justify-end items-end w-full col-span-1">
                <div></div>

                {/* <div className="uppercase text-left">
                  <h3 className="text-gray-500 font-semibold text-2xl -tracking-wider">
                    {firstName}
                  </h3>
                  <h3 className="text-greyBlack font-semibold text-2xl">
                    {lastName}
                  </h3>
                </div> */}
                {(x || linkedin || instagram || facebook) && (
                  <div className="flex flex-col">
                    <h4 className="text-gray-800 font-medium text-left text-sm md:text-base">
                      Social Media
                    </h4>
                    <div className="flex gap-4 items-center">
                      {x && (
                        <a href={x}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_11643_35950)">
                              <path
                                d="M12.8025 11.5903L18.2033 19.3155H15.9868L11.5796 13.0118V13.0114L10.9325 12.086L5.78418 4.72168H8.00071L12.1554 10.665L12.8025 11.5903Z"
                                fill="#15161B"
                              />
                              <path
                                d="M21.4067 0H2.59325C1.16108 0 0 1.16108 0 2.59325V21.4067C0 22.8389 1.16108 24 2.59325 24H21.4067C22.8389 24 24 22.8389 24 21.4067V2.59325C24 1.16108 22.8389 0 21.4067 0ZM15.308 20.3525L10.8481 13.8617L5.26435 20.3525H3.82122L10.2073 12.9295L3.82122 3.63521H8.69203L12.9152 9.78152L18.2026 3.63521H19.6458L13.5562 10.7139H13.5558L20.1788 20.3525H15.308Z"
                                fill="#15161B"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_11643_35950">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </a>
                      )}
                      {linkedin && (
                        <a href={linkedin}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={25}
                            height={24}
                            viewBox="0 0 25 24"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_11643_35953)">
                              <path
                                d="M0.946777 1.719C0.946777 0.7695 1.73578 0 2.70928 0H23.1843C24.1578 0 24.9468 0.7695 24.9468 1.719V22.281C24.9468 23.2305 24.1578 24 23.1843 24H2.70928C1.73578 24 0.946777 23.2305 0.946777 22.281V1.719ZM8.36128 20.091V9.2535H4.75978V20.091H8.36128ZM6.56128 7.773C7.81678 7.773 8.59828 6.942 8.59828 5.901C8.57578 4.8375 7.81828 4.029 6.58528 4.029C5.35228 4.029 4.54678 4.839 4.54678 5.901C4.54678 6.942 5.32828 7.773 6.53728 7.773H6.56128ZM13.9233 20.091V14.0385C13.9233 13.7145 13.9473 13.3905 14.0433 13.1595C14.3028 12.513 14.8953 11.8425 15.8913 11.8425C17.1948 11.8425 17.7153 12.8355 17.7153 14.2935V20.091H21.3168V13.875C21.3168 10.545 19.5408 8.997 17.1708 8.997C15.2598 8.997 14.4033 10.047 13.9233 10.7865V10.824H13.8993C13.9072 10.8115 13.9152 10.799 13.9233 10.7865V9.2535H10.3233C10.3683 10.2705 10.3233 20.091 10.3233 20.091H13.9233Z"
                                fill="#15161B"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_11643_35953">
                                <rect
                                  width={24}
                                  height={24}
                                  fill="white"
                                  transform="translate(0.946777)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </a>
                      )}
                      {facebook && (
                        <a href={facebook}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 22 24"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_11643_35955)">
                              <path
                                d="M18.8933 1.91992H3.05331C2.48044 1.91992 1.93104 2.14749 1.52596 2.55257C1.12088 2.95765 0.893311 3.50705 0.893311 4.07992L0.893311 19.9199C0.893311 20.4928 1.12088 21.0422 1.52596 21.4473C1.93104 21.8523 2.48044 22.0799 3.05331 22.0799H9.22956V15.226H6.39456V11.9999H9.22956V9.54112C9.22956 6.74437 10.8946 5.19952 13.4447 5.19952C14.666 5.19952 15.9431 5.41732 15.9431 5.41732V8.16232H14.536C13.1495 8.16232 12.7171 9.02272 12.7171 9.90517V11.9999H15.8122L15.3172 15.226H12.7171V22.0799H18.8933C19.4662 22.0799 20.0156 21.8523 20.4207 21.4473C20.8257 21.0422 21.0533 20.4928 21.0533 19.9199V4.07992C21.0533 3.50705 20.8257 2.95765 20.4207 2.55257C20.0156 2.14749 19.4662 1.91992 18.8933 1.91992Z"
                                fill="#15161B"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_11643_35955">
                                <rect
                                  width="20.16"
                                  height="24"
                                  fill="white"
                                  transform="translate(0.893311)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </a>
                      )}
                      {instagram && (
                        <a href={instagram}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 28 28"
                            fill="none"
                          >
                            <path
                              d="M13.9999 10.355C11.9929 10.355 10.355 11.9929 10.355 13.9999C10.355 16.007 11.9929 17.6449 13.9999 17.6449C16.0069 17.6449 17.6448 16.007 17.6448 13.9999C17.6448 11.9929 16.0069 10.355 13.9999 10.355ZM24.9319 13.9999C24.9319 12.4906 24.9456 10.9949 24.8608 9.48821C24.7761 7.73821 24.3769 6.18509 23.0972 4.9054C21.8147 3.62298 20.2644 3.2265 18.5143 3.14173C17.005 3.05697 15.5093 3.07064 14.0026 3.07064C12.4933 3.07064 10.9975 3.05697 9.49091 3.14173C7.7409 3.2265 6.18778 3.62572 4.90809 4.9054C3.62567 6.18782 3.22918 7.73821 3.14442 9.48821C3.05965 10.9976 3.07332 12.4933 3.07332 13.9999C3.07332 15.5066 3.05965 17.005 3.14442 18.5116C3.22918 20.2616 3.6284 21.8148 4.90809 23.0945C6.19051 24.3769 7.7409 24.7734 9.49091 24.8581C11.0003 24.9429 12.496 24.9292 14.0026 24.9292C15.512 24.9292 17.0077 24.9429 18.5143 24.8581C20.2644 24.7734 21.8175 24.3741 23.0972 23.0945C24.3796 21.812 24.7761 20.2616 24.8608 18.5116C24.9483 17.005 24.9319 15.5093 24.9319 13.9999ZM13.9999 19.6081C10.8964 19.6081 8.39169 17.1034 8.39169 13.9999C8.39169 10.8964 10.8964 8.39173 13.9999 8.39173C17.1034 8.39173 19.6081 10.8964 19.6081 13.9999C19.6081 17.1034 17.1034 19.6081 13.9999 19.6081ZM19.8378 9.47181C19.1132 9.47181 18.528 8.88665 18.528 8.16204C18.528 7.43743 19.1132 6.85228 19.8378 6.85228C20.5624 6.85228 21.1476 7.43743 21.1476 8.16204C21.1478 8.3341 21.114 8.50452 21.0483 8.66352C20.9825 8.82253 20.8861 8.967 20.7644 9.08867C20.6427 9.21033 20.4983 9.3068 20.3393 9.37255C20.1803 9.43829 20.0099 9.47202 19.8378 9.47181Z"
                              fill="#15161B"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <section className="space-y-6 p-4 pt-0">
        {user &&
          (String(event?.createdBy) === String(user.id) ||
            email === user.userEmail) && (
            <div className="flex justify-between items-center">
              <span className="text-tiny font-medium text-gray-500">
                Added {format(new Date(registrationDate), "dd MMMM, yyyy")}
              </span>
              <div className="flex gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M18.125 8.75C18.2908 8.75 18.4497 8.68415 18.5669 8.56694C18.6842 8.44973 18.75 8.29076 18.75 8.125V5C18.75 4.66848 18.6183 4.35054 18.3839 4.11612C18.1495 3.8817 17.8315 3.75 17.5 3.75H2.5C2.16848 3.75 1.85054 3.8817 1.61612 4.11612C1.3817 4.35054 1.25 4.66848 1.25 5V8.125C1.25 8.29076 1.31585 8.44973 1.43306 8.56694C1.55027 8.68415 1.70924 8.75 1.875 8.75C2.20652 8.75 2.52446 8.8817 2.75888 9.11612C2.9933 9.35054 3.125 9.66848 3.125 10C3.125 10.3315 2.9933 10.6495 2.75888 10.8839C2.52446 11.1183 2.20652 11.25 1.875 11.25C1.70924 11.25 1.55027 11.3158 1.43306 11.4331C1.31585 11.5503 1.25 11.7092 1.25 11.875V15C1.25 15.3315 1.3817 15.6495 1.61612 15.8839C1.85054 16.1183 2.16848 16.25 2.5 16.25H17.5C17.8315 16.25 18.1495 16.1183 18.3839 15.8839C18.6183 15.6495 18.75 15.3315 18.75 15V11.875C18.75 11.7092 18.6842 11.5503 18.5669 11.4331C18.4497 11.3158 18.2908 11.25 18.125 11.25C17.7935 11.25 17.4755 11.1183 17.2411 10.8839C17.0067 10.6495 16.875 10.3315 16.875 10C16.875 9.66848 17.0067 9.35054 17.2411 9.11612C17.4755 8.8817 17.7935 8.75 18.125 8.75ZM17.5 12.4188V15H13.125V13.125H11.875V15H2.5V12.4188C3.035 12.2789 3.50854 11.9657 3.84651 11.528C4.18449 11.0903 4.36782 10.553 4.36782 10C4.36782 9.44703 4.18449 8.90966 3.84651 8.472C3.50854 8.03434 3.035 7.72108 2.5 7.58125V5H11.875V6.875H13.125V5H17.5V7.58125C16.965 7.72108 16.4915 8.03434 16.1535 8.472C15.8155 8.90966 15.6322 9.44703 15.6322 10C15.6322 10.553 15.8155 11.0903 16.1535 11.528C16.4915 11.9657 16.965 12.2789 17.5 12.4188Z"
                    fill="#15161B"
                  />
                  <path
                    d="M11.875 8.125H13.125V11.875H11.875V8.125Z"
                    fill="#15161B"
                  />
                </svg>
                <span className=" text-sm text-ash">{ticketType}</span>
              </div>
            </div>
          )}
        <div className="flex gap-4 justify-evenly">
          {phoneNumber && (
            <div className="flex-1 flex flex-col gap-2 items-center justify-center">
              <div className="w-12 h-12 rounded-[50%] bg-[#F3F3F3] flex  justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_11643_35877)">
                    <path
                      d="M16 14C17.3261 14 18.5979 14.5268 19.5355 15.4645C20.4732 16.4021 21 17.6739 21 19V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V19C3 17.6739 3.52678 16.4021 4.46447 15.4645C5.40215 14.5268 6.67392 14 8 14H16ZM20 8C20.2652 8 20.5196 8.10536 20.7071 8.29289C20.8946 8.48043 21 8.73478 21 9V10H22C22.2652 10 22.5196 10.1054 22.7071 10.2929C22.8946 10.4804 23 10.7348 23 11C23 11.2652 22.8946 11.5196 22.7071 11.7071C22.5196 11.8946 22.2652 12 22 12H21V13C21 13.2652 20.8946 13.5196 20.7071 13.7071C20.5196 13.8946 20.2652 14 20 14C19.7348 14 19.4804 13.8946 19.2929 13.7071C19.1054 13.5196 19 13.2652 19 13V12H18C17.7348 12 17.4804 11.8946 17.2929 11.7071C17.1054 11.5196 17 11.2652 17 11C17 10.7348 17.1054 10.4804 17.2929 10.2929C17.4804 10.1054 17.7348 10 18 10H19V9C19 8.73478 19.1054 8.48043 19.2929 8.29289C19.4804 8.10536 19.7348 8 20 8ZM12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7C17 8.32608 16.4732 9.59785 15.5355 10.5355C14.5979 11.4732 13.3261 12 12 12C10.6739 12 9.40215 11.4732 8.46447 10.5355C7.52678 9.59785 7 8.32608 7 7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2Z"
                      fill="#15161B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_11643_35877">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span className="text-xs text-[#3E404B] font-semibold text-center">
                Save contact
              </span>
            </div>
          )}
          <div className="flex-1 flex flex-col gap-2 items-center justify-center">
            <div className=" w-12 h-12 rounded-[50%] bg-[#F3F3F3] flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <g clip-path="url(#clip0_11643_35897)">
                  <path
                    d="M22.0836 4.00008H19.4169V6.00008C19.4169 6.19268 19.379 6.3834 19.3053 6.56135C19.2316 6.73929 19.1235 6.90097 18.9873 7.03717C18.8512 7.17336 18.6895 7.28139 18.5115 7.3551C18.3336 7.42881 18.1429 7.46674 17.9503 7.46674C17.7576 7.46674 17.5669 7.42881 17.389 7.3551C17.211 7.28139 17.0494 7.17336 16.9132 7.03717C16.777 6.90097 16.6689 6.73929 16.5952 6.56135C16.5215 6.3834 16.4836 6.19268 16.4836 6.00008V4.00008H8.71692V6.00008C8.71692 6.38906 8.5624 6.76211 8.28734 7.03717C8.01229 7.31222 7.63924 7.46674 7.25025 7.46674C6.86127 7.46674 6.48822 7.31222 6.21316 7.03717C5.93811 6.76211 5.78359 6.38906 5.78359 6.00008V4.00008H3.11692C2.95827 3.99827 2.80087 4.0283 2.65402 4.08838C2.50718 4.14847 2.37387 4.23739 2.262 4.34989C2.15012 4.4624 2.06193 4.59619 2.00266 4.74336C1.94339 4.89054 1.91424 5.0481 1.91692 5.20674V20.1267C1.91427 20.2826 1.94235 20.4374 1.99955 20.5824C2.05675 20.7274 2.14195 20.8597 2.25029 20.9718C2.35863 21.0838 2.48799 21.1734 2.63096 21.2355C2.77394 21.2975 2.92774 21.3308 3.08359 21.3334H22.0836C22.2394 21.3308 22.3932 21.2975 22.5362 21.2355C22.6792 21.1734 22.8085 21.0838 22.9169 20.9718C23.0252 20.8597 23.1104 20.7274 23.1676 20.5824C23.2248 20.4374 23.2529 20.2826 23.2503 20.1267V5.20674C23.2529 5.0509 23.2248 4.89607 23.1676 4.75108C23.1104 4.60609 23.0252 4.47379 22.9169 4.36174C22.8085 4.24968 22.6792 4.16007 22.5362 4.09802C22.3932 4.03596 22.2394 4.00268 22.0836 4.00008ZM7.25025 17.3334H5.91692V16.0001H7.25025V17.3334ZM7.25025 14.0001H5.91692V12.6667H7.25025V14.0001ZM7.25025 10.6667H5.91692V9.33341H7.25025V10.6667ZM11.2503 17.3334H9.91692V16.0001H11.2503V17.3334ZM11.2503 14.0001H9.91692V12.6667H11.2503V14.0001ZM11.2503 10.6667H9.91692V9.33341H11.2503V10.6667ZM15.2503 17.3334H13.9169V16.0001H15.2503V17.3334ZM15.2503 14.0001H13.9169V12.6667H15.2503V14.0001ZM15.2503 10.6667H13.9169V9.33341H15.2503V10.6667ZM19.2503 17.3334H17.9169V16.0001H19.2503V17.3334ZM19.2503 14.0001H17.9169V12.6667H19.2503V14.0001ZM19.2503 10.6667H17.9169V9.33341H19.2503V10.6667Z"
                    fill="#15161B"
                  />
                  <path
                    d="M7.25016 6.66634C7.42697 6.66634 7.59654 6.5961 7.72157 6.47108C7.84659 6.34605 7.91683 6.17649 7.91683 5.99967V1.99967C7.91683 1.82286 7.84659 1.65329 7.72157 1.52827C7.59654 1.40325 7.42697 1.33301 7.25016 1.33301C7.07335 1.33301 6.90378 1.40325 6.77876 1.52827C6.65373 1.65329 6.5835 1.82286 6.5835 1.99967V5.99967C6.5835 6.17649 6.65373 6.34605 6.77876 6.47108C6.90378 6.5961 7.07335 6.66634 7.25016 6.66634Z"
                    fill="#15161B"
                  />
                  <path
                    d="M17.9169 6.66634C18.0937 6.66634 18.2633 6.5961 18.3883 6.47108C18.5133 6.34605 18.5836 6.17649 18.5836 5.99967V1.99967C18.5836 1.82286 18.5133 1.65329 18.3883 1.52827C18.2633 1.40325 18.0937 1.33301 17.9169 1.33301C17.7401 1.33301 17.5705 1.40325 17.4455 1.52827C17.3205 1.65329 17.2502 1.82286 17.2502 1.99967V5.99967C17.2502 6.17649 17.3205 6.34605 17.4455 6.47108C17.5705 6.5961 17.7401 6.66634 17.9169 6.66634Z"
                    fill="#15161B"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_11643_35897">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.583496)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span className=" text-xs text-[#3E404B] font-semibold text-center">
              Schedule Appointment
            </span>
          </div>
          {(String(event?.createdBy) === String(user.id) ||
            email === user.userEmail) && (
            <div className="rounded border p-2 space-y-2">
              <span className="text-xs text-gray-700 font-medium">
                {checkin && checkin.length > 0
                  ? checkin.filter((elm) => elm.checkin).length + "x check-ins"
                  : "Not checked in on any date"}
              </span>
              {checkin && checkin.length > 0 && (
                <ul className="space-y-0.5">
                  {checkin.map(({ date }) => (
                    <li className="flex gap-1 text-xs text-[#717171]">
                      <div className="text-basePrimary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 21 20"
                          fill="none"
                        >
                          <path
                            d="M7.16667 10.4041L10.7025 13.94L17.7725 6.86914M3 10.4041L6.53583 13.94M13.6067 6.86914L10.9167 9.58331"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span>{format(new Date(date), "dd.MMM.yyyy")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
      {user &&
        (String(event?.createdBy) === String(user.id) ||
          email === user.userEmail) && (
          <section className="flex justify-between items-center border-y-[1px] border-gray-200 p-2">
            <h3 className="text-lg text-greyBlack font-semibold">
              Credentials
            </h3>
            {!attendeeCertificatesIsLoading ? (
              attendeeCertificates.length > 0 &&
              user &&
              String(event?.createdBy) === String(user.id) && (
                <Dialog>
                  <DialogTrigger>
                    <span className="  text-sm text-[#001FCC] ">
                      Recall certificate
                    </span>
                  </DialogTrigger>
                  <DialogContent className="px-3">
                    <DialogHeader>
                      <DialogTitle>
                        <span className="capitalize">Select Certificate</span>
                      </DialogTitle>
                    </DialogHeader>
                    <SelectCertificateModal
                      certificates={attendeeCertificates}
                      action={"recall"}
                      attendeeId={id}
                      getAttendeeCertificates={getAttendeeCertificates}
                    />
                  </DialogContent>
                </Dialog>
              )
            ) : (
              <p className="px-2 text-sm font-medium text-gray-500">
                Loading...
              </p>
            )}
          </section>
        )}
      <section className="flex justify-between items-center px-2">
        {!badgeIsLoading &&
          badges.length > 0 &&
          user &&
          (String(event?.createdBy) === String(user.id) ||
            email === user.userEmail) && (
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className=" flex flex-col items-center gap-2 w-fit">
                    <div className=" w-12 h-12 rounded-[50%] bg-[#F3F3F3] flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                      >
                        <path
                          d="M15.8926 18L16.0659 21.5156L12.5099 19.0444L8.93392 21.518L9.1074 18H7.60557L7.34673 23.25H9.06667L12.5079 20.8697L15.9332 23.25H17.6532L17.3944 18H15.8926ZM19.9723 7.26163L19.8694 5.0091L17.9703 3.79377L16.7547 1.89444L14.5022 1.79132L12.5 0.754395L10.4978 1.79155L8.24523 1.89468L7.02967 3.79377L5.13053 5.0091L5.02768 7.26163L3.99048 9.26385L5.02768 11.2661L5.13081 13.5186L7.02967 14.7339L8.24504 16.6333L10.4976 16.7362L12.5 17.7733L14.5022 16.7362L16.7547 16.6333L17.9701 14.7339L19.8694 13.5188L19.9723 11.2663L21.0095 9.26404L19.9723 7.26163ZM18.4889 10.8686L18.4062 12.674L16.884 13.648L15.9099 15.1703L14.1045 15.2528L12.5 16.084L10.8953 15.2528L9.08987 15.1703L8.11581 13.648L6.59373 12.674L6.51128 10.8686L5.67967 9.26385L6.51109 7.65941L6.59373 5.85379L8.11581 4.87972L9.08987 3.3575L10.8953 3.275L12.5 2.44372L14.1047 3.27496L15.9101 3.35746L16.8842 4.87968L18.4062 5.85379L18.4887 7.65918L19.3203 9.26385L18.4889 10.8686Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <span className=" text-[#3E404B] font-semibold text-xs">
                      View badge
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="py-4 min-w-[200px]">
                  {badges.map((badge) => (
                    <DialogTrigger>
                      <DropdownMenuItem key={badge.id}>
                        <button
                          className="w-full"
                          onClick={() => setBadge(badge)}
                        >
                          {badge.badgeName}
                        </button>
                      </DropdownMenuItem>
                    </DialogTrigger>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="px-3 h-[70vh]">
                <DialogHeader>
                  <DialogTitle>
                    <span className="capitalize">View Badge</span>
                  </DialogTitle>
                </DialogHeader>
                <AttendeeBadge attendee={attendee} badge={selectedBadge} />
              </DialogContent>
            </Dialog>
          )}
        {!getEventCertificatesIsLoading &&
          eventCertificates &&
          user &&
          String(event?.createdBy) === String(user.id) &&
          eventCertificates.some(
            (eventCertificate) =>
              !attendeeCertificates.some(
                (attendeecertificate) =>
                  eventCertificate.id === attendeecertificate.CertificateGroupId
              )
          ) && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className=" flex flex-col items-center gap-2 w-fit">
                  <div className=" w-12 h-12 rounded-[50%] bg-[#F3F3F3] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M23.0625 12C23.0632 11.1663 22.858 10.3452 22.4651 9.60988C22.0722 8.87452 21.5037 8.24758 20.8102 7.78476C20.1168 7.32194 19.3197 7.03756 18.4899 6.95688C17.66 6.87621 16.8231 7.00173 16.0535 7.32231C15.2838 7.64289 14.6053 8.14859 14.0781 8.7945C13.5509 9.44041 13.1913 10.2065 13.0315 11.0248C12.8716 11.8431 12.9163 12.6882 13.1615 13.485C13.4068 14.2819 13.8451 15.0058 14.4375 15.5925V21C14.4375 21.0959 14.4619 21.1901 14.5086 21.2739C14.5552 21.3576 14.6225 21.4281 14.7041 21.4785C14.7856 21.529 14.8786 21.5577 14.9744 21.5621C15.0702 21.5664 15.1655 21.5463 15.2512 21.5034L18 20.1291L20.7488 21.5034C20.8268 21.5423 20.9128 21.5626 21 21.5625C21.1044 21.5627 21.2068 21.5334 21.2953 21.4781C21.3769 21.4278 21.4443 21.3575 21.491 21.2738C21.5378 21.1901 21.5624 21.0959 21.5625 21V15.5925C22.0379 15.1228 22.4154 14.5634 22.6729 13.9467C22.9304 13.33 23.0628 12.6683 23.0625 12ZM14.0625 12C14.0625 11.2212 14.2934 10.46 14.7261 9.81244C15.1587 9.16492 15.7737 8.66024 16.4932 8.36222C17.2127 8.0642 18.0044 7.98623 18.7682 8.13816C19.532 8.29009 20.2336 8.6651 20.7842 9.21577C21.3349 9.76644 21.7099 10.468 21.8618 11.2318C22.0138 11.9956 21.9358 12.7873 21.6378 13.5068C21.3398 14.2263 20.8351 14.8413 20.1876 15.2739C19.54 15.7066 18.7788 15.9375 18 15.9375C16.9557 15.9375 15.9542 15.5227 15.2158 14.7842C14.4773 14.0458 14.0625 13.0443 14.0625 12ZM20.4375 20.0897L18.2512 18.9966C18.1732 18.9576 18.0872 18.9373 18 18.9373C17.9128 18.9373 17.8268 18.9576 17.7488 18.9966L15.5625 20.0897V16.4334C16.3091 16.8448 17.1476 17.0606 18 17.0606C18.8524 17.0606 19.6909 16.8448 20.4375 16.4334V20.0897ZM12.5625 18C12.5625 18.1492 12.5032 18.2923 12.3977 18.3977C12.2923 18.5032 12.1492 18.5625 12 18.5625H3.75C3.4019 18.5625 3.06806 18.4242 2.82192 18.1781C2.57578 17.9319 2.4375 17.5981 2.4375 17.25V5.25C2.4375 4.9019 2.57578 4.56806 2.82192 4.32192C3.06806 4.07578 3.4019 3.9375 3.75 3.9375H20.25C20.5981 3.9375 20.9319 4.07578 21.1781 4.32192C21.4242 4.56806 21.5625 4.9019 21.5625 5.25C21.5625 5.39918 21.5032 5.54226 21.3977 5.64775C21.2923 5.75324 21.1492 5.8125 21 5.8125C20.8508 5.8125 20.7077 5.75324 20.6023 5.64775C20.4968 5.54226 20.4375 5.39918 20.4375 5.25C20.4375 5.20027 20.4177 5.15258 20.3826 5.11742C20.3474 5.08225 20.2997 5.0625 20.25 5.0625H3.75C3.70027 5.0625 3.65258 5.08225 3.61742 5.11742C3.58225 5.15258 3.5625 5.20027 3.5625 5.25V17.25C3.5625 17.2997 3.58225 17.3474 3.61742 17.3826C3.65258 17.4177 3.70027 17.4375 3.75 17.4375H12C12.1492 17.4375 12.2923 17.4968 12.3977 17.6023C12.5032 17.7077 12.5625 17.8508 12.5625 18ZM11.0625 12.75C11.0625 12.8992 11.0032 13.0423 10.8977 13.1477C10.7923 13.2532 10.6492 13.3125 10.5 13.3125H6.75C6.60082 13.3125 6.45774 13.2532 6.35225 13.1477C6.24676 13.0423 6.1875 12.8992 6.1875 12.75C6.1875 12.6008 6.24676 12.4577 6.35225 12.3523C6.45774 12.2468 6.60082 12.1875 6.75 12.1875H10.5C10.6492 12.1875 10.7923 12.2468 10.8977 12.3523C11.0032 12.4577 11.0625 12.6008 11.0625 12.75ZM11.0625 9.75C11.0625 9.89918 11.0032 10.0423 10.8977 10.1477C10.7923 10.2532 10.6492 10.3125 10.5 10.3125H6.75C6.60082 10.3125 6.45774 10.2532 6.35225 10.1477C6.24676 10.0423 6.1875 9.89918 6.1875 9.75C6.1875 9.60082 6.24676 9.45774 6.35225 9.35225C6.45774 9.24676 6.60082 9.1875 6.75 9.1875H10.5C10.6492 9.1875 10.7923 9.24676 10.8977 9.35225C11.0032 9.45774 11.0625 9.60082 11.0625 9.75Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <span className=" text-[#3E404B] font-semibold text-xs">
                    Release certificate
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="py-4 min-w-[200px]">
                {eventCertificates
                  .filter(
                    (eventCertificate) =>
                      !attendeeCertificates.some(
                        (attendeecertificate) =>
                          eventCertificate.id ===
                          attendeecertificate.CertificateGroupId
                      ) &&
                      isPast(eventCertificate.certificateSettings.publishOn)
                  )
                  .map((eventCertificate) => (
                    <DropdownMenuItem key={eventCertificate.id}>
                      <button
                        onClick={() => releaseCertificate(eventCertificate)}
                      >
                        {eventCertificate.certificateName}
                      </button>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        {!attendeeCertificatesIsLoading &&
          attendeeCertificates.length > 0 &&
          user &&
          (String(event?.createdBy) === String(user.id) ||
            email === user.userEmail) && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className=" flex flex-col items-center gap-2 w-fit">
                  <div className=" w-12 h-12 rounded-[50%] bg-[#F3F3F3] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9 5.5C9 5.36739 9.05268 5.24021 9.14645 5.14645C9.24021 5.05268 9.36739 5 9.5 5H14.5C14.6326 5 14.7598 5.05268 14.8536 5.14645C14.9473 5.24021 15 5.36739 15 5.5C15 5.63261 14.9473 5.75979 14.8536 5.85355C14.7598 5.94732 14.6326 6 14.5 6H9.5C9.36739 6 9.24021 5.94732 9.14645 5.85355C9.05268 5.75979 9 5.63261 9 5.5ZM7.5 8C7.36739 8 7.24021 8.05268 7.14645 8.14645C7.05268 8.24021 7 8.36739 7 8.5C7 8.63261 7.05268 8.75979 7.14645 8.85355C7.24021 8.94732 7.36739 9 7.5 9H16.5C16.6326 9 16.7598 8.94732 16.8536 8.85355C16.9473 8.75979 17 8.63261 17 8.5C17 8.36739 16.9473 8.24021 16.8536 8.14645C16.7598 8.05268 16.6326 8 16.5 8H7.5ZM7 10.5C7 10.3674 7.05268 10.2402 7.14645 10.1464C7.24021 10.0527 7.36739 10 7.5 10H16.5C16.6326 10 16.7598 10.0527 16.8536 10.1464C16.9473 10.2402 17 10.3674 17 10.5C17 10.6326 16.9473 10.7598 16.8536 10.8536C16.7598 10.9473 16.6326 11 16.5 11H7.5C7.36739 11 7.24021 10.9473 7.14645 10.8536C7.05268 10.7598 7 10.6326 7 10.5ZM7.5 12C7.36739 12 7.24021 12.0527 7.14645 12.1464C7.05268 12.2402 7 12.3674 7 12.5C7 12.6326 7.05268 12.7598 7.14645 12.8536C7.24021 12.9473 7.36739 13 7.5 13H16.5C16.6326 13 16.7598 12.9473 16.8536 12.8536C16.9473 12.7598 17 12.6326 17 12.5C17 12.3674 16.9473 12.2402 16.8536 12.1464C16.7598 12.0527 16.6326 12 16.5 12H7.5Z"
                        fill="black"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19 18C19 18.5304 18.7893 19.0391 18.4142 19.4142C18.0391 19.7893 17.5304 20 17 20H15.5V22L14 21.25L12.5 22V20H7C6.46957 20 5.96086 19.7893 5.58579 19.4142C5.21071 19.0391 5 18.5304 5 18V4C5 3.46957 5.21071 2.96086 5.58579 2.58579C5.96086 2.21071 6.46957 2 7 2H17C17.5304 2 18.0391 2.21071 18.4142 2.58579C18.7893 2.96086 19 3.46957 19 4V18ZM7 3C6.73478 3 6.48043 3.10536 6.29289 3.29289C6.10536 3.48043 6 3.73478 6 4V18C6 18.2652 6.10536 18.5196 6.29289 18.7071C6.48043 18.8946 6.73478 19 7 19H12.5V17.823C12.2454 17.5343 12.0795 17.1783 12.0223 16.7977C11.965 16.4171 12.0188 16.0281 12.1771 15.6772C12.3355 15.3264 12.5917 15.0288 12.915 14.82C13.2384 14.6112 13.6151 14.5001 14 14.5001C14.3849 14.5001 14.7616 14.6112 15.085 14.82C15.4083 15.0288 15.6645 15.3264 15.8229 15.6772C15.9812 16.0281 16.035 16.4171 15.9777 16.7977C15.9205 17.1783 15.7546 17.5343 15.5 17.823V19H17C17.2652 19 17.5196 18.8946 17.7071 18.7071C17.8946 18.5196 18 18.2652 18 18V4C18 3.73478 17.8946 3.48043 17.7071 3.29289C17.5196 3.10536 17.2652 3 17 3H7ZM14.5 18.437C14.172 18.5215 13.828 18.5215 13.5 18.437V20.382L14 20.132L14.5 20.382V18.437ZM14 17.5C14.2652 17.5 14.5196 17.3946 14.7071 17.2071C14.8946 17.0196 15 16.7652 15 16.5C15 16.2348 14.8946 15.9804 14.7071 15.7929C14.5196 15.6054 14.2652 15.5 14 15.5C13.7348 15.5 13.4804 15.6054 13.2929 15.7929C13.1054 15.9804 13 16.2348 13 16.5C13 16.7652 13.1054 17.0196 13.2929 17.2071C13.4804 17.3946 13.7348 17.5 14 17.5Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <span className=" text-[#3E404B] font-semibold text-xs">
                    View certificate
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="py-4 min-w-[200px]">
                {attendeeCertificates.map((certificate) => (
                  <DropdownMenuItem key={certificate.id}>
                    <Link href={`/verify/${certificate.certificateId}`}>
                      {certificate.CertificateName}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
      </section>
      <section className="space-y-4 border-t-[1px] border-gray-200 pt-2">
        <h3 className="px-2 pb-2 border-b-[1px] border-gray-200 text-lg text-greyBlack font-semibold">
          About
        </h3>
        <div className="space-y-4 px-2">
          <div className="">
            <p className="text-gray-700 text-sm font-normal">{bio}</p>
          </div>
          {city && country && (
            <div className="flex items-center gap-2">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 24 24"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke="#000"
                  strokeWidth={2}
                  d="M12,22 C12,22 4,16 4,10 C4,5 8,2 12,2 C16,2 20,5 20,10 C20,16 12,22 12,22 Z M12,13 C13.657,13 15,11.657 15,10 C15,8.343 13.657,7 12,7 C10.343,7 9,8.343 9,10 C9,11.657 10.343,13 12,13 L12,13 Z"
                />
              </svg>
              <span className=" text-gray-700 text-sm">
                {city + ", " + country}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <h4 className="text-gray-800 font-medium">Social Media</h4>
            <div className="flex gap-4 items-center">
              {x && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_11643_35950)">
                    <path
                      d="M12.8025 11.5903L18.2033 19.3155H15.9868L11.5796 13.0118V13.0114L10.9325 12.086L5.78418 4.72168H8.00071L12.1554 10.665L12.8025 11.5903Z"
                      fill="#15161B"
                    />
                    <path
                      d="M21.4067 0H2.59325C1.16108 0 0 1.16108 0 2.59325V21.4067C0 22.8389 1.16108 24 2.59325 24H21.4067C22.8389 24 24 22.8389 24 21.4067V2.59325C24 1.16108 22.8389 0 21.4067 0ZM15.308 20.3525L10.8481 13.8617L5.26435 20.3525H3.82122L10.2073 12.9295L3.82122 3.63521H8.69203L12.9152 9.78152L18.2026 3.63521H19.6458L13.5562 10.7139H13.5558L20.1788 20.3525H15.308Z"
                      fill="#15161B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_11643_35950">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}
              {linkedin && (
                <a href={linkedin}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_11643_35953)">
                      <path
                        d="M0.946777 1.719C0.946777 0.7695 1.73578 0 2.70928 0H23.1843C24.1578 0 24.9468 0.7695 24.9468 1.719V22.281C24.9468 23.2305 24.1578 24 23.1843 24H2.70928C1.73578 24 0.946777 23.2305 0.946777 22.281V1.719ZM8.36128 20.091V9.2535H4.75978V20.091H8.36128ZM6.56128 7.773C7.81678 7.773 8.59828 6.942 8.59828 5.901C8.57578 4.8375 7.81828 4.029 6.58528 4.029C5.35228 4.029 4.54678 4.839 4.54678 5.901C4.54678 6.942 5.32828 7.773 6.53728 7.773H6.56128ZM13.9233 20.091V14.0385C13.9233 13.7145 13.9473 13.3905 14.0433 13.1595C14.3028 12.513 14.8953 11.8425 15.8913 11.8425C17.1948 11.8425 17.7153 12.8355 17.7153 14.2935V20.091H21.3168V13.875C21.3168 10.545 19.5408 8.997 17.1708 8.997C15.2598 8.997 14.4033 10.047 13.9233 10.7865V10.824H13.8993C13.9072 10.8115 13.9152 10.799 13.9233 10.7865V9.2535H10.3233C10.3683 10.2705 10.3233 20.091 10.3233 20.091H13.9233Z"
                        fill="#15161B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_11643_35953">
                        <rect
                          width="24"
                          height="24"
                          fill="white"
                          transform="translate(0.946777)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              )}
              {facebook && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="24"
                  viewBox="0 0 22 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_11643_35955)">
                    <path
                      d="M18.8933 1.91992H3.05331C2.48044 1.91992 1.93104 2.14749 1.52596 2.55257C1.12088 2.95765 0.893311 3.50705 0.893311 4.07992L0.893311 19.9199C0.893311 20.4928 1.12088 21.0422 1.52596 21.4473C1.93104 21.8523 2.48044 22.0799 3.05331 22.0799H9.22956V15.226H6.39456V11.9999H9.22956V9.54112C9.22956 6.74437 10.8946 5.19952 13.4447 5.19952C14.666 5.19952 15.9431 5.41732 15.9431 5.41732V8.16232H14.536C13.1495 8.16232 12.7171 9.02272 12.7171 9.90517V11.9999H15.8122L15.3172 15.226H12.7171V22.0799H18.8933C19.4662 22.0799 20.0156 21.8523 20.4207 21.4473C20.8257 21.0422 21.0533 20.4928 21.0533 19.9199V4.07992C21.0533 3.50705 20.8257 2.95765 20.4207 2.55257C20.0156 2.14749 19.4662 1.91992 18.8933 1.91992Z"
                      fill="#15161B"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_11643_35955">
                      <rect
                        width="20.16"
                        height="24"
                        fill="white"
                        transform="translate(0.893311)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              )}
              {instagram && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                >
                  <path
                    d="M13.9999 10.355C11.9929 10.355 10.355 11.9929 10.355 13.9999C10.355 16.007 11.9929 17.6449 13.9999 17.6449C16.0069 17.6449 17.6448 16.007 17.6448 13.9999C17.6448 11.9929 16.0069 10.355 13.9999 10.355ZM24.9319 13.9999C24.9319 12.4906 24.9456 10.9949 24.8608 9.48821C24.7761 7.73821 24.3769 6.18509 23.0972 4.9054C21.8147 3.62298 20.2644 3.2265 18.5143 3.14173C17.005 3.05697 15.5093 3.07064 14.0026 3.07064C12.4933 3.07064 10.9975 3.05697 9.49091 3.14173C7.7409 3.2265 6.18778 3.62572 4.90809 4.9054C3.62567 6.18782 3.22918 7.73821 3.14442 9.48821C3.05965 10.9976 3.07332 12.4933 3.07332 13.9999C3.07332 15.5066 3.05965 17.005 3.14442 18.5116C3.22918 20.2616 3.6284 21.8148 4.90809 23.0945C6.19051 24.3769 7.7409 24.7734 9.49091 24.8581C11.0003 24.9429 12.496 24.9292 14.0026 24.9292C15.512 24.9292 17.0077 24.9429 18.5143 24.8581C20.2644 24.7734 21.8175 24.3741 23.0972 23.0945C24.3796 21.812 24.7761 20.2616 24.8608 18.5116C24.9483 17.005 24.9319 15.5093 24.9319 13.9999ZM13.9999 19.6081C10.8964 19.6081 8.39169 17.1034 8.39169 13.9999C8.39169 10.8964 10.8964 8.39173 13.9999 8.39173C17.1034 8.39173 19.6081 10.8964 19.6081 13.9999C19.6081 17.1034 17.1034 19.6081 13.9999 19.6081ZM19.8378 9.47181C19.1132 9.47181 18.528 8.88665 18.528 8.16204C18.528 7.43743 19.1132 6.85228 19.8378 6.85228C20.5624 6.85228 21.1476 7.43743 21.1476 8.16204C21.1478 8.3341 21.114 8.50452 21.0483 8.66352C20.9825 8.82253 20.8861 8.967 20.7644 9.08867C20.6427 9.21033 20.4983 9.3068 20.3393 9.37255C20.1803 9.43829 20.0099 9.47202 19.8378 9.47181Z"
                    fill="#15161B"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="border-t-[1px] border-gray-200 pt-2 space-y-4">
        <div className="flex justify-between items-center border-b-[1px] border-gray-200 pb-2 px-2">
          <h4 className="text-lg font-medium text-greyBlack ">Tags</h4>
          <Dialog>
            <DialogTrigger>
              <button className="flex gap-1">
                <span className="text-sm text-[#15161B] font-medium">Tag</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M8.78345 10.8332V13.3332C8.78345 13.5693 8.86345 13.7673 9.02345 13.9273C9.18345 14.0873 9.38122 14.1671 9.61678 14.1665C9.85289 14.1665 10.0509 14.0865 10.2109 13.9265C10.3709 13.7665 10.4507 13.5687 10.4501 13.3332V10.8332H12.9501C13.1862 10.8332 13.3843 10.7532 13.5443 10.5932C13.7043 10.4332 13.784 10.2354 13.7834 9.99984C13.7834 9.76373 13.7034 9.56567 13.5434 9.40567C13.3834 9.24567 13.1857 9.16595 12.9501 9.1665H10.4501V6.6665C10.4501 6.43039 10.3701 6.23234 10.2101 6.07234C10.0501 5.91234 9.85234 5.83261 9.61678 5.83317C9.38067 5.83317 9.18261 5.91317 9.02261 6.07317C8.86261 6.23317 8.78289 6.43095 8.78345 6.6665V9.1665H6.28345C6.04734 9.1665 5.84928 9.2465 5.68928 9.4065C5.52928 9.5665 5.44956 9.76428 5.45011 9.99984C5.45011 10.2359 5.53011 10.434 5.69011 10.594C5.85011 10.754 6.04789 10.8337 6.28345 10.8332H8.78345ZM9.61678 18.3332C8.464 18.3332 7.38067 18.1143 6.36678 17.6765C5.35289 17.2387 4.47095 16.6451 3.72095 15.8957C2.97095 15.1457 2.37734 14.2637 1.94011 13.2498C1.50289 12.2359 1.284 11.1526 1.28345 9.99984C1.28345 8.84706 1.50234 7.76373 1.94011 6.74984C2.37789 5.73595 2.9715 4.854 3.72095 4.104C4.47095 3.354 5.35289 2.76039 6.36678 2.32317C7.38067 1.88595 8.464 1.66706 9.61678 1.6665C10.7696 1.6665 11.8529 1.88539 12.8668 2.32317C13.8807 2.76095 14.7626 3.35456 15.5126 4.104C16.2626 4.854 16.8565 5.73595 17.2943 6.74984C17.7321 7.76373 17.9507 8.84706 17.9501 9.99984C17.9501 11.1526 17.7312 12.2359 17.2934 13.2498C16.8557 14.2637 16.2621 15.1457 15.5126 15.8957C14.7626 16.6457 13.8807 17.2396 12.8668 17.6773C11.8529 18.1151 10.7696 18.3337 9.61678 18.3332ZM9.61678 16.6665C11.4779 16.6665 13.0543 16.0207 14.3459 14.729C15.6376 13.4373 16.2834 11.8609 16.2834 9.99984C16.2834 8.13873 15.6376 6.56234 14.3459 5.27067C13.0543 3.979 11.4779 3.33317 9.61678 3.33317C7.75567 3.33317 6.17928 3.979 4.88761 5.27067C3.59595 6.56234 2.95011 8.13873 2.95011 9.99984C2.95011 11.8609 3.59595 13.4373 4.88761 14.729C6.17928 16.0207 7.75567 16.6665 9.61678 16.6665Z"
                    fill="#15161B"
                  />
                </svg>
              </button>
            </DialogTrigger>
            <DialogContent className="px-3">
              <DialogHeader>
                <DialogTitle>
                  <span className="capitalize">Add Tags</span>
                </DialogTitle>
              </DialogHeader>
              <AddAttendeeTagForm
                attendeeEmail={attendee?.email}
                attendeeId={attendee?.id}
                getAttendeeTags={getAttendeeTags}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex gap-2 flex-wrap px-2 py-2">
          {!attendeeTagsisLoading ? (
            <>
              {attendeeTags?.attendeeTags &&
              attendeeTags?.attendeeTags?.length > 0 ? (
                <>
                  {attendeeTags?.attendeeTags.map((tag) => (
                    <div
                      className="relative text-sm flex items-center gap-1.5 p-2 rounded w-fit font-medium"
                      style={{
                        backgroundColor: tag.color + "33",
                        color: tag.color,
                      }}
                    >
                      <button
                        onClick={() => removeAttendeeTag(tag)}
                        style={{
                          backgroundColor: tag.color + "55",
                          color: tag.color,
                        }}
                        className="bg-white h-4 w-4 flex items-center justify-center text-[8px] absolute -right-2 -top-2 rounded-full"
                      >
                        x
                      </button>
                      <span>{tag.label}</span>
                    </div>
                  ))}
                </>
              ) : (
                <p className="px-2 text-sm font-medium text-gray-500">
                  No tags for this attendee
                </p>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </section>
      {!eventAgendasIsLoading && attendeeSpeakingAt.length > 0 && (
        <section className="pt-2 border-t-[1px] border-gray-200 space-y-4">
          <h4 className="px-2 text-lg text-greyBlack font-medium border-b-[1px] border-gray-200 pb-2 ">
            Speaking at
          </h4>
          <div className="space-y-2 mx-2 p-2 rounded divide-y-[1px]">
            {!eventAgendasIsLoading ? (
              attendeeSpeakingAt.length > 0 ? (
                attendeeSpeakingAt?.map(
                  ({ sessionTitle, startDateTime, endDateTime }) => (
                    <div className="flex justify-between gap-2 items-center">
                      <div className="flex-[75%] flex gap-1 items-center">
                        <span className="text-sm font-medium text-greyBlack">
                          {sessionTitle}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M13.3333 7.33333C13.1565 7.33333 12.987 7.40357 12.8619 7.5286C12.7369 7.65362 12.6667 7.82319 12.6667 8V12C12.6667 12.1768 12.5964 12.3464 12.4714 12.4714C12.3464 12.5964 12.1768 12.6667 12 12.6667H4C3.82319 12.6667 3.65362 12.5964 3.5286 12.4714C3.40357 12.3464 3.33333 12.1768 3.33333 12V4C3.33333 3.82319 3.40357 3.65362 3.5286 3.5286C3.65362 3.40357 3.82319 3.33333 4 3.33333H8C8.17681 3.33333 8.34638 3.2631 8.4714 3.13807C8.59643 3.01305 8.66667 2.84348 8.66667 2.66667C8.66667 2.48986 8.59643 2.32029 8.4714 2.19526C8.34638 2.07024 8.17681 2 8 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V12C2 12.5304 2.21071 13.0391 2.58579 13.4142C2.96086 13.7893 3.46957 14 4 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V8C14 7.82319 13.9298 7.65362 13.8047 7.5286C13.6797 7.40357 13.5101 7.33333 13.3333 7.33333Z"
                            fill="black"
                          />
                          <path
                            d="M10.6668 3.33333H11.7201L7.52679 7.52C7.4643 7.58198 7.41471 7.65571 7.38086 7.73695C7.34702 7.81819 7.32959 7.90533 7.32959 7.99333C7.32959 8.08134 7.34702 8.16848 7.38086 8.24972C7.41471 8.33096 7.4643 8.40469 7.52679 8.46667C7.58876 8.52915 7.6625 8.57875 7.74374 8.61259C7.82498 8.64644 7.91211 8.66387 8.00012 8.66387C8.08813 8.66387 8.17527 8.64644 8.25651 8.61259C8.33775 8.57875 8.41148 8.52915 8.47346 8.46667L12.6668 4.28V5.33333C12.6668 5.51014 12.737 5.67971 12.8621 5.80474C12.9871 5.92976 13.1566 6 13.3335 6C13.5103 6 13.6798 5.92976 13.8049 5.80474C13.9299 5.67971 14.0001 5.51014 14.0001 5.33333V2.66667C14.0001 2.48986 13.9299 2.32029 13.8049 2.19526C13.6798 2.07024 13.5103 2 13.3335 2H10.6668C10.49 2 10.3204 2.07024 10.1954 2.19526C10.0704 2.32029 10.0001 2.48986 10.0001 2.66667C10.0001 2.84348 10.0704 3.01305 10.1954 3.13807C10.3204 3.2631 10.49 3.33333 10.6668 3.33333Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                      <div className="flex-[25%] flex flex-col text-xs text-right">
                        <span className="text-gray-500 font-medium">
                          {format(startDateTime, "PPP")}
                        </span>
                        <span className="text-gray-500 font-normal">
                          {format(startDateTime, "HH:mm")} -{" "}
                          {format(endDateTime, "HH:mm")}
                        </span>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="px-2 text-sm font-medium text-gray-700">
                  Attendee not speaking at any sessions
                </p>
              )
            ) : (
              <p className="px-2 text-sm font-medium text-gray-700">
                Loading...
              </p>
            )}
          </div>
        </section>
      )}
      <section className="border-t-[1px] border-gray-200 space-y-4 pt-2">
        <div className="flex justify-between items-center border-b-[1px] border-gray-200 pb-2 px-2">
          <h4 className="text-lg font-medium text-greyBlack">Note</h4>
          <Dialog>
            <DialogTrigger>
              <button className="flex gap-1">
                <span className=" text-sm text-[#15161B] font-medium">
                  Note
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M8.78345 10.8332V13.3332C8.78345 13.5693 8.86345 13.7673 9.02345 13.9273C9.18345 14.0873 9.38122 14.1671 9.61678 14.1665C9.85289 14.1665 10.0509 14.0865 10.2109 13.9265C10.3709 13.7665 10.4507 13.5687 10.4501 13.3332V10.8332H12.9501C13.1862 10.8332 13.3843 10.7532 13.5443 10.5932C13.7043 10.4332 13.784 10.2354 13.7834 9.99984C13.7834 9.76373 13.7034 9.56567 13.5434 9.40567C13.3834 9.24567 13.1857 9.16595 12.9501 9.1665H10.4501V6.6665C10.4501 6.43039 10.3701 6.23234 10.2101 6.07234C10.0501 5.91234 9.85234 5.83261 9.61678 5.83317C9.38067 5.83317 9.18261 5.91317 9.02261 6.07317C8.86261 6.23317 8.78289 6.43095 8.78345 6.6665V9.1665H6.28345C6.04734 9.1665 5.84928 9.2465 5.68928 9.4065C5.52928 9.5665 5.44956 9.76428 5.45011 9.99984C5.45011 10.2359 5.53011 10.434 5.69011 10.594C5.85011 10.754 6.04789 10.8337 6.28345 10.8332H8.78345ZM9.61678 18.3332C8.464 18.3332 7.38067 18.1143 6.36678 17.6765C5.35289 17.2387 4.47095 16.6451 3.72095 15.8957C2.97095 15.1457 2.37734 14.2637 1.94011 13.2498C1.50289 12.2359 1.284 11.1526 1.28345 9.99984C1.28345 8.84706 1.50234 7.76373 1.94011 6.74984C2.37789 5.73595 2.9715 4.854 3.72095 4.104C4.47095 3.354 5.35289 2.76039 6.36678 2.32317C7.38067 1.88595 8.464 1.66706 9.61678 1.6665C10.7696 1.6665 11.8529 1.88539 12.8668 2.32317C13.8807 2.76095 14.7626 3.35456 15.5126 4.104C16.2626 4.854 16.8565 5.73595 17.2943 6.74984C17.7321 7.76373 17.9507 8.84706 17.9501 9.99984C17.9501 11.1526 17.7312 12.2359 17.2934 13.2498C16.8557 14.2637 16.2621 15.1457 15.5126 15.8957C14.7626 16.6457 13.8807 17.2396 12.8668 17.6773C11.8529 18.1151 10.7696 18.3337 9.61678 18.3332ZM9.61678 16.6665C11.4779 16.6665 13.0543 16.0207 14.3459 14.729C15.6376 13.4373 16.2834 11.8609 16.2834 9.99984C16.2834 8.13873 15.6376 6.56234 14.3459 5.27067C13.0543 3.979 11.4779 3.33317 9.61678 3.33317C7.75567 3.33317 6.17928 3.979 4.88761 5.27067C3.59595 6.56234 2.95011 8.13873 2.95011 9.99984C2.95011 11.8609 3.59595 13.4373 4.88761 14.729C6.17928 16.0207 7.75567 16.6665 9.61678 16.6665Z"
                    fill="#15161B"
                  />
                </svg>
              </button>
            </DialogTrigger>
            <DialogContent className="px-3">
              <DialogHeader>
                <DialogTitle>
                  <span className="capitalize">Add Note</span>
                </DialogTitle>
              </DialogHeader>
              <AddNotesForm
                attendeeEmail={attendee?.email}
                attendeeId={attendee?.id}
                note={note}
                getnote={getnote}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="px-2 space-y-2">
          {!noteIsLoading ? (
            <>
              {note ? (
                <p className="text-sm font-normal text-[#15161B] leading-normal border-[1px] border-[#EBEBEB] rounded-lg py-4 px-2">
                  {note.notes}
                </p>
              ) : (
                <p className="px-2 text-sm font-medium text-gray-500">
                  No note for this attendee
                </p>
              )}
            </>
          ) : (
            <p className="px-2 text-sm font-medium text-gray-700">Loading...</p>
          )}
        </div>
      </section>
      {!eventAgendasIsLoading && attendeeModeratingAt.length > 0 && (
        <section className="border-t-[1px] border-gray-200 pt-2 space-y-4">
          <h4 className=" text-lg text-greyBlack font-medium border-b-[1px] border-gray-200 pb-2 px-2">
            Moderating at
          </h4>
          <div className="p-2  rounded mx-2">
            {!eventAgendasIsLoading ? (
              attendeeModeratingAt.length > 0 ? (
                attendeeModeratingAt?.map(
                  ({ sessionTitle, startDateTime, endDateTime }) => (
                    <div className="flex justify-between gap-2 items-center">
                      <div className="flex-[75%] flex gap-1 items-center">
                        <span className="text-sm font-medium text-greyBlack">
                          {sessionTitle}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M13.3333 7.33333C13.1565 7.33333 12.987 7.40357 12.8619 7.5286C12.7369 7.65362 12.6667 7.82319 12.6667 8V12C12.6667 12.1768 12.5964 12.3464 12.4714 12.4714C12.3464 12.5964 12.1768 12.6667 12 12.6667H4C3.82319 12.6667 3.65362 12.5964 3.5286 12.4714C3.40357 12.3464 3.33333 12.1768 3.33333 12V4C3.33333 3.82319 3.40357 3.65362 3.5286 3.5286C3.65362 3.40357 3.82319 3.33333 4 3.33333H8C8.17681 3.33333 8.34638 3.2631 8.4714 3.13807C8.59643 3.01305 8.66667 2.84348 8.66667 2.66667C8.66667 2.48986 8.59643 2.32029 8.4714 2.19526C8.34638 2.07024 8.17681 2 8 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V12C2 12.5304 2.21071 13.0391 2.58579 13.4142C2.96086 13.7893 3.46957 14 4 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V8C14 7.82319 13.9298 7.65362 13.8047 7.5286C13.6797 7.40357 13.5101 7.33333 13.3333 7.33333Z"
                            fill="black"
                          />
                          <path
                            d="M10.6668 3.33333H11.7201L7.52679 7.52C7.4643 7.58198 7.41471 7.65571 7.38086 7.73695C7.34702 7.81819 7.32959 7.90533 7.32959 7.99333C7.32959 8.08134 7.34702 8.16848 7.38086 8.24972C7.41471 8.33096 7.4643 8.40469 7.52679 8.46667C7.58876 8.52915 7.6625 8.57875 7.74374 8.61259C7.82498 8.64644 7.91211 8.66387 8.00012 8.66387C8.08813 8.66387 8.17527 8.64644 8.25651 8.61259C8.33775 8.57875 8.41148 8.52915 8.47346 8.46667L12.6668 4.28V5.33333C12.6668 5.51014 12.737 5.67971 12.8621 5.80474C12.9871 5.92976 13.1566 6 13.3335 6C13.5103 6 13.6798 5.92976 13.8049 5.80474C13.9299 5.67971 14.0001 5.51014 14.0001 5.33333V2.66667C14.0001 2.48986 13.9299 2.32029 13.8049 2.19526C13.6798 2.07024 13.5103 2 13.3335 2H10.6668C10.49 2 10.3204 2.07024 10.1954 2.19526C10.0704 2.32029 10.0001 2.48986 10.0001 2.66667C10.0001 2.84348 10.0704 3.01305 10.1954 3.13807C10.3204 3.2631 10.49 3.33333 10.6668 3.33333Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                      <div className="flex-[25%] flex flex-col text-xs text-right">
                        <span className="text-gray-500 font-medium">
                          {format(startDateTime, "PPP")}
                        </span>
                        <span className="text-gray-500 font-normal">
                          {format(startDateTime, "HH:mm")} -{" "}
                          {format(endDateTime, "HH:mm")}
                        </span>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="px-2 text-sm font-medium text-gray-700">
                  Attendee not moderating at any sessions
                </p>
              )
            ) : (
              <p className="px-2 text-sm font-medium text-gray-700">
                Loading...
              </p>
            )}
          </div>
        </section>
      )}
      <AddAttendeeForm
        isOpen={attendeeFormIsOpen}
        onClose={onCloseAttendeeForm}
        attendee={attendee}
        refresh={getAttendees}
        action={async (payload: Partial<TAttendee>) => {
          await createAttendee({ payload });
          await getAttendees();
        }}
      />
    </div>
  );
}
