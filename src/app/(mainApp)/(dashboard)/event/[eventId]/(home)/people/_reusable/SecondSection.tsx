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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddNotesForm from "@/components/forms/AddNoteForm";
import AttendeeBadge from "@/components/AttendeeBadge";
import { usePDF } from "react-to-pdf";
import { Button } from "@/components/ui/button";
import {
  useGetAttendeeCertificates,
  useGetCertificates,
  useReleaseAttendeeCertificate,
  useUpdateAttendeeCertificates,
} from "@/hooks/services/certificate";
import { format, isPast } from "date-fns";
import { TCertificate } from "@/types/certificates";
import { useRouter } from "next/navigation";
import AddAttendeeForm from "@/components/forms/AddAttendeeForm";
import useDisclose from "@/hooks/common/useDisclose";
import {
  getCookie,
  useCreateAttendee,
  useGetAttendeeBadge,
  useGetBadges,
  useReleaseAttendeeBadge,
} from "@/hooks";
import { TAgenda } from "@/types";
import { useRequestContact } from "@/hooks/services/contacts";
import { ContactRequest } from "@/types/contacts";
import AttendeeCard from "@/components/people/AttendeeCard";
import AttendeeCredentials from "@/components/people/AttendeeCredentials";
import AttendeeAbout from "@/components/people/AttendeeAbout";
import AttendeeTagsSection from "@/components/people/AttendeeTagsSection";
import useUserStore from "@/store/globalUserStore";
import { saveContact } from "@/utils";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Copy } from "styled-icons/boxicons-regular";
import QRCode from "react-qr-code";

