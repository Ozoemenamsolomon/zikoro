"use client";
import { useState, useRef, useMemo } from "react";
import { CustomSelect } from "@/components/content/CustomSelect";
import { CustomInput } from "@/components/content/CustomInput";
import { DateAndTimeAdapter } from "@/context/DateAndTimeAdapter";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { addEvent } from "@/app/server-actions/addEvent";
import { Camera } from "@styled-icons/feather/Camera";
import { COUNTRY_CODE } from "@/utils";
import TextEditor from "@/components/content/TextEditor";
import { ContentTabs } from "../_components/ContentTabs";
import { SideBarLayout } from "@/components";
import { ContentTopNav } from "@/components/content/topNav";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  Input,
  InputOffsetLabel,
  ReactSelect,
} from "@/components";

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

export default function UpdateEvent({
  eventId,
}: {
  eventId: string;
}): JSX.Element {
  const form = useForm({});
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
  const [priceValidities, setPriceValidities] = useState([]);

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

  const country = COUNTRY_CODE.map((country) => country.name);

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
  const countriesList = useMemo(() => {
    return COUNTRY_CODE.map((country) => ({
      label: country.name,
      value: country.name,
    }));
  }, [COUNTRY_CODE]);

  return (
    <DateAndTimeAdapter>
      <SideBarLayout
        hasTopBar
        className="px-0 sm:px-0 pt-14 sm:pt-14"
        parentClassName="px-0 sm:px-0 py-0 sm:py-0 pt-3 sm:pt-4"
        eventId={eventId}
      >
        <ContentTopNav />
        <div className="w-full p-4">
          <h6 className="font-medium">Event information</h6>
        </div>
        <Form {...form}>
          <form className="w-full px-4 h-full " id="form" action={addEvent}>
            <div className="w-full grid grid-cols-2 gap-6">
              <div className="p-1 space-y-8">
                <FormField
                  control={form.control}
                  name="eventTitle"
                  render={({ field }) => (
                    <InputOffsetLabel label="Event title">
                      <Input
                        placeholder="Enter event title"
                        type="text"
                        {...form.register("eventTitle")}
                        className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                      />
                    </InputOffsetLabel>
                  )}
                />
                <div className="flex justify-between gap-2 relative">
                  <FormField
                    control={form.control}
                    name="startDateTime"
                    render={() => (
                      <InputOffsetLabel label="Start date and time">
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
                                    onClick={() =>
                                      setIsStartDateOpen(!isStartDateOpen)
                                    }
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
                      </InputOffsetLabel>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDateTime"
                    render={({ field }) => (
                      <InputOffsetLabel label="End date and time">
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
                                    onClick={() =>
                                      setIsEndDateOpen(!isEndDateOpen)
                                    }
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
                      </InputOffsetLabel>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="eventVisibility"
                  render={({ field }) => (
                    <ReactSelect
                      label="Event visibilty"
                      {...field}
                      options={[]}
                      placeHolder="Please select"
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <ReactSelect
                      label="Industry"
                      {...field}
                      options={[]}
                      placeHolder="Please select"
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventCategory"
                  render={({ field }) => (
                    <ReactSelect
                      label="Event category"
                      {...field}
                      options={[]}
                      placeHolder="Please select"
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="noOfParticipants"
                  render={({ field }) => (
                    <InputOffsetLabel label="Number of Participants">
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                      />
                    </InputOffsetLabel>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationType"
                  render={({ field }) => (
                    <ReactSelect
                      label="Location type"
                      {...field}
                      options={[]}
                      placeHolder="Please select"
                    />
                  )}
                />
                <div className="flex justify-between gap-4">
                  <FormField
                    control={form.control}
                    name="eventAddress"
                    render={({ field }) => (
                      <InputOffsetLabel label="Event Address">
                        <Input
                          type="text"
                          placeholder="Enter Event Address"
                          {...field}
                          className=" placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700"
                        />
                      </InputOffsetLabel>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventCountry"
                    render={({ field }) => (
                      <ReactSelect
                        {...field}
                        placeHolder="Select the Country"
                        label="Event Country"
                        options={countriesList}
                      />
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="eventPoster"
                    render={({ field }) => (
                      <label
                        htmlFor="add-poster"
                        className="w-full border border-gray-200 relative rounded-lg flex items-center justify-start h-12"
                      >
                        <span className="absolute -top-2 z-30 right-4 bg-white text-gray-600 text-xs px-1">
                          Event Poster
                        </span>
                        <div className="flex px-4 items-center gap-x-3">
                          <Camera size={20} />
                          <p className="text-gray-400">Add Poster</p>
                        </div>
                        <input
                          type="file"
                          id="add-poster"
                          {...form.register("eventPoster")}
                          className="w-full h-full absolute inset-0 z-10"
                          accept="image/*"
                          hidden
                        />
                      </label>
                    )}
                  />

                  <span className="description-text">
                    Image size should be 1080px by 1080px
                  </span>
                </div>

                <div className="flex space-x-2 items-center">
                  {eventPosterArr.map((poster, index) => {
                    return (
                      <div className="image relative w-32" key={index}>
                        <span
                          className="delete-btn"
                          onClick={() =>
                            deleteImage(
                              index,
                              setEventPosterArr,
                              eventPosterArr
                            )
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

                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="organisationLogo"
                    render={({ field }) => (
                      <label
                        htmlFor="add-logo"
                        className="w-full border border-gray-200 relative rounded-lg flex items-center justify-start h-12"
                      >
                        <span className="absolute -top-2 z-30 right-4 bg-white text-gray-600 text-xs px-1">
                          Organization Logo
                        </span>
                        <div className="flex px-4 items-center gap-x-3">
                          <Camera size={20} />
                          <p className="text-gray-400">Add Logo</p>
                        </div>
                        <input
                          type="file"
                          id="add-logo"
                          {...form.register("eventPoster")}
                          className="w-full h-full absolute inset-0 z-10"
                          accept="image/*"
                          hidden
                        />
                      </label>
                    )}
                  />

                  <span className="description-text">
                    Image size should be 1080px by 1080px
                  </span>
                </div>

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
                  <div className="w-full flex flex-col items-start gap-y-4 justify-start">
                    {priceValidities.map((_, index) => (
                      <div key={index} className="w-full">
                        <div className="flex items-center gap-2 relative">
                          <CustomInput
                            name="earlyBird"
                            label="Early bird"
                            id="earlyBird"
                            type="number"
                            containerClassName="w-1/2"
                            placeholder="Enter price"
                          />
                          <span className="span text-xs text-basecolor">
                            {" "}
                            Validity
                          </span>
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
                          <span className="span text-xs text-basecolor">
                            {" "}
                            Validity
                          </span>
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
                          <span className="span text-xs text-basecolor">
                            {" "}
                            Validity
                          </span>
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
                    ))}
                  </div>
                  {/** */}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </SideBarLayout>
    </DateAndTimeAdapter>
  );
}
