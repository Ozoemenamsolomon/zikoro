"use client";
import * as React from "react";
import { FormEvent, useState } from "react";
import { CustomTextBox } from "@/components/CustomTextBox";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomInput } from "@/components/CustomInput";
import { usePathname } from "next/navigation";
import { DataAndTimeAdapter } from "@/context/DataAndTimeAdapter";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { Eye } from "styled-icons/evil";
import { UploadOutline } from "styled-icons/evaicons-outline";
import { Check } from "styled-icons/material";
type ContentData = {
  title: string;
  startDateAndTime: Date | null;
  endDateAndTime: Date | null;
  visibility: string;
  category: string;
  participants: string;
  locationType: string;
  address: string;
  city: string;
  poster: string;
  organisationLogo: string;
  eventDesc: string;
  prerequisites: string;
  benefit: string;
  currency: string;
  earlyBirdPrice: string;
  earlyBirdValidity: string;
  standardPrice: string;
  standardValidity: string;
  lateBirdPrice: string;
  lateBirdValidity: string;
};

export default function Event(this: any): JSX.Element {
  const [data, setData] = useState<ContentData>({
    title: "",
    startDateAndTime: null,
    endDateAndTime: null,
    visibility: "",
    category: "",
    participants: "",
    locationType: "",
    address: "",
    city: "",
    poster: "",
    organisationLogo: "",
    eventDesc: "",
    prerequisites: "",
    benefit: "",
    currency: "",
    earlyBirdPrice: "",
    earlyBirdValidity: "",
    standardPrice: "",
    standardValidity: "",
    lateBirdPrice: "",
    lateBirdValidity: "",
  });

  const previewAction = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget.form as HTMLFormElement);

    const values = Array.from(formData.values());
    const isEmpty = values.includes("");

    if (isEmpty) {
      return;
    }
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      tel: formData.get("tel"),
      date: formData.get("date"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
    };
    console.log(data);

    // const formData = new FormData(e.currentTarget);
    // // const values = Array.from(formData.values());
    // // const isEmpty = values.every((value) => value === "");
    // // const data = Object.fromEntries(formData);
    // Array.from(formData.entries()).forEach(([key, value]) => {
    //   console.log(key, value);
    // });
    // console.log(data);

    // e.currentTarget.reset();
  };

  // const [file, setFile] = useState<File | null>(null);
  // const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setFile(e.target.files[0]);
  //   }
  // }
  const publishAction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values = Array.from(formData.values());
    const isEmpty = values.every((value) => value === "");
    const data = Object.fromEntries(formData);
    console.log(data);

    // e.currentTarget.reset();
  };

  //   const pathname = usePathname();
  return (
    <DataAndTimeAdapter>
      <div className="p-4">
        <h6 className="font-medium">Event information</h6>
      </div>
      {/* form */}
      <form
        className="w-[100%]"
        onSubmit={() => {
          publishAction;
          previewAction;
        }}
        id="form"
      >
        <div className="grid grid-cols-2">
          <div className="p-1 space-y-10">
            <CustomInput
              label="Event title"
              id="eventTitle"
              placeholder="Enter event title"
              type="text"
            />
            <div className="flex justify-between gap-2 relative">
              <span className="z-10 -top-3 ml-[2rem] left-20 p-1 bg-white rounded-sm block text-[12px] text-gray-700 absolute">
                {" "}
                Start date and time
              </span>
              <span className="block text-[12px] bg-white text-gray-700 absolute right-3 -top-3 p-1 rounded-sm z-10">
                {" "}
                End date and time
              </span>
              <DateTimePicker
                name="date_time_picker"
                sx={{
                  width: "100%",
                  height: "56px",
                  borderRadius: "5px",
                  border: "1px solid #f3f3f3",
                  color: "#717171",
                  "& .MuiInputBase-input": {
                    paddingBlock: "10px",
                    paddingLeft: "15px",
                    fontSize: "14px",
                    color: "black",
                  },
                  "& .MuiInputBase-root": {
                    height: "60px",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    border: "1px solid #f3f3f3",
                  },
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
              <DateTimePicker
                sx={{
                  width: "100%",
                  height: "56px",
                  borderRadius: "5px",
                  border: "1px solid #f3f3f3",
                  color: "#717171",
                  "& .MuiInputBase-input": {
                    paddingBlock: "10px",
                    paddingLeft: "15px",
                    fontSize: "14px",
                    color: "black",
                  },
                  "& .MuiInputBase-root": {
                    height: "60px",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    border: "1px solid #f3f3f3",
                  },
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
            <CustomSelect
              label="Event visibilty"
              placeholder="Please select"
              name="event_visibility"
            />
            <CustomSelect
              label="Industry"
              placeholder="Please select"
              name="industry"
            />

            <CustomSelect label="Event category" placeholder="Please select" />
            <CustomInput
              label="Number of Participants"
              id="noOfParticipants"
              type="number"
              placeholder="0"
            />
            <CustomSelect label="Location type" placeholder="Please select" />
            <div className="flex justify-between gap-4">
              <CustomInput
                label="Event address"
                type="text"
                id="eventAddress"
                containerClassName="w-1/2"
                placeholder="Enter address"
              />
              <CustomInput
                label="Event country"
                type="text"
                id="eventCountry"
                containerClassName="w-1/2"
                placeholder="Enter country"
              />
            </div>

            <CustomInput
              label="Event poster"
              type="file"
              accept="image/*"
              id="eventPoster"
              placeholder="Select image"
            />
            <span className="description-text">
              Image size should be 1080px by 1080px
            </span>
            <div className="">
              <CustomInput
                label="Organisation logo"
                type="file"
                accept="image/*"
                id="organisationLogo"
                placeholder="Select image"
              />
            </div>
            <span className="description-text">
              Image size should be 1080px by 1080px
            </span>
          </div>
          <div className="p-4 space-y-6">
            <CustomTextBox
              label="Description"
              id="description"
              name="eventDesc"
            />
            <CustomTextBox
              label="Prerequisites"
              id="prerequisites"
              name="prerequisites"
            />
            <CustomTextBox label="Benefit" id="benefit" name="benefit" />
            <CustomSelect
              label="Pricing currency"
              placeholder="Please select currency"
            />
            <div className="border-2 border-[#f3f3f3] p-4 rounded-md space-y-5 pb-10">
              <h5>Pricing</h5>
              <div className="flex items-center gap-2 relative">
                <CustomInput
                  label="Early bird"
                  id="earlyBird"
                  type="number"
                  containerClassName="w-1/2"
                  placeholder="Enter price"
                />
                <span className="block text-[12px] bg-white text-gray-700 absolute right-3 -top-3 p-1 rounded-sm z-10">
                  {" "}
                  Validity
                </span>
                <DatePicker
                  sx={{
                    width: "50%",
                    borderRadius: "9px",
                    border: "1px solid #f3f3f3",
                    color: "#717171",
                    "& .MuiInputBase-input": {
                      paddingLeft: "15px",
                      height: "22px",
                      fontSize: "12px",
                      color: "black",
                    },

                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#f3f3f3",
                      },
                      "&:hover fieldset": {
                        borderColor: "#f3f3f3",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                        borderRadius: "9px",
                      },
                      "& .MuiFormControl-root": {
                        padding: "0px",
                      },
                    },
                  }}
                />
              </div>
              <div className="flex items-center  justify-between gap-2 relative">
                <CustomInput
                  label="Standard"
                  id="standard"
                  type="number"
                  containerClassName="w-1/2"
                  placeholder="Enter price"
                />
                {/* <CustomInput
                          label="Validity"
                          id="validity"
                          type="date"
                          containerClassName="w-1/2"
                          placeholder="Pick date"
                        /> */}
                <span className="block text-[12px] bg-white text-gray-700 absolute right-3 -top-3 p-1 rounded-sm z-10">
                  {" "}
                  Validity
                </span>
                <DatePicker
                  // value={this.state.value}
                  // onChange={(newValue) => this.setState({ value: newValue })}
                  sx={{
                    width: "50%",
                    borderRadius: "9px",
                    border: "1px solid #f3f3f3",
                    color: "#717171",
                    "& .MuiInputBase-input": {
                      paddingLeft: "15px",
                      height: "22px",
                      fontSize: "12px",
                      color: "black",
                    },

                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#f3f3f3",
                      },
                      "&:hover fieldset": {
                        borderColor: "#f3f3f3",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                        borderRadius: "9px",
                      },
                      "& .MuiFormControl-root": {
                        padding: "0px",
                      },
                    },
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 relative">
                <CustomInput
                  label="Late bird"
                  id="lateBird"
                  type="number"
                  containerClassName="w-1/2"
                  placeholder="Enter price"
                />
                {/* <CustomInput
                          label="Validity"
                          id="validity"
                          type="date"
                          containerClassName="w-1/2"
                          placeholder="Pick date"
                        /> */}
                <span className="block text-[12px] bg-white text-gray-700 absolute right-3 -top-3 p-1 rounded-sm z-10">
                  {" "}
                  Validity
                </span>
                <DatePicker
                  sx={{
                    width: "50%",
                    borderRadius: "9px",
                    border: "1px solid #f3f3f3",
                    color: "#717171",
                    "& .MuiInputBase-input": {
                      paddingLeft: "15px",
                      height: "22px",
                      fontSize: "12px",
                      color: "black",
                    },

                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#f3f3f3",
                      },
                      "&:hover fieldset": {
                        borderColor: "#f3f3f3",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                        borderRadius: "9px",
                      },
                      "& .MuiFormControl-root": {
                        padding: "0px",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </DataAndTimeAdapter>
  );
}
