"use client";
import { AddCircle } from "@styled-icons/fluentui-system-regular/AddCircle";
import { Separator } from "@/components/ui/separator";
import { DiscountList } from "@/components/Discount/DiscountList";
import { useEffect, useState } from "react";
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

export default function Discount() {
  return (
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

        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
      </div>
    </div>
  );
}

const DialogDemo = () => {
  const [color, setColor] = useState("#D6D6D6");

  const [minQty, setMinQty] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [percentage, setPercentage] = useState<number>(5);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isAmtChecked, setIsAmtChecked] = useState<boolean>(false);
  const [isPercChecked, setIsPercChecked] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget.form as HTMLFormElement);
  //   // const minQtyValue = formData.append("minQty", minQty.toString());
  //   // const quantityValue = formData.append("quantity", quantity.toString());
  //   // const values = Array.from(formData.values());
  //   const data = Object.fromEntries(formData);
  //   console.log(data, minQty, quantity);
  // };
  // const data = Object.fromEntries(formData);
  // const values = Array.from(formData.values());

  // console.log("data", data);
  // console.log("values", values);
  // return values;

  // async function appendToFormData() {
  //   const formData = new FormData();
  //   formData.append("minQty", minQty.toString());
  //   formData.append("quantity", quantity.toString());
  //   formData.append("percentage", percentage.toString());
  //   // console.log(formData);
  //   return formData;
  // }

  // const addDataToDiscount = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = await appendToFormData();
  //   console.log(formData);
  // };

  return (
    <DateAndTimeAdapter>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex justify-between items-center bg-bluebg text-white px-[12px] py-[8px] rounded-[5px]">
            <span className="pr-[8px]">New</span>
            <AddCircle size={20} />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] py-8 px-10 max-h-[95vh]">
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
                <div className="flex justify-between space-x-2">
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
                  {/* <p>{minQty}</p> */}
                  <input
                    type="number"
                    value={minQty}
                    readOnly
                    name="minQty"
                    id="minQty"
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
                      // required: true,
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
                      className={`w-4 h-4 data-[state=checked]:border-none data-[state=checked]:bg-bluebg rounded-sm 
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
                      className={`w-4 h-4 data-[state=checked]:border-none data-[state=checked]:bg-bluebg rounded-sm
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
                  <div className="flex justify-between space-x-2">
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
                    {/* <p>{percentage}%</p> */}
                    <input
                      type="number"
                      value={percentage}
                      readOnly
                      name="percentage"
                      id="percentage"
                    />
                    {/* <span></span> */}
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
                  {/* <p>{quantity}</p> */}
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    name="quantity"
                    id="quantity"
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
              className="bg-bluebg text-white px-[12px] py-[8px] rounded-[5px] w-full"
              type="submit"
              onClick={() => {
                setDialogOpen(!dialogOpen);
                // console.log(minQty, quantity, percentage);
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
