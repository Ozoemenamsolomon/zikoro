"use client";
import React from "react";

import { CustomInput } from "@/components/CustomInput";

function Contact() {
  return (
    <>
      <div className="p-4">
        <h6 className="font-medium">Contact information</h6>
      </div>
      <form className="w-[100%]" action="" method="post" id="form">
        <div className="grid grid-cols-2">
          <div className="p-4 space-y-10">
            <CustomInput
              label="Organisation name"
              id="eventTitle"
              placeholder="Enter event title"
              type="text"
            />

            <CustomInput
              id="country"
              label="Country"
              placeholder="Select country"
            />
            <CustomInput
              label="Phone number"
              id="telephone"
              type="tel"
              placeholder="+234"
            />
            <CustomInput
              label="Whatsapp number"
              id="telephone"
              type="tel"
              placeholder="Enter whatsapp number"
            />
            <CustomInput
              label="Email"
              id="email"
              placeholder="Enter email address"
              type="text"
            />
          </div>
          <div className="p-4 space-y-10 mb-5 mt-5 mr-5 border rounded-md ">
            <h6 className="text-bold">Social media profile</h6>
            <div className="relative">
              <CustomInput
                label="Twitter"
                id="email"
                placeholder="https://www.x.com/"
                type="text"
              />
              <img
                src="/twitter.svg"
                className="text-sm text-black absolute top-5 ml-2 right-4 p-1 "
              />
            </div>
            <div className="relative">
              <CustomInput
                label="LinkedIn"
                id="email"
                placeholder="https://www.linkedin.com/"
                type="text"
              />
              <img
                src="/linkedin.svg"
                className="text-sm text-black absolute top-5 ml-2 right-4 p-1 "
              />
            </div>
            <div className="relative">
              <CustomInput
                label="Instagram"
                id="email"
                placeholder="https://www.instagram.com/"
                type="text"
              />
              <img
                src="/instagram.svg"
                className="text-sm text-black absolute top-5 ml-2 right-4 p-1 "
              />
            </div>
            <div className="relative">
              <CustomInput
                label="Facebook"
                id="email"
                placeholder="https://www.facebook.com/"
                type="text"
              />
              <img
                src="/twitter.svg"
                className="text-sm text-black absolute top-5 ml-2 right-4 p-1 "
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Contact;
