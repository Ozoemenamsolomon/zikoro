"use client";
import { AddCircle } from "styled-icons/fluentui-system-regular";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib";
import { DateAndTimeAdapter } from "@/context/DateAndTimeAdapter";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { Input, Button } from "@/components";
import { MinusCircle, PlusCircle } from "styled-icons/heroicons-outline";
import { addDiscount } from "@/app/server-actions/addDiscount";
import { useDiscount } from "@/hooks";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { verifyingAccess } from "@/utils";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export default function Discount({ eventId }: { eventId: string }) {
  const [discountData, setDiscountData] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getDiscount = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("discount")
        .select("*")
        .eq("eventId", eventId);
      if (error) {
        setError(true);

        throw error;
      }
      if (data) {
        setDiscountData(data as any);
        setError(false);
        revalidatePath("/content/discount");
      }
    } catch (error) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDiscount();
  }, []);

  // remove timestamp from date
  const formattedData = discountData.map((discount: any) => {
    return {
      ...discount,
      created_at: discount.created_at.slice(0, 10),
      validUntil: discount.validUntil.slice(0, 10),
    };
  });

  return (
    <>
      <div className="w-full px-4 mx-auto  max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10">
        <div className="flex w-full items-center sm:items-end justify-start sm:justify-end my-3">
          {Array.isArray(formattedData) && formattedData?.length > 0 && (
            <DialogDemo
              data={formattedData}
              getDiscount={getDiscount}
              eventId={eventId}
            />
          )}
        </div>
        <div className="overflow-x-auto w-full partner-scroll-style">
          <div
            className={cn(
              "pb-3 w-full",
              Array.isArray(formattedData) &&
                formattedData?.length > 0 &&
                "min-w-[1000px]"
            )}
          >
            {Array.isArray(formattedData) && formattedData?.length > 0 && (
              <ul className="grid grid-cols-8 rounded-t-lg place-items-center text-center font-semibold bg-[#f3f3f3] p-3 border-b-2 text-[14px]">
                <li className="w-full text-start">Created At</li>
                <li>Code</li>
                <li>Min. QTy</li>
                <li>Valid until</li>
                <li>Amount</li>
                <li>Percentage</li>
                <li>Quantity</li>
                <li>Status</li>
              </ul>
            )}
            {Array.isArray(formattedData) && formattedData?.length === 0 && (
              <>
                <div className="w-full col-span-full items-center flex flex-col justify-center h-[300px]">
                  <div className="flex items-center justify-center flex-col gap-y-2">
                    <Image
                      alt="discount"
                      width={300}
                      height={300}
                      className="w-[100px] h-[100px]"
                      src="/images/ediscount.png"
                    />
                    <p className="text-[#717171] font-medium">
                      This page is empty. Discount will appear here.
                    </p>
                    <DialogDemo
                      data={formattedData}
                      getDiscount={getDiscount}
                      eventId={eventId}
                    />
                  </div>
                </div>
              </>
            )}
            {Array.isArray(formattedData) &&
              formattedData.map((discount: any) => (
                <DiscountList
                  key={discount.id}
          discountUsers={discount?.discountUsers}

                  createdAt={discount.created_at}
                  code={discount.discountCode}
                  minQty={discount.minQty}
                  validUntil={discount.validUntil}
                  amount={discount.discountAmount || ""}
                  percentage={discount.discountPercentage || ""}
                  quantity={discount.quantity}
                  status={discount.status}
                  orgId={discount?.id}
                  getDiscount={getDiscount}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

const DiscountList: React.FC<{
  createdAt?: string;
  code?: string;
  minQty: string;
  validUntil?: string;
  amount?: string;
  percentage?: string;
  quantity?: string;
  status?: boolean;
  orgId: string;
  discountUsers?:string;
  getDiscount: () => Promise<void>;
}> = ({
  createdAt = "",
  code = "",
  minQty = "",
  validUntil = "",
  amount = "",
  percentage = "",
  quantity = "",
  status,
  orgId,
  discountUsers,
  getDiscount,
}) => {
  const [value, setValue] = useState(status);
  const { updating, updateDiscount } = useDiscount();

  async function submit(value: boolean) {
    if (validUntil < new Date().toISOString().split("T")[0]) {
      toast.error("Validity date has exceeded");
      return;
    }

    setValue(value);
    await updateDiscount(value, orgId);
    getDiscount();
  }
  // console.log(value)

  return (
    <ul className="grid grid-cols-8 bg-white place-items-center text-center p-3 text-[12px] border-x border-b">
      <li className="flex w-full flex-col justify-start items-start">
        <p  className="text-start">{createdAt}</p>
        <p className="text-xs text-start capitalize">{discountUsers === "both" ? "Attendees and Partners" : discountUsers}</p>
      </li>
      <li>{code}</li>
      <li>{minQty}</li>
      <li>{validUntil}</li>
      <li>{amount}</li>
      <li>{percentage}</li>
      <li>{quantity}</li>
      <li>
        <Switch
          className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary"
          disabled={updating}
          onClick={() => submit(!status)}
          checked={
            validUntil >= new Date().toISOString().split("T")[0] && value
          }
        />
      </li>
    </ul>
  );
};

const DialogDemo = ({
  getDiscount,
  eventId,
  data,
}: {
  getDiscount: () => Promise<void>;
  eventId: string;
  data: any[];
}) => {
  const [minQty, setMinQty] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [percentage, setPercentage] = useState<number>(1);
  const [isAmtChecked, setIsAmtChecked] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [discountUsers, setDiscountUsers] = useState("attendees")
  const { createDiscount, loading } = useDiscount();
  const { organization } = useOrganizationStore();
  const [discountData, setDiscountData] = useState({
    discountCode: "",
    discountAmount: "",
    validUntil: "",
  });

  const isMaxReached = useMemo(() => {
    return data?.length >= 3 && organization?.subscriptionPlan !== "Enterprise";
  }, [data, organization]);
  async function submit() {
    // min. of 3 discount coupon - Free, Lite, Professional
    // unlimited discount coupon - Enterprise
    if (data?.length >= 3 && organization?.subscriptionPlan !== "Enterprise") {
      verifyingAccess({
        textContent:
          "You have reached the limit of 3 discount coupons. Upgrade to higher plan",
      });
      return;
    }

    const { discountAmount, ...restData } = discountData;

    const payload = isAmtChecked
      ? {
          ...restData,
          minQty,
          quantity,
          discountAmount,
          eventId,
          status: true,
          discountUsers
        }
      : {
          ...restData,
          minQty,
          quantity,
          eventId,
          discountPercentage: percentage,
          status: true,
          discountUsers 
        };

    await createDiscount(payload);
    getDiscount();
    setDialogOpen((prev) => !prev);
  }

  const discountUsersList = [
    {value:"attendees", label:"Attendees"},
    {value:"partners", label:"Partners"},
    {value:"both", label:"Both"},
  ]
  return (
    <DateAndTimeAdapter>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-fit h-11 sm:h-12 bg-basePrimary items-center gap-x-2 text-gray-50">
            <AddCircle size={22} />
            <span className="">Discount</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white w-[95%] sm:max-w-[650px] py-6 sm:py-8 px-4 sm:px-10 max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <p className="text-[24px] font-medium">Create a discount</p>
            </DialogTitle>
          </DialogHeader>
          <form action={addDiscount} id="form">
            <div className="grid my-6 relative text-[#3E404B]">
              <label className="w-full gap-y-2 flex flex-col items-start justify-start relative my-3">
                <span className="text-gray-600 font-medium">
                  Discount code
                </span>
                <Input
                  placeholder="Enter a discount code"
                  type="text"
                  value={discountData?.discountCode}
                  onChange={(e) => {
                    setDiscountData({
                      ...discountData,
                      discountCode: e.target.value,
                    });
                  }}
                  name="discountCode"
                  className="placeholder:text-sm h-12 border border-basePrimary bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end focus:border-gray-500 placeholder:text-gray-400 text-gray-700"
                />
              </label>
              <div className="flex justify-between items-center mt-4">
                <p className="text-base">Minimum Quantity</p>
                <div className="flex gap-x-2 items-center justify-between">
                  <MinusCircle
                    size={25}
                    color="gray"
                    role="button"
                    onClick={() => {
                      if (minQty > 1) {
                        setMinQty(minQty - 1);
                      }
                    }}
                  />
                  <p>{minQty}</p>
                  <PlusCircle
                    size={25}
                    color="#001FCC"
                    role="button"
                    onClick={() => setMinQty(minQty + 1)}
                  />
                </div>
              </div>
              <span className="description-text pt-2">
                This can be used for bulk ticket purchase discount
              </span>
              <label className="flex w-full flex-col items-start justify-start gap-y-2 relative my-6">
                <span className="span font-medium ">Valid until</span>
                <Input
                  placeholder="Enter Date"
                  type="datetime-local"
                  value={discountData?.validUntil}
                  onChange={(e) => {
                    setDiscountData({
                      ...discountData,
                      validUntil: e.target.value,
                    });
                  }}
                  className="inline-block w-full placeholder:text-sm h-12 border border-basePrimary focus:border-gray-500 placeholder:text-gray-400 bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end text-gray-700"
                />
              </label>
              <div className="text-sm mb-1">
                <p>Select discount type</p>
                <div className="flex items-center space-x-8 mt-2">
                  <div className="flex items-center space-x-2 ">
                    <Checkbox
                      className={`w-4 h-4 data-[state=checked]:border-none data-[state=checked]:bg-basePrimary rounded-sm 
                      }`}
                      role="button"
                      name="AmtChecker"
                      checked={isAmtChecked}
                      onClick={() => {
                        setIsAmtChecked(true);
                      }}
                    />
                    <span>Amount</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      className={`w-4 h-4 data-[state=checked]:border-none data-[state=checked]:bg-basePrimary rounded-sm
                      } `}
                      role="button"
                      name="percenChecker"
                      id="percenChecker"
                      checked={!isAmtChecked}
                      onClick={(e) => {
                        setIsAmtChecked(false);
                      }}
                    />
                    <span>Percentage</span>
                  </div>
                </div>
              </div>
              {isAmtChecked ? (
                <label className="w-full flex gap-y-2 flex-col items-start justify-start relative my-3">
                  <span className=" text-gray-600 font-medium">
                    Discount amount
                  </span>
                  <Input
                    placeholder="Enter a discount amount"
                    type="number"
                    value={discountData?.discountAmount}
                    onChange={(e) => {
                      setDiscountData({
                        ...discountData,
                        discountAmount: e.target.value,
                      });
                    }}
                    name="discountAmount"
                    className="placeholder:text-sm h-12 border border-basePrimary focus:border-gray-500 placeholder:text-gray-400 bg-gradient-to-tr rounded-md from-custom-bg-gradient-start to-custom-bg-gradient-end text-gray-700"
                  />
                </label>
              ) : (
                <div className="flex justify-between items-center mt-8">
                  <p className="text-base">Discount percentage</p>
                  <div className="flex items-center gap-x-1">
                    <MinusCircle
                      size={25}
                      color="gray"
                      role="button"
                      onClick={() => {
                        if (percentage > 1) {
                          setPercentage(percentage - 1);
                        }
                      }}
                    />
                    <p className="">{`${percentage}%`}</p>
                    <PlusCircle
                      size={25}
                      color="#001FCC"
                      role="button"
                      onClick={() => setPercentage(percentage + 1)}
                    />
                  </div>
                </div>
              )}

              <div className="hidden justify-between items-center mt-4">
                <p className="text-base">Quantity</p>
                <div className="flex items-center gap-x-2">
                  <MinusCircle
                    size={25}
                    color="gray"
                    role="button"
                    onClick={() => {
                      if (quantity > 1) {
                        setQuantity(quantity - 1);
                      }
                    }}
                  />
                  <p>{quantity}</p>
                  <PlusCircle
                    size={25}
                    color="#001FCC"
                    role="button"
                    onClick={() => setQuantity(quantity + 1)}
                  />
                </div>
              </div>
            </div>
            <label className="flex mb-4 flex-col items-start justify-start gap-y-3">
              <span>Who will use the discount code ?</span>
                    <div className="w-full flex items-center gap-x-4">
                      {discountUsersList?.map((item, index) => (
                         <div
                         key={index}
                         className="flex items-center gap-x-2">
                         <Checkbox
                           className={`w-4 h-4 data-[state=checked]:border-none data-[state=checked]:bg-basePrimary rounded-sm
                           } `}
                           role="button"
                           name="discountUsers"
                           //id="percenChecker"
                           checked={discountUsers === item?.value}
                           onClick={(e) => {
                             setDiscountUsers(item?.value)
                           }}
                         />
                         <span>{item?.label}</span>
                       </div>
                      ))}
                    </div>
            </label>
            <button
              onClick={submit}
              disabled={isMaxReached}
              className={cn(
                "bg-basePrimary h-12 flex items-center justify-center gap-x-2 text-white px-[12px] py-[8px] rounded-[5px] w-full",
                isMaxReached && "bg-gray-400"
              )}
              type="submit"
            >
              {loading && <LoaderAlt size={22} />}
              <p> Done</p>
            </button>
            {isMaxReached && (
              <p className="text-center mt-2">
                Your have reached the limit of 3 discount coupons.{" "}
                <Link className="text-basePrimary" href="/pricing">
                  Upgrade
                </Link>
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </DateAndTimeAdapter>
  );
};
