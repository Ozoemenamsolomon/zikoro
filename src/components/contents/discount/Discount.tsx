"use client";
import { AddCircle } from "@styled-icons/fluentui-system-regular/AddCircle";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { DateAndTimeAdapter } from "@/context/DateAndTimeAdapter";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { Input, Button } from "@/components";
import { MinusCircle, PlusCircle } from "styled-icons/heroicons-outline";
import { addDiscount } from "@/app/server-actions/addDiscount";
import supabase from "@/utils/supabaseConfig";
import { SideBarLayout } from "@/components";
import { useDiscount } from "@/hooks";
import { ContentTopNav } from "@/components/content/topNav";
import { revalidatePath } from "next/cache";
import { EmptyCard } from "@/components/composables";

// const addDiscount = async (formData: FormData) => {
//   "use server";
//   const discountCode = formData.get("discountCode");
//   const minQty = formData.get("minQty");
//   const discountAmount = parseInt(formData.get("discountAmount") as string);
//   const discountPercentage = formData.get("percentage");
//   const validUntil = formData.get("validUntil");
//   const quantity = formData.get("quantity");
//   const status = true;

//   if (
//     !discountCode ||
//     !minQty ||
//     !discountAmount ||
//     !discountPercentage ||
//     !validUntil ||
//     !quantity
//   ) {
//     return;
//   }
//   const { data, error } = await supabase.from("discount").insert([
//     {
//       discountCode: discountCode,
//       minQty: minQty,
//       discountAmount: discountAmount,
//       discountPercentage: discountPercentage,
//       validUntil: validUntil,
//       quantity: quantity,
//       status: status,
//     },
//   ]);
//   if (error) {
//     console.log(error);
//     throw error;
//   }
//   if (data) {
//     console.log(data, "discount added");
//   }
// };

// const fetchDiscount = async () => {
//   const { data, error } = await supabase.from("discount").select();
//   if (error) {
//     console.log(error);
//     throw error;
//   }
//   if (data) {
//     console.log(data);
//     revalidatePath("/content/discount");
//   }
//   return data;
// };

