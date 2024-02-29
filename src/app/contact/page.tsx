"use client";
import Image from "next/image";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { useState, useEffect } from "react";
import countries from "@/../../countrylist.json";
import { CustomTextBox } from "@/components/CustomTextbox";
import { Button } from "@/components";
import Link from "next/link";

export default function Contact() {
  const [dialCode, setDialCode] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [noOfEvents, setNoOfEvents] = useState({
    one: false,
    twoToFive: false,
    sixToTen: false,
    elevenPlus: false,
  });
  // function to find country dial code
  const findDialCode = (countryName: string) => {
    const country = countries.find(
      (country: any) => country.name === countryName
    );
    if (country) {
      console.log("dialcode", country.dial_code);
      setDialCode(country.dial_code);
      setWhatsappNumber(country.dial_code);
      return country.dial_code;
    }
    return null;
  };

  useEffect(() => {
    findDialCode(selectedCountry);
  }, [selectedCountry]);

  return (
    <div className="relative">
      <Image
        src="/background-contact.svg"
        alt="background"
        height={100}
        width={100}
        className="w-full h-full"
      />
      <div className="absolute grid grid-cols-2 top-0 left-0 text-white justify-evenly items-center">
        <div className="p-10">
          <p className="text-3xl font-semibold w-5/6 leading-10">
            Connect with us, let's create memorable and impactful events
            together.
          </p>
          <p
            className="
          mt-2"
          >
            We are here to ensure that your event journey is smooth and
            engaging. Whether you have questions, need assistance, or want to
            explore how Zikoro can help you, our team is always ready to help.
            Zikoro powers events of all sizes, whether onsite, virtual, or
            hybrid
          </p>
        </div>

        <div className="bg-white px-8 py-6 my-6 mr-6 rounded-md">
          <p className="text-black font-medium text-xl my-4">Contact us</p>
          <form>
            <div className="grid grid-cols-2 gap-y-8 gap-x-6">
              <CustomInput
                label="First name"
                name="firstName"
                id="firstName"
                labelClassName="px-2"
                placeholder="Enter first name"
              />
              <CustomInput
                label="Last name"
                name="lastName"
                id="lastName"
                labelClassName="px-2"
                placeholder="Enter last name"
              />
              <CustomInput
                label="City"
                name="city"
                id="city"
                labelClassName="px-2"
                placeholder="Enter city"
              />
              <CustomSelect
                label="Country"
                name="country"
                id="country"
                placeholder="Select country"
                onValueChange={(value: string) => setSelectedCountry(value)}
              />
              <CustomInput
                label="Email"
                name="email"
                id="email"
                labelClassName="px-2"
                placeholder="Enter email"
              />
              <CustomInput
                name="phoneNumber"
                label="Phone number"
                id="phoneNumber"
                labelClassName="px-2"
                type="tel"
                placeholder="+234"
                value={dialCode ?? ""}
                onChange={(e) => {
                  setDialCode(e.target.value);
                }}
              />
            </div>
            <p className="text-basecolor text-sm mt-7 mb-4">
              How many events do you organize annually?
            </p>
            <div className="flex space-x-8 items-center text-basecolor">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="one"
                  value={"1"}
                  className="w-4 h-4"
                  onClick={() =>
                    setNoOfEvents({
                      one: !noOfEvents.one,
                      twoToFive: false,
                      sixToTen: false,
                      elevenPlus: false,
                    })
                  }
                  checked={noOfEvents.one}
                />
                <span>Only 1</span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="twoToFive"
                  value={"2-5"}
                  className="w-4 h-4"
                  onClick={() =>
                    setNoOfEvents({
                      one: false,
                      twoToFive: !noOfEvents.twoToFive,
                      sixToTen: false,
                      elevenPlus: false,
                    })
                  }
                  checked={noOfEvents.twoToFive}
                />
                <span>2 - 5</span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="sixToTen"
                  value={"6-10"}
                  className="w-4 h-4 text-#F3F3F3"
                  onClick={() =>
                    setNoOfEvents({
                      one: false,
                      twoToFive: false,
                      sixToTen: !noOfEvents.sixToTen,
                      elevenPlus: false,
                    })
                  }
                  checked={noOfEvents.sixToTen}
                />
                <span>6 - 10</span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="moreThanTen"
                  value={"more than 10"}
                  className="w-4 h-4"
                  onClick={() =>
                    setNoOfEvents({
                      one: false,
                      twoToFive: false,
                      sixToTen: false,
                      elevenPlus: !noOfEvents.elevenPlus,
                    })
                  }
                  checked={noOfEvents.elevenPlus}
                />
                <span>More than 10</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-10 mb-6">
              <CustomInput
                label="Expected attendees"
                type="number"
                name="expectedAttendees"
                labelClassName="px-2"
                id="expectedAttendees"
                placeholder="No of attendees"
              />
              <CustomSelect
                label="Industry"
                name="industry"
                id="industry"
                placeholder="Select industry"
              />
            </div>
            <CustomTextBox
              label="How can we help you?"
              id="message"
              name="message"
              placeholder="Write something here"
            />
            <Button className="w-full mt-5 bg-zikoro py-6">Submit</Button>
            <span className="description-text">
              By clicking the button below, you consent to allow Zikoro to store
              and process your information by our{" "}
              <Link href="www.zikoro.com/privacy" target="_blank">
                Privacy Policy
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
