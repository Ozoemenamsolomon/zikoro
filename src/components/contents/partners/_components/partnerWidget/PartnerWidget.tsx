"use client";

import { sendMail, phoneCall, whatsapp } from "@/utils";
import { ArrowIosDownward } from "styled-icons/evaicons-solid";
import { Phone } from "styled-icons/feather";
import { cn } from "@/lib";
import { Switch } from "@/components/ui/switch";
import { useState, useMemo, useEffect, ReactNode } from "react";
import { DropDownSelect } from "@/components/contents/_components";
import { Event, TPartner } from "@/types";
import { CloseOutline } from "styled-icons/evaicons-outline";
import {
  useUpdateHall,
  useUpdateBooth,
  useUpdatePartnerType,
  useUpdateSponsor,
  useUpdatePartners,
} from "@/hooks";
import { EmailIcon, WhatsappIcon } from "@/constants";
import { IoCheckmarkCircle, IoCloseCircleSharp } from "react-icons/io5";
import { Button } from "@/components";
import { MdClose } from "react-icons/md";
import { AddPartnerManually } from "@/components/partners/_components/modals/AddPartnerManually";
import { Loader2Icon } from "lucide-react";

function ConfirmationModal({
  titleElement,
  descriptionElement,
  buttonElement,
  close,
}: {
  titleElement: ReactNode;
  descriptionElement: ReactNode;
  buttonElement: ReactNode;
  close: () => void;
}) {
  return (
    <div className="w-full h-full inset-0 fixed bg-black/20 z-[100]">
      <div className="absolute inset-0 shadow gap-y-4 box-animation bg-white rounded-lg m-auto h-fit max-w-xl flex flex-col items-center justify-center py-4 px-4">
        <Button
          onClick={close}
          className="px-0 self-end w-11 rounded-full
         h-11 bg-gray-200"
        >
          <MdClose size={22} />
        </Button>
        <div>{titleElement}</div>
        <div>{descriptionElement}</div>
        <div className="mt-3">{buttonElement}</div>
      </div>
    </div>
  );
}
function ActionColumn({
  partner,
  refetch,
}: {
  refetch: () => Promise<any>;
  partner: TPartner;
}) {
  const [isApprove, setIsApprove] = useState(false);
  const [isDecline, setIsDecline] = useState(false);
  const { update } = useUpdatePartners();
  const [loading, setLoading] = useState(false);

  function onDecline() {
    setIsDecline((p) => !p);
  }
  function onApprove() {
    setIsApprove((p) => !p);
  }

  async function approve() {
    setLoading(true);
    await update({ ...partner, partnerStatus: "verified" });

    setLoading(false);
    refetch();
    onApprove();
  }
  async function decline() {
    setLoading(true);
    await update({ ...partner, partnerStatus: "pending" });
    setLoading(false);
    refetch();
    onDecline();
  }
  return (
    <div className="flex items-center gap-x-6">
      <Button
        onClick={() => setIsApprove((p) => !p)}
        className="w-fit h-fit  px-0"
      >
        <IoCheckmarkCircle size={22} className="text-basePrimary" />
      </Button>
      <Button
        onClick={() => setIsDecline((p) => !p)}
        className="w-fit h-fit px-0"
      >
        <IoCloseCircleSharp size={22} className="text-red-500" />
      </Button>

      {isApprove && (
        <ConfirmationModal
          buttonElement={
            <Button
              onClick={approve}
              className="gap-x-2 text-white bg-basePrimary w-[130px]"
            >
              {loading && <Loader2Icon size={20} />}
              <p>Approve</p>
            </Button>
          }
          descriptionElement={
            <p>
              You are about to <b>approve</b> this partner, please confirm
            </p>
          }
          titleElement={
            <p className="font-semibold text-basePrimary text-lg sm:text-xl">
              Approve Partner
            </p>
          }
          close={onApprove}
        />
      )}
      {isDecline && (
        <ConfirmationModal
          buttonElement={
            <Button
              onClick={decline}
              className="gap-x-2 bg-red-500 text-white w-[130px]"
            >
              {loading && <Loader2Icon size={20} />}
              <p>Decline</p>
            </Button>
          }
          descriptionElement={
            <p>
              You are about to <b>decline</b> this partner, please confirm
            </p>
          }
          titleElement={
            <p className="font-semibold text-red-500 text-lg sm:text-xl">
              Decline Partner
            </p>
          }
          close={onDecline}
        />
      )}
    </div>
  );
}

