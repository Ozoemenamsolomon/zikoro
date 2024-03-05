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
import { MinusCircle, PlusCircle } from "styled-icons/heroicons-outline";
import { CustomInput } from "@/components/content/CustomInput";
import { DatePicker } from "@mui/x-date-pickers";
import { addDiscount } from "@/app/server-actions/addDiscount";
import supabase from "@/utils/supabaseConfig";
import { SideBarLayout } from "@/components";
import { ContentTopNav } from "@/components/content/topNav";
import { revalidatePath } from "next/cache";

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

  useEffect(() => {
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
        <div className="flex justify-between my-5">
          <h6 className="font-medium">Discount</h6>
          <DialogDemo />
        </div>
        <div className="p-3 ">
          <ul className="grid grid-cols-8 place-items-center text-center border bg-[#f3f3f3] p-3 border-b-2 text-[14px] font-bold">
            <li>Created at</li>
            <li>Code</li>
            <li>Min. QTy</li>
            <li>Valid until</li>
            <li>Amount</li>
            <li>Percentage</li>
            <li>Quantity</li>
            <li>Status</li>
          </ul>

          {Array.isArray(formattedData) &&
            formattedData.map((discount: any, id, arr) => (
              <DiscountList
                key={discount.id}
                createdAt={discount.created_at}
                code={discount.discountCode}
                minQty={discount.minQty}
                validUntil={discount.validUntil}
                amount={discount.discountAmount || "NULL"}
                percentage={discount.discountPercentage || "NULL"}
                quantity={discount.quantity}
                status={discount.status}
                onClick={() => {
                  changeStatus(discount.id, discount.status);
                  setValue(discount.status ? "on" : "off");
                  console.log(value);
                }}
                value={value}
              />
            ))}
          <Separator />
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
  onClick?: () => void;
  value: string;
}> = ({
  createdAt = "",
  code = "",
  minQty = "",
  validUntil = "",
  amount = "",
  percentage = "",
  quantity = "",
  status = false,
  onClick = () => {},
  value = "",
}) => {
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
          className={`data-[state=checked]:bg-zikoro w-[32px] h-[22px]`}
          checked={
            validUntil >= new Date().toISOString().split("T")[0]
              ? true
              : false && status
          }
          onClick={onClick}
          value={value}
        />
      </li>
    </ul>
  );
};

const DialogDemo = () => {
  const [minQty, setMinQty] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [percentage, setPercentage] = useState<number>(5);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAmtChecked, setIsAmtChecked] = useState<boolean>(false);
  const [isPercChecked, setIsPercChecked] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <DateAndTimeAdapter>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex justify-between items-center bg-zikoro text-white px-[12px] py-[8px] rounded-[5px]">
            <span className="pr-[8px]">New</span>
            <AddCircle size={20} />
          </button>
        </DialogTrigger>
        <DialogContent className="bg-white sm:max-w-[425px] py-8 px-10 max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>
              <p className="text-[24px] font-medium">Create a discount</p>
            </DialogTitle>
          </DialogHeader>
          <form action={addDiscount} id="form">
            <div className="grid my-6 relative text-[#3E404B]">
              <CustomInput
                label="Discount code"
                placeholder="Enter a discount code"
                id="discountCode"
                containerClassName="w-full"
                type="text"
                name="discountCode"
              />
              <div className="flex justify-between items-center mt-4">
                <p className="text-base">Minimum Quantity</p>
                <div className="flex justify-between">
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
                  <input
                    type="number"
                    value={minQty}
                    readOnly
                    name="minQty"
                    id="minQty"
                    className="w-10 pl-2.5 text-center"
                  />
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
              <div className="flex relative my-6">
                <span className="span">Valid until</span>
                <DatePicker
                  open={isOpen}
                  onOpen={() => setIsOpen(true)}
                  onClose={() => setIsOpen(false)}
                  name="validUntil"
                  className="w-full"
                  slotProps={{
                    textField: {
                      required: true,
                      placeholder: "Pick date",
                      InputProps: {
                        className: "flex flex-row-reverse",
                        endAdornment: (
                          <img
                            src={"/date-time.svg"}
                            alt="calendar-icon"
                            width={25}
                            height={25}
                            className="cursor-pointer"
                            onClick={() => setIsOpen(!isOpen)}
                          />
                        ),
                      },
                    },
                    popper: {
                      sx: {
                        pointerEvents: "auto",
                      },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#f3f3f3",
                      },
                      "&:hover fieldset": {
                        borderColor: "#f3f3f3",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                />
              </div>
              <div className="text-sm mb-1">
                <p>Select discount type</p>
                <div className="flex items-center space-x-8 mt-2">
                  <div className="flex items-center space-x-2 ">
                    <Checkbox
                      className={`w-4 h-4 data-[state=checked]:border-none data-[state=checked]:bg-zikoro rounded-sm 
                      }`}
                      role="button"
                      name="AmtChecker"
                      onClick={() => {
                        setIsAmtChecked(!isAmtChecked);
                        setIsPercChecked(!isPercChecked);
                      }}
                      defaultChecked
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
                      checked={isPercChecked}
                      onClick={(e) => {
                        console.log(e.currentTarget.name);
                      }}
                    />
                    <span>Percentage</span>
                  </div>
                </div>
              </div>
              {!isAmtChecked ? (
                <CustomInput
                  label="Discount amount"
                  name="discountAmount"
                  id="discountAmount"
                  type="number"
                  placeholder="Enter amount"
                  containerClassName="mt-8"
                />
              ) : (
                <div className="flex justify-between items-center mt-8">
                  <p className="text-base">Discount percentage</p>
                  <div className="flex justify-between">
                    <MinusCircle
                      size={25}
                      color="gray"
                      role="button"
                      onClick={() => {
                        if (percentage > 5) {
                          setPercentage(percentage - 5);
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
                      onClick={() => setPercentage(percentage + 5)}
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
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    name="quantity"
                    id="quantity"
                    className="w-8 pl-2 text-center"
                  />
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
              className="bg-zikoro text-white px-[12px] py-[8px] rounded-[5px] w-full"
              type="submit"
              onClick={() => {
                setDialogOpen(!dialogOpen);
              }}
            >
              Done
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </DateAndTimeAdapter>
  );
};
