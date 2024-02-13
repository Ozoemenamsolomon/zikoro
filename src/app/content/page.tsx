"use client";
import { FormEvent, useState, useRef, useEffect } from "react";
import { CustomSelect } from "@/components/content/CustomSelect";
import { CustomInput } from "@/components/content/CustomInput";
import { DateAndTimeAdapter } from "@/context/DateAndTimeAdapter";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { addEvent } from "../server-actions/addEvent";
import { Camera } from "@styled-icons/feather/Camera";
import countries from "@/../countrylist.json";
import TextEditor from "@/components/content/TextEditor";

interface ImageFile {
  url: string | undefined;
  name: string;
  size: number;
  type?: string;
  blob?: Blob;
  arrayBuffer?: () => Promise<ArrayBuffer>;
  slice?: (start?: number, end?: number, contentType?: string) => Blob;
  stream?: () => ReadableStream<Uint8Array>;
  text?: () => Promise<string>;
}

export default function Event(): JSX.Element {
  const [organisationLogoArr, setOrganisationLogoArr] = useState(
    [] as ImageFile[]
  );
  const [eventPosterArr, setEventPosterArr] = useState([] as ImageFile[]);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [isOpen1, setIsOpen1] = useState<boolean>(false);
  const [isOpen3, setIsOpen3] = useState<boolean>(false);
  const [isOpen2, setIsOpen2] = useState<boolean>(false);

  const [isStartDateOpen, setIsStartDateOpen] = useState<boolean>(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState<boolean>(false);

  const [eventDesc, setEventDesc] = useState<string>("Write something here");

  const selectImage = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageArray: React.Dispatch<React.SetStateAction<ImageFile[]>>,
    imageArr: React.SetStateAction<ImageFile[]>
  ) => {
    const { files } = e.target;
    if (!files) {
      return;
    }
    const newImages = Array.from(files || []).map((file) => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    setImageArray((prevImages) => [...prevImages, ...newImages]);
    const isImageSizeExceedsLimit = newImages.some(
      (image) => image.size > 2 * 1024 * 1024
    );
    console.log(
      "images size",
      isImageSizeExceedsLimit,
      newImages.map((i) => i.size)
    );
    if (newImages.length === 3) {
      alert("Please select only 3 images");
    }
    // console.log("newImages", newImages);
  };

  const deleteImage = (
    index: number,
    setImageArray: React.Dispatch<React.SetStateAction<ImageFile[]>>,
    imageArr: ImageFile[]
  ) => {
    const newImages = [...imageArr];
    newImages.splice(index, 1);
    setImageArray(newImages);
  };

  const country = countries.map((country) => country.name);

  function onCountryChange() {
    removeCountriesDropDownList();
    const eventCountry = document.getElementById("eventCountry");

    if (!eventCountry) {
      return;
    }
    const countryValue = (
      eventCountry as HTMLSelectElement
    )?.value.toLowerCase();

    const filteredInputValue: string[] = [];
    country.forEach((country) => {
      if (
        country.substring(0, countryValue.length).toLowerCase() === countryValue
      ) {
        filteredInputValue.push(country);
      }
    });
    countriesDropDownList(filteredInputValue);
  }

  function countriesDropDownList(list: string[]) {
    const countriesContainer = document.getElementById("countriesContainer");
    if (!countriesContainer) {
      return;
    }
    const ul = document.createElement("ul");
    ul.setAttribute("id", "countriesUl");
    ul.style.width = "100%";

    list.forEach((country) => {
      const li = document.createElement("li");
      li.setAttribute("id", "countriesLi");
      li.innerHTML = country;
      ul.appendChild(li);

      li.addEventListener("click", () => {
        const eventCountry = document.getElementById("eventCountry");
        if (!eventCountry) {
          return;
        }
        (eventCountry as HTMLSelectElement).value = country;
        removeCountriesDropDownList();
      });
    });
    countriesContainer.appendChild(ul);

    window.addEventListener("click", () => {
      removeCountriesDropDownList();
    });
  }

  function removeCountriesDropDownList() {
    const countriesContainer = document.getElementById("countriesContainer");
    if (!countriesContainer) {
      return;
    }
    countriesContainer.innerHTML = "";
  }
  // const [tipTapContent, setTiptapContent] = useState("");
  const [value, setValue] = useState("");

  return (
    <DateAndTimeAdapter>
      <div className="p-4">
        <h6 className="font-medium">Event information</h6>
      </div>
      <form className="w-[100%]" id="form" action={addEvent}>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-1 space-y-8">
            <CustomInput
              name="eventTitle"
              label="Event title"
              id="eventTitle"
              placeholder="Enter event title"
              type="text"
            />
            <div className="flex justify-between gap-2 relative">
              <span className="z-10 -top-2 translate-x-10 left-20 bg-white rounded-sm block text-xs text-basecolor absolute">
                {" "}
                Start date and time
              </span>
              <DateTimePicker
                open={isStartDateOpen}
                onOpen={() => setIsStartDateOpen(!isStartDateOpen)}
                onClose={() => setIsStartDateOpen(!isStartDateOpen)}
                name="startDateAndTime"
                slotProps={{
                  textField: {
                    // required: true,
                    placeholder: "Pick date and time",
                    InputProps: {
                      className: "flex flex-row-reverse text-sm",
                      endAdornment: (
                        <img
                          src={"/date-time.svg"}
                          alt="calendar-icon"
                          width={25}
                          height={25}
                          className="cursor-pointer"
                          onClick={() => setIsStartDateOpen(!isStartDateOpen)}
                        />
                      ),
                    },
                  },
                }}
                sx={{
                  width: "100%",
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
              <span className="span text-xs text-basecolor">
                {" "}
                End date and time
              </span>
              <DateTimePicker
                open={isEndDateOpen}
                onOpen={() => setIsEndDateOpen(!isEndDateOpen)}
                onClose={() => setIsEndDateOpen(!isEndDateOpen)}
                name="endDateAndTime"
                slotProps={{
                  textField: {
                    // required: true,
                    placeholder: "Pick date and time",
                    InputProps: {
                      className: "flex flex-row-reverse",
                      endAdornment: (
                        <img
                          src={"/date-time.svg"}
                          alt="calendar-icon"
                          width={25}
                          height={25}
                          className="cursor-pointer"
                          onClick={() => setIsEndDateOpen(!isEndDateOpen)}
                        />
                      ),
                    },
                  },
                }}
                sx={{
                  width: "100%",
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
              name="eventVisibility"
              id="eventVisibility"
            />
            <CustomSelect
              label="Industry"
              placeholder="Please select"
              name="industry"
              id="industry"
            />

            <CustomSelect
              label="Event category"
              placeholder="Please select"
              name="eventCategory"
              id="eventCategory"
            />
            <CustomInput
              name="noOfParticipants"
              label="Number of Participants"
              id="noOfParticipants"
              type="number"
              placeholder="0"
            />
            <CustomSelect
              label="Location type"
              placeholder="Please select"
              name="locationType"
              id="locationType"
            />
            <div className="flex justify-between gap-4">
              <CustomInput
                name="eventAddress"
                label="Event address"
                type="text"
                id="eventAddress"
                containerClassName="w-1/2"
                placeholder="Enter address"
              />
              <div className="w-1/2 relative">
                <CustomInput
                  name="eventCountry"
                  label="Event country"
                  type="text"
                  id="eventCountry"
                  containerClassName="w-full"
                  placeholder="Enter country"
                  onInput={onCountryChange}
                />
                <span
                  id="countriesContainer"
                  className="absolute z-10 text-basecolor mt-2 w-full"
                ></span>
              </div>
            </div>
            <div className="p-4 w-[100%] rounded-md border border-[#f3f3f3] sm:text-sm relative">
              <Camera
                size={20}
                onClick={() => {
                  eventPosterArr.length < 3 && selectImage(posterInputRef);
                }}
                role="button"
              />
              <CustomInput
                name="eventPoster"
                type="file"
                label="Event poster"
                labelClassName="label-style"
                accept="image/*"
                inputClassName="hidden"
                multiple
                id="eventPoster"
                placeholder="Select image"
                fileInputRef={posterInputRef}
                onChange={(e) => {
                  handleFileChange(e, setEventPosterArr, eventPosterArr);
                  console.log("value", e.target.value);
                }}
                value={eventPosterArr.map((poster) => poster.url).join(", ")}
              />
            </div>
            <span className="description-text">
              Image size should be 1080px by 1080px
            </span>
            <div className="flex space-x-2 items-center">
              {eventPosterArr.map((poster, index) => {
                return (
                  <div className="image relative w-32" key={index}>
                    <span
                      className="delete-btn"
                      onClick={() =>
                        deleteImage(index, setEventPosterArr, eventPosterArr)
                      }
                      role="button"
                    >
                      &times;
                    </span>
                    <img
                      src={poster.url}
                      alt={poster.name}
                      className="rounded-sm"
                      width={200}
                      height={`auto`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="p-4 w-[100%] rounded-md border border-[#f3f3f3] sm:text-sm relative">
              <Camera
                size={20}
                onClick={() => {
                  organisationLogoArr.length < 1 && selectImage(logoInputRef);
                }}
                role="button"
              />
              <CustomInput
                name="organisationLogo"
                label="Organisation logo"
                labelClassName="label-style"
                type="file"
                accept="image/*"
                id="organisationLogo"
                placeholder="Select image"
                inputClassName="hidden"
                onChange={(e) => {
                  handleFileChange(
                    e,
                    setOrganisationLogoArr,
                    organisationLogoArr
                  );
                }}
                fileInputRef={logoInputRef}
                value={organisationLogoArr.map((logo) => logo.url).join(", ")}
              />
            </div>

            <span className="description-text">
              Image size should be 1080px by 1080px
            </span>
            <div className="flex space-x-2 items-center">
              {organisationLogoArr.map((logo, index) => {
                return (
                  <div className="image relative w-40" key={index}>
                    <span
                      className="delete-btn"
                      onClick={() =>
                        deleteImage(
                          index,
                          setOrganisationLogoArr,
                          organisationLogoArr
                        )
                      }
                      role="button"
                    >
                      &times;
                    </span>
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="rounded-sm"
                      width={200}
                      height={`auto`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="px-4 space-y-6">
            <TextEditor />
            <CustomSelect
              label="Pricing currency"
              placeholder="Please select currency"
              containerClassName="mt-10"
              name="pricingCurrency"
              id="pricingCurrency"
            />
            <div className="border-2 border-[#f3f3f3] p-4 rounded-md space-y-5 pb-10">
              <h5>Pricing</h5>
              <div className="flex items-center gap-2 relative">
                <CustomInput
                  name="earlyBird"
                  label="Early bird"
                  id="earlyBird"
                  type="number"
                  containerClassName="w-1/2"
                  placeholder="Enter price"
                />
                <span className="span text-xs text-basecolor"> Validity</span>
                <DatePicker
                  open={isOpen1}
                  onOpen={() => setIsOpen1(!isOpen1)}
                  onClose={() => setIsOpen1(!isOpen1)}
                  name="earlyBirdValidity"
                  className="w-1/2"
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
                            onClick={() => setIsOpen1(!isOpen1)}
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
              <div className="flex items-center  justify-between gap-2 relative">
                <CustomInput
                  name="standard"
                  label="Standard"
                  id="standard"
                  type="number"
                  containerClassName="w-1/2"
                  placeholder="Enter price"
                />
                <span className="span text-xs text-basecolor"> Validity</span>
                <DatePicker
                  open={isOpen2}
                  onOpen={() => setIsOpen2(!isOpen2)}
                  onClose={() => setIsOpen2(!isOpen2)}
                  name="standardValidity"
                  className="w-1/2"
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
                            onClick={() => setIsOpen2(!isOpen2)}
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
              <div className="flex items-center justify-between gap-2 relative">
                <CustomInput
                  name="lateBird"
                  label="Late bird"
                  id="lateBird"
                  type="number"
                  containerClassName="w-1/2"
                  placeholder="Enter price"
                />
                <span className="span text-xs text-basecolor"> Validity</span>
                <DatePicker
                  open={isOpen3}
                  onOpen={() => setIsOpen3(!isOpen3)}
                  onClose={() => setIsOpen3(!isOpen3)}
                  name="lateBirdValidity"
                  className="w-1/2"
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
                            onClick={() => setIsOpen3(!isOpen3)}
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
            </div>
          </div>
        </div>
      </form>
    </DateAndTimeAdapter>
  );
}