export function PartnerWidget({
  item,
  event,
  className,
  refetch,
  selectRowFn,
  selectedRows,
  partners,
  activeTab,
}: {
  className: string;
  item: TPartner;
  refetch: () => Promise<any>;
  event: Event | null;
  selectRowFn: (value: number) => void;
  selectedRows: number[];
  partners: TPartner[];
  activeTab: number;
}) {
  const [boothList, setBoothList] = useState<string[]>([]);
  const [status, setStatus] = useState(item?.stampIt);
  const { updateHall } = useUpdateHall();
  const { update, loading } = useUpdatePartners();
  const { updateBooth } = useUpdateBooth();
  const { updatePartnerType } = useUpdatePartnerType();
  const { updateSponsorCategory } = useUpdateSponsor();
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }

  // format hall list
  const hallList = useMemo(() => {
    if (event) {
      return event.exhibitionHall?.map(({ name }) => name);
    }
  }, [event]);

  // format sponsor level
  const levelList = useMemo(() => {
    if (event) {
      return event?.sponsorCategory?.map(({ type }) => type);
    }
  }, [event]);

  // format booth list
  useEffect(() => {
    if (item?.exhibitionHall) {
      // if an hall has been selected
      const hall = item?.exhibitionHall;

      // fetch the hall booth number
      const hallBoothNumber = event?.exhibitionHall.find(
        ({ name }) => name.toLowerCase() === hall.toLowerCase()
      )?.capacity;

      const numbers = Array.from(
        { length: Number(hallBoothNumber) },
        (_, index) => String(index + 1)
      );

      // get all partners with the exhibition hall
      const partnersWithHall = partners.filter(
        ({ exhibitionHall }) => exhibitionHall === hall
      );

      // get their booth numbers
      const boothNumbers = partnersWithHall.map((item) => {
        if (Array.isArray(item?.boothNumber)) {
          return item?.boothNumber;
        } else {
          return [];
        }
      });

      //  console.log({ddd:boothNumbers})

      const filterBoothNumber = boothNumbers
        .filter((v) => v !== undefined)
        .flat();

      // remove the boothNumbers from the availabe booths
      const booths = numbers.filter(
        (number) => !filterBoothNumber.includes(number)
      );

      setBoothList(booths);
    }
  }, [item?.exhibitionHall, partners]);

  async function handleSelectedHall(value: string) {
    // setSelectedHall(value);

    await updateHall(item?.partnerAlias, value);
    refetch(); // fetch partners
  }

  // check if any of partner hall has been deleted
  // delete the hall and booth number from the partner data
  useEffect(() => {
    (async () => {
      if (event) {
        //  hall
        const hall = item?.exhibitionHall;
        if (hall === null) return;

        //check if the hall is still available
        const isHallPresent = event?.exhibitionHall.some(
          ({ name }) => name.toLowerCase() === hall?.toLowerCase()
        );
        // when the hall is not available then, remove it from this partner data
        if (!isHallPresent) {
          await updateBooth(item?.partnerAlias, null);
          await updateHall(item?.partnerAlias, null);
          refetch(); // fetch partners
        }
      }
    })();
  }, [event]);

  async function removeAddedBooth() {
    // boothList
    await updateBooth(item?.partnerAlias, null);
    refetch(); // fetch partners
  }

  async function handleSelectedBooth(value: string[]) {
    await updateBooth(item?.partnerAlias, value);
    refetch(); // fetch partners
  }

  async function handleSelectedPartner(value: string) {
    await updatePartnerType(item?.partnerAlias, value);
    refetch(); // fetch partners
  }

  async function handleSelectedLevel(value: string) {
    // setSelectedLevel(value);
    await updateSponsorCategory(item?.partnerAlias, value);
    refetch(); // fetch partners
  }

  async function submit(bol: boolean) {
    setStatus(bol);
    await update({ ...item, stampIt: bol });
    refetch();
  }

  return (
    <>
      <tr
        onClick={onClose}
        role="button"
        className={cn(
          "w-full grid grid-cols-8 text-sm items-center gap-3 p-3 ",
          className
        )}
      >
        <label
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="col-span-2 w-full flex  relative items-center gap-x-2"
        >
          <input
            checked={selectedRows.includes(item?.id)}
            onChange={() => selectRowFn(item?.id)}
            type="checkbox"
            className="accent-basePrimary w-4 h-4"
          />

          <p className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
            {item?.companyName}
          </p>
        </label>
        <td
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex items-center gap-x-2 "
        >
          <button
            className={cn("hidden", item?.email && "block")}
            onClick={() => sendMail(item?.email)}
          >
            <EmailIcon />
          </button>
          <button
            className={cn("hidden", item?.whatsApp && "block")}
            onClick={() => whatsapp(item?.whatsApp)}
          >
            {" "}
            <WhatsappIcon />
          </button>
          <button
            className={cn("hidden", item?.phoneNumber && "block")}
            onClick={() => phoneCall(item?.phoneNumber)}
          >
            <Phone size={22} />
          </button>
        </td>
        <td
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DropDownSelect
            handleChange={handleSelectedPartner}
            data={["Exhibitor", "Sponsor"]}
            className="w-full"
          >
            <button className="flex relative items-center gap-x-1">
              <p className="w-fit text-start text-ellipsis whitespace-nowrap overflow-hidden">
                {item?.partnerType || "Select Type"}
              </p>
              <ArrowIosDownward size={20} />
            </button>
          </DropDownSelect>
        </td>

        <td
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* {item?.partnerType.toLowerCase() === "sponsor" ? (
            <DropDownSelect handleChange={handleSelectedLevel} data={levelList}>
              <button className="flex relative items-center gap-x-1">
                <p className="w-fit text-start text-ellipsis whitespace-nowrap overflow-hidden">
                  {item?.sponsorCategory || " Select Level"}
                </p>
                <ArrowIosDownward size={20} />
              </button>
            </DropDownSelect>
          ) : (
            <p className="w-1 h-1"></p>
          )} */}
          <p>{item?.tierName ?? ""}</p>
        </td>

        <td
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DropDownSelect handleChange={handleSelectedHall} data={hallList}>
            <button className="flex relative items-center gap-x-1">
              <p className="w-fit text-start text-ellipsis whitespace-nowrap overflow-hidden">
                {item?.exhibitionHall || " Select Hall"}
              </p>
              <ArrowIosDownward size={20} />
            </button>
          </DropDownSelect>
        </td>
        <td
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DropDownSelect
            handleChange={handleSelectedBooth}
            isMultiple
            data={boothList}
            className={item?.exhibitionHall ? "block" : "hidden"}
          >
            <div className="flex items-center gap-x-1">
              <button className="flex items-center relative gap-x-1">
                <p className="flex flex-wrap items-start justify-start max-w-[100px]">
                  {item?.boothNumber?.toString() || "0"}
                </p>
                <ArrowIosDownward size={20} />
              </button>
              <button
                className={cn(
                  "hidden",
                  item?.boothNumber?.length > 0 && "block"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  removeAddedBooth();
                }}
              >
                <CloseOutline size={18} className="text-red-500" />
              </button>
            </div>
          </DropDownSelect>
        </td>
        <td
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {activeTab === 1 ? (
            <ActionColumn refetch={refetch} partner={item} />
          ) : (
            <Switch
              className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
              disabled={loading}
              checked={status}
              onClick={() => submit(!item?.stampIt)}
            />
          )}
        </td>
      </tr>
      {isOpen && event && (
        <AddPartnerManually
          refetchPartners={refetch}
          close={onClose}
          eventId={event?.eventAlias}
          partner={item}
        />
      )}
    </>
  );
}
