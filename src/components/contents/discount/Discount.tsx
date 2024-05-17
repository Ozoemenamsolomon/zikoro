"use client";
import { AddCircle } from "@styled-icons/fluentui-system-regular/AddCircle";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { cn } from "@/lib";
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
import { SideBarLayout } from "@/components";
import { useDiscount } from "@/hooks";
import { ContentTopNav } from "../_components";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import toast from "react-hot-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient()

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
    
      <div className="px-4">
        <div className="flex w-full items-center sm:items-end justify-start sm:justify-end my-3">
          {Array.isArray(formattedData) && formattedData?.length > 0 && (
            <DialogDemo getDiscount={getDiscount} eventId={eventId} />
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
                    <DialogDemo getDiscount={getDiscount} eventId={eventId} />
                  </div>
                </div>
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
 
    if ( validUntil < new Date().toISOString().split("T")[0]) {
      toast.error("Validity date has exceeded")
      return 
    }

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

              <div className="flex justify-between items-center mt-4">
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
            <button
              onClick={submit}
              className="bg-basePrimary h-12 flex items-center justify-center gap-x-2 text-white px-[12px] py-[8px] rounded-[5px] w-full"
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
