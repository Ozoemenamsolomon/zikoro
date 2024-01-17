"use client";
import { CustomInput } from "@/components/content/CustomInput";
import { CustomSelect } from "@/components/content/CustomSelect";
import { addContact } from "@/app/server-actions/addContact";
function Contact() {
  return (
    <>
      <div className="p-4">
        <h6 className="font-medium">Contact information</h6>
      </div>
      <form className="w-[100%]" action={addContact} id="form">
        <div className="grid grid-cols-2 mb-10 gap-6 px-4">
          <div className="py-4 space-y-10">
            <CustomInput
              name="organizationName"
              label="Organization name"
              id="organizationName"
              placeholder="Organization name"
              type="text"
            />
            <CustomSelect
              name="country"
              label="Country"
              id="country"
              placeholder="Select country"
            />

            <CustomInput
              name="phoneNumber"
              label="Phone number"
              id="phoneNumber"
              type="tel"
              placeholder="+234"
            />

            <CustomInput
              name="whatsappNumber"
              label="Whatsapp number"
              id="whatsappNumber"
              type="tel"
              placeholder="Enter whatsapp number"
            />
            <CustomInput
              name="email"
              label="Email"
              id="email"
              placeholder="Enter email address"
              type="text"
            />
          </div>
          <div className="p-4 mt-[1rem] space-y-10 border rounded-md ">
            <h6 className="text-bold">Social media profile</h6>
            <div className="relative">
              <CustomInput
                name="twitterUrl"
                label="Twitter"
                id="twitterUrl"
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
                name="linkedinUrl"
                label="LinkedIn"
                id="linkedinUrl"
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
                name="instagramUrl"
                label="Instagram"
                id="instagramUrl"
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
                name="facebookUrl"
                label="Facebook"
                id="facebookUrl"
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