function AttendeeNotesSection(props) {
  return (
    <section className="border-t-[1px] border-gray-200 space-y-4 pt-2">
      <div className="flex justify-between items-center border-b-[1px] border-gray-200 pb-2 px-2">
        <h4 className="text-lg font-medium text-greyBlack">Note</h4>
        <Dialog>
          <DialogTrigger>
            <button className="flex gap-1">
              <span className=" text-sm text-[#15161B] font-medium">Note</span>
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
              attendeeEmail={props.attendee?.email}
              attendeeId={props.attendee?.id}
              note={props.note}
              getnote={props.getnote}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="px-2 space-y-2">
        {!props.noteIsLoading ? (
          <>
            {props.note ? (
              <p className="text-sm font-normal text-[#15161B] leading-normal border-[1px] border-[#EBEBEB] rounded-lg py-4 px-2">
                {props.note.notes}
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
  );
}

export default function SecondSection({
  attendee,
  getAttendees,
  event,
  eventAgendasIsLoading,
  eventAgendas,
  userContactRequests,
  contactRequestIsLoading,
  getContactRequests,
}: {
  attendee: TAttendee;
  getAttendees?: () => Promise<void>;
  event: Event;
  eventAgendasIsLoading: boolean;
  eventAgendas: TAgenda;
  userContactRequests: ContactRequest;
  contactRequestIsLoading: boolean;
  getContactRequests: () => Promise<void>;
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
    attendeeAlias,
    appointmentLink,
  } = attendee;

  console.log(attendeeAlias);
  const { user, setUser } = useUserStore();
  // const user = getCookie("user");

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

  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

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

  const {
    attendeeBadge,
    isLoading: attendeeBadgeIsLoading,
    getAttendeeBadge,
  } = useGetAttendeeBadge({
    eventId,
    attendeeId: id,
  });

  const {
    certificates: eventCertificates,
    isLoading: getEventCertificatesIsLoading,
  } = useGetCertificates({
    eventId,
  });

  const { updateAttendeeCertificates } = useUpdateAttendeeCertificates({
    eventId: event.eventAlias,
  });

  const { releaseAttendeeCertificate, isLoading } =
    useReleaseAttendeeCertificate();

  const { releaseAttendeeBadge, isLoading: releasingAttendeeBadge } =
    useReleaseAttendeeBadge();

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
    // await updateAttendeeCertificates({
    //   payload: {
    //     action: "release",
    //     attendeeInfo: [
    //       {
    //         attendeeId: id,
    //         attendeeEmail: email,
    //       },
    //     ],
    //     certificateInfo: {
    //       eventAlias: eventCertificate.eventId,
    //       CertificateGroupId: eventCertificate.id,
    //       CertificateName: eventCertificate.certificateName,
    //     },
    //   },
    // });
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

    await getAttendeeCertificates();

    // if (newAttendeeCertificate) {
    //   router.push(`/verify/${newAttendeeCertificate.certificateId}`);
    // }
  };

  const releaseBadge = async (eventBadge: TBadge) => {
    // await updateAttendeeBadges({
    //   payload: {
    //     action: "release",
    //     attendeeInfo: [
    //       {
    //         attendeeId: id,
    //         attendeeEmail: email,
    //       },
    //     ],
    //     badgeInfo: {
    //       eventAlias: eventBadge.eventId,
    //       BadgeGroupId: eventBadge.id,
    //       BadgeName: eventBadge.badgeName,
    //     },
    //   },
    // });
    // await getAttendeeBadges();
    // await getEventBadges();

    const newAttendeeBadge = await releaseAttendeeBadge({
      payload: {
        eventAlias: eventBadge.eventAlias,
        attendeeId: id,
        badgeGroupId: eventBadge.id,
        attendeeEmail: email,
        badgeName: eventBadge.badgeName,
      },
    });

    await getAttendeeBadge();

    if (newAttendeeBadge) {
      router.push(`/verify/badges/${newAttendeeBadge.badgeId}`);
    }
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

  const [open, setOpen] = useState<boolean>(false);

  const clsBtnRef = useRef<HTMLButtonElement>(null);

  const { requestContact, isLoading: requestingContact } = useRequestContact();

  const isEventOwner = user && String(event?.createdBy) === String(user.id);
  const attendeeIsUser = user.userEmail === email;

  const attendeeExchangedContacts = userContactRequests.find(
    ({ senderUserEmail, receiverUserEmail }) =>
      senderUserEmail === email || receiverUserEmail === email
  );

  console.log(
    user.userEmail,
    email,
    attendeeExchangedContacts,
    userContactRequests
  );

  return (
    <div className="h-fit space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {" "}
          <DialogHeader>
            <DialogTitle>
              <span className="capitalize">
                Request Contact Information of {firstName + " " + lastName}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 items-center py-4">
              <svg
                width={57}
                height={50}
                viewBox="0 0 57 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M55.6998 41.0225L33.8373 3.05501C33.2909 2.12482 32.511 1.35356 31.5748 0.817663C30.6385 0.281767 29.5785 -0.000152588 28.4998 -0.000152588C27.421 -0.000152588 26.361 0.281767 25.4247 0.817663C24.4885 1.35356 23.7086 2.12482 23.1623 3.05501L1.29975 41.0225C0.774092 41.9222 0.49707 42.9455 0.49707 43.9875C0.49707 45.0295 0.774092 46.0528 1.29975 46.9525C1.83908 47.8883 2.61768 48.6638 3.55566 49.1993C4.49363 49.7349 5.55721 50.0112 6.63725 50H50.3623C51.4414 50.0103 52.504 49.7336 53.441 49.1981C54.378 48.6626 55.1558 47.8876 55.6948 46.9525C56.2212 46.0532 56.4991 45.0302 56.4999 43.9882C56.5008 42.9462 56.2247 41.9227 55.6998 41.0225ZM52.2323 44.95C52.0417 45.2751 51.768 45.5437 51.4394 45.7282C51.1108 45.9127 50.7391 46.0065 50.3623 46H6.63725C6.26044 46.0065 5.88868 45.9127 5.56008 45.7282C5.23147 45.5437 4.95784 45.2751 4.76725 44.95C4.59461 44.6577 4.50355 44.3245 4.50355 43.985C4.50355 43.6455 4.59461 43.3123 4.76725 43.02L26.6298 5.05251C26.8242 4.72894 27.0991 4.4612 27.4276 4.27532C27.7562 4.08944 28.1273 3.99175 28.5048 3.99175C28.8822 3.99175 29.2533 4.08944 29.5819 4.27532C29.9104 4.4612 30.1853 4.72894 30.3798 5.05251L52.2423 43.02C52.4134 43.3132 52.5027 43.6469 52.501 43.9864C52.4992 44.3258 52.4064 44.6586 52.2323 44.95ZM26.4998 30V20C26.4998 19.4696 26.7105 18.9609 27.0855 18.5858C27.4606 18.2107 27.9693 18 28.4998 18C29.0302 18 29.5389 18.2107 29.914 18.5858C30.289 18.9609 30.4998 19.4696 30.4998 20V30C30.4998 30.5304 30.289 31.0392 29.914 31.4142C29.5389 31.7893 29.0302 32 28.4998 32C27.9693 32 27.4606 31.7893 27.0855 31.4142C26.7105 31.0392 26.4998 30.5304 26.4998 30ZM31.4998 39C31.4998 39.5934 31.3238 40.1734 30.9942 40.6667C30.6645 41.1601 30.196 41.5446 29.6478 41.7716C29.0996 41.9987 28.4964 42.0581 27.9145 41.9424C27.3325 41.8266 26.798 41.5409 26.3784 41.1213C25.9589 40.7018 25.6732 40.1672 25.5574 39.5853C25.4416 39.0033 25.5011 38.4001 25.7281 37.852C25.9552 37.3038 26.3397 36.8352 26.833 36.5056C27.3264 36.176 27.9064 36 28.4998 36C29.2954 36 30.0585 36.3161 30.6211 36.8787C31.1837 37.4413 31.4998 38.2044 31.4998 39Z"
                  fill="#001FCC"
                />
              </svg>
              <div className="text-gray-800 font-medium flex flex-col gap-2 text-center">
                <span>
                  Are you sure you want to exchange the contact information of{" "}
                  {firstName + " " + lastName} (your contact information would
                  be shared with them as well)?
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  clsBtnRef.current?.click();
                }}
                className="border-2 bg-white border-basePrimary text-basePrimary w-full"
              >
                Cancel
              </Button>
              <Button
                onClick={async (e) => {
                  e.stopPropagation();
                  clsBtnRef.current?.click();
                  await requestContact({
                    payload: {
                      senderUserEmail: user.userEmail,
                      receiverUserEmail: email,
                    },
                  });
                }}
                className="bg-basePrimary w-full"
              >
                Request
              </Button>
            </div>
          </div>
          <DialogClose asChild>
            <button className="hidden" ref={clsBtnRef}>
              close
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <AttendeeCard
        firstName={firstName}
        lastName={lastName}
        email={email}
        jobTitle={jobTitle}
        organization={organization}
        phoneNumber={phoneNumber}
        whatsappNumber={whatsappNumber}
        x={x}
        linkedin={linkedin}
        instagram={instagram}
        facebook={facebook}
        profilePicture={profilePicture}
        websiteUrl={websiteUrl}
        sendMail={sendMail}
        parentCardRef={parentCardRef}
        innerCardRef={innerCardRef}
        cardIsFlipped={cardIsFlipped}
        flipCard={flipCard}
        onOpenattendeeForm={onOpenattendeeForm}
        setOpen={setOpen}
        isEventOwner={isEventOwner}
        attendeeIsUser={attendeeIsUser}
        attendeeExchangedContacts={attendeeExchangedContacts}
        sendWhatsAppMessage={sendWhatsAppMessage}
      />
      <section className="space-y-6 p-4 pt-0">
        <div className="space-y-2">
          {/* {attendeeAlias && attendeeIsUser && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">
                Attendee Code: {attendeeAlias}
              </span>
              <span className="bg-white h-full flex items-center px-2">
                {hasCopiedText ? (
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    height="1.25em"
                    width="1.25em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.394 13.742L7.137 17.362 14.753 8.658 13.247 7.342 6.863 14.638 3.606 12.152zM21.753 8.658L20.247 7.342 13.878 14.621 13.125 14.019 11.875 15.581 14.122 17.379z" />
                  </svg>
                ) : (
                  <button onClick={() => copyToClipboard(attendeeAlias)}>
                    <Copy className="w-5 h-5 text-gray-700" />
                  </button>
                )}
              </span>
            </div>
          )} */}
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
        </div>
        <div className="flex gap-4 justify-evenly">
          {phoneNumber && (
            <button
              onClick={() =>
                saveContact({
                  name: `${firstName} ${lastName}`,
                  phone: phoneNumber,
                  email,
                })
              }
              className="flex-1 flex flex-col gap-2 items-center justify-center"
            >
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
            </button>
          )}
          {appointmentLink && !attendeeIsUser ? (
            <a target="_blank" rel="noopener noreferrer" href={appointmentLink}>
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
            </a>
          ) : (
            <div className="flex-1"></div>
          )}
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
          {attendeeAlias && attendeeIsUser && (
            <div className="flex flex-1 flex-col gap-2 p-4 border items-center justify-center">
              <div
                style={{
                  height: "auto",
                  margin: "0 auto",
                  maxWidth: 64,
                  width: "100%",
                }}
              >
                <QRCode
                  size={256}
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                  }}
                  value={`www.zikoro.com/event/${event.eventAlias}/people/info/${attendeeAlias}`}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <span className="text-gray-700 font-medium text-xs text-center">
                Scan to share
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-medium text-gray-700">
                  {attendeeAlias}
                </span>
                <span className="bg-white h-full flex items-center px-2">
                  {hasCopiedText ? (
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 24 24"
                      height="1.25em"
                      width="1.25em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.394 13.742L7.137 17.362 14.753 8.658 13.247 7.342 6.863 14.638 3.606 12.152zM21.753 8.658L20.247 7.342 13.878 14.621 13.125 14.019 11.875 15.581 14.122 17.379z" />
                    </svg>
                  ) : (
                    <button onClick={() => copyToClipboard(attendeeAlias)}>
                      <Copy className="w-5 h-5 text-gray-700" />
                    </button>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* {user &&
        (String(event?.createdBy) === String(user.id) ||
          email === user.userEmail) && (
          <AttendeeCredentials
            event={event}
            id={id}
            user={user}
            attendeeCertificates={attendeeCertificates}
            attendeeCertificatesIsLoading={attendeeCertificatesIsLoading}
            getAttendeeCertificates={getAttendeeCertificates}
          />
        )} */}
      {/* <section className="flex justify-between items-center px-2">
        {!badgeIsLoading &&
          !attendeeBadge &&
          user &&
          (String(event?.createdBy) === String(user.id) ||
            email === user.userEmail) && (
            <DropdownMenu>
              <DropdownMenuTrigger disabled={releasingAttendeeBadge}>
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
                    Release badge
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="py-4 min-w-[200px]">
                {badges.map((badge) => (
                  <DropdownMenuItem key={badge.id}>
                    <button onClick={() => releaseBadge(badge)}>
                      {badge.badgeName}
                    </button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        {!badgeIsLoading &&
          attendeeBadge &&
          user &&
          (String(event?.createdBy) === String(user.id) ||
            email === user.userEmail) && (
            <Link href={`/verify/badge/${attendeeBadge.badgeId}`}>
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
            </Link>
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
                    <Link
                      href={`/verify/certificate/${certificate.certificateId}`}
                    >
                      {certificate.CertificateName}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
      </section> */}
      <AttendeeAbout
        city={city}
        country={country}
        bio={bio}
        x={x}
        linkedin={linkedin}
        instagram={instagram}
        facebook={facebook}
      />
      <AttendeeTagsSection
        attendee={attendee}
        attendeeTags={attendeeTags}
        attendeeTagsisLoading={attendeeTagsisLoading}
        getAttendeeTags={getAttendeeTags}
      />
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
      <AttendeeNotesSection
        attendee={attendee}
        note={note}
        noteIsLoading={noteIsLoading}
        getnote={getnote}
        removeAttendeeTag={removeAttendeeTag}
      />
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