export default function Discount({ eventId }: { eventId: string }) {
  const [discountData, setDiscountData] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [value, setValue] = useState<string>("off");

  const getDiscount = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("discount")
        .select("*")
        .eq("eventId", eventId);
      if (error) {
        setError(true);
        console.log(error);
        throw error;
      }
      if (data) {
        console.log(data);
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

  // change status
  const changeStatus = async (id: string, status: boolean) => {
    try {
      const { data, error } = await supabase
        .from("discount")
        .update({ status: !status })
        .eq("id", id);
      if (error) {
        console.log(error);
        throw error;
      }
      if (data) {
        console.log(data);
        revalidatePath("/content/discount");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SideBarLayout
      hasTopBar
      className="px-0 sm:px-0 pt-14 sm:pt-14"
      parentClassName="px-0 sm:px-0 py-0 sm:py-0 pt-3 sm:pt-4"
      eventId={eventId}
    >
      <ContentTopNav eventId={eventId} />
      <div className="p-4">
        <div className="flex w-full items-end justify-end my-5">
          <DialogDemo getDiscount={getDiscount} eventId={eventId} />
        </div>
        <div className="overflow-x-auto w-full partner-scroll-style">
          <div className="pb-3 min-w-[1000px] w-full">
            {Array.isArray(formattedData) && formattedData?.length > 0 && (
              <ul className="grid grid-cols-8 rounded-t-lg place-items-center text-center border bg-[#f3f3f3] p-3 border-b-2 text-[14px] font-semibold">
                <li>Created At</li>
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
                <EmptyCard
                  width="100"
                  height="100"
                  text="No available discount for this event"
                />
              </>
            )}
            {Array.isArray(formattedData) &&
              formattedData.map((discount: any) => (
                <DiscountList
                  key={discount.id}
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
            <Separator />
          </div>
        </div>
      </div>
    </SideBarLayout>
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
  getDiscount,
}) => {
  const [value, setValue] = useState(status);
  const { updating, updateDiscount } = useDiscount();

  async function submit(value: boolean) {
    setValue(value);
    await updateDiscount(value, orgId);
    getDiscount();
  }
  // console.log(value)

  return (
    <ul className="grid grid-cols-8 place-items-center text-center p-3 text-[12px] border-x border-b">
      <li className="flex items-center">{createdAt}</li>
      <li>{code}</li>
      <li>{minQty}</li>
      <li>{validUntil}</li>
      <li>{amount}</li>
      <li>{percentage}</li>
      <li>{quantity}</li>
      <li>
        <Switch
          className={`data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-zikoro w-[32px] h-[22px]`}
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
}: {
  getDiscount: () => Promise<void>;
  eventId: string;
}) => {
  const [minQty, setMinQty] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [percentage, setPercentage] = useState<number>(1);
  const [isAmtChecked, setIsAmtChecked] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { createDiscount, loading } = useDiscount();
  const [discountData, setDiscountData] = useState({
    discountCode: "",
    discountAmount: "",
    validUntil: "",
  });

  async function submit() {
    const { discountAmount, ...restData } = discountData;

    const payload = isAmtChecked
      ? {
          ...restData,
          minQty,
          quantity,
          discountAmount,
          eventId,
          status: true,
        }
      : {
          ...restData,
          minQty,
          quantity,
          eventId,
          discountPercentage: percentage,

          status: true,
        };

    await createDiscount(payload);
    getDiscount();
    setDialogOpen((prev) => !prev);
  }

  return (
    <DateAndTimeAdapter>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-fit bg-zikoro items-center gap-x-2 text-gray-50">
            <AddCircle size={20} />
            <span className="">Discount</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white sm:max-w-[425px] py-8 px-10 max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>
              <p className="text-[24px] font-medium">Create a discount</p>
            </DialogTitle>
          </DialogHeader>
          <form action={addDiscount} id="form">
            <div className="grid my-6 relative text-[#3E404B]">
              <label className="w-full relative my-3">
                <span className="absolute -top-2 z-30 right-4 bg-white text-gray-600 text-xs px-1">
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
                  className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
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
              <label className="flex relative my-6">
                <span className="span">Valid until</span>
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
                  className="placeholder:text-sm h-12 inline-block focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                />
              </label>
              <div className="text-sm mb-1">
                <p>Select discount type</p>
                <div className="flex items-center space-x-8 mt-2">
                  <div className="flex items-center space-x-2 ">
                    <Checkbox
                      className={`w-4 h-4 data-[state=checked]:border-none data-[state=checked]:bg-zikoro rounded-sm 
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
                      className={`w-4 h-4 data-[state=checked]:border-none data-[state=checked]:bg-zikoro rounded-sm
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
                <label className="w-full relative my-3">
                  <span className="absolute -top-2 z-30 right-4 bg-white text-gray-600 text-xs px-1">
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
                    className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                  />
                </label>
              ) : (
                <div className="flex justify-between items-center mt-8">
                  <p className="text-base">Discount percentage</p>
                  <div className="flex justify-between">
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
                    <div className="flex items-center -space-x-3">
                      <input
                        type="number"
                        value={percentage}
                        readOnly
                        name="percentage"
                        id="percentage"
                        className="w-12 text-end"
                      />
                      <p className="mr-2">%</p>
                    </div>

                    <PlusCircle
                      size={25}
                      color="#001FCC"
                      role="button"
                      onClick={() => setPercentage(percentage + 1)}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <p className="text-base">Quantity</p>
                <div className="flex justify-between space-x-2">
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
            <button
              onClick={submit}
              className="bg-zikoro h-12 flex items-center justify-center gap-x-2 text-white px-[12px] py-[8px] rounded-[5px] w-full"
              type="submit"
            >
              {loading && <LoaderAlt size={22} />}
              <p> Done</p>
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </DateAndTimeAdapter>
  );
};
