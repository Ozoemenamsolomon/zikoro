// @ts-nocheck
"use client";
import { useGetnote } from "@/hooks/services/notes";
import {
  useGetAttendeeTags,
  useUpdateAttendeeTags,
} from "@/hooks/services/tags";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useDisclose from "@/hooks/common/useDisclose";
import { useCreateAttendee } from "@/hooks";
import { useRequestContact } from "@/hooks/services/contacts";
import AttendeeCard from "@/components/people/AttendeeCard";
import AttendeeAbout from "@/components/people/AttendeeAbout";
import useUserStore from "@/store/globalUserStore";
import { ILead } from "@/types/leads";
import { cn } from "@/lib";
import ChangeLeadType from "@/components/modals/ChangeLeadType";
import AddLeadNoteForm from "@/components/forms/addLeadNoteForm";
import { useGetData } from "@/hooks/services/request";
import { saveContact } from "@/utils";

function LeadNotesSection(props) {
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
            <AddLeadNoteForm
              updateSelectedLead={props.updateSelectedLead}
              lead={props.lead}
              getLeads={props.getLeads}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="px-2 space-y-2">
        {!props.noteIsLoading ? (
          <>
            {props.lead.notes ? (
              <Dialog>
                <DialogTrigger asChild>
                  <p className="text-sm font-normal text-[#15161B] leading-normal border-[1px] border-[#EBEBEB] rounded-lg py-4 px-2 cursor-pointer">
                    {props.lead.notes.slice(0, 180) + "..."}
                  </p>
                </DialogTrigger>
                <DialogContent className="px-3 max-h-36 overflow-auto hide-scrollbar">
                  <DialogHeader>
                    <DialogTitle>
                      <span className="capitalize">Note</span>
                    </DialogTitle>
                  </DialogHeader>
                  {props.lead.notes}
                </DialogContent>
              </Dialog>
            ) : (
              <p className="px-2 text-sm font-medium text-gray-500">
                No note for this lead
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

function LeadTypeSection(props) {
  return (
    <section className="border-t-[1px] border-gray-200 space-y-4 pt-2">
      <div className="flex justify-between items-center border-b-[1px] border-gray-200 pb-2 px-2">
        <h4 className="text-lg font-medium text-greyBlack">Lead Type</h4>
        <Dialog>
          <DialogTrigger>
            <button className="flex gap-1">
              <span className=" text-sm text-[#15161B] font-medium">
                Lead Type
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
                <span className="capitalize">Lead Type</span>
              </DialogTitle>
            </DialogHeader>
            <ChangeLeadType
              leadId={props.lead.id}
              leadType={props.lead.leadType}
              getLeads={props.getLeads}
              updateSelectedLead={props.updateSelectedLead}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="px-2 space-y-2">
        <div
          className={cn(
            "py-2 px-4 font-medium text-sm rounded-sm w-fit border",
            props.lead.leadType === "hot"
              ? "bg-red-300 text-red-700 border-red-700"
              : props.lead.leadType === "warm"
              ? "bg-amber-300 text-amber-700 border-amber-700"
              : props.lead.leadType === "cold"
              ? "bg-blue-300 text-blue-700 border-blue-700"
              : "bg-gray-300 text-gray-700 border-gray-700"
          )}
        >
          {props.lead.leadType ?? "unknown"}
        </div>
      </div>
    </section>
  );
}

export default function SecondColumn({
  lead,
  getLeads,
  setSelectedLead,
}: {
  lead: ILead;
  getLeads?: () => Promise<void>;
  setSelectedLead: React.Dispatch<
    React.SetStateAction<ILead | null | undefined>
  >;
}) {
  const { isLoading, getData: getLead } = useGetData<Partial<ILead>>(
    `/leads/${lead.id}`
  );

  const updateSelectedLead = async () => {
    const newLead = await getLead();
    setSelectedLead(newLead);
  };

  const router = useRouter();
  const {
    userEmail,
    firstName,
    lastName,
    attendeeEmail,
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
  } = lead;

  const { user, setUser } = useUserStore();

  const {
    note,
    isLoading: noteIsLoading,
    error,
    getnote,
  } = useGetnote({ attendeeId: id, userId: user?.id });

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

  useEffect(() => {
    getnote();
  }, [lead]);

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
    const to = attendeeEmail;
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

  const parentCardRef = useRef<HTMLDivElement>(null);
  const innerCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parentCard = parentCardRef.current;
    const innerCard = innerCardRef.current;

    if (!parentCard || !innerCard) return;

    parentCard.style.height = `${innerCard.style.height}px`;
  }, [lead]);

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

  const { requestContact, isLoading: requestingContact } = useRequestContact({
    receiverAlias: attendeeAlias ?? 0,
  });

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
                      receiverUserEmail: attendeeEmail,
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
        email={attendeeEmail}
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
        isEventOwner={true}
        attendeeIsUser={true}
        attendeeExchangedContacts={true}
        sendWhatsAppMessage={sendWhatsAppMessage}
        hideEdit={true}
      />
      <section className="space-y-6 p-4 pt-0">
        <div className="flex gap-4 justify-evenly">
          {phoneNumber && (
            <button
              onClick={() =>
                saveContact({
                  name: `${firstName} ${lastName}`,
                  phone: phoneNumber,
                  email: attendeeEmail,
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
        </div>
      </section>
      <AttendeeAbout
        city={city}
        country={country}
        bio={bio}
        x={x}
        linkedin={linkedin}
        instagram={instagram}
        facebook={facebook}
      />
      <LeadTypeSection
        lead={lead}
        getLeads={getLeads}
        updateSelectedLead={updateSelectedLead}
      />
      <LeadNotesSection
        lead={lead}
        getLeads={getLeads}
        updateSelectedLead={updateSelectedLead}
      />
    </div>
  );
}
