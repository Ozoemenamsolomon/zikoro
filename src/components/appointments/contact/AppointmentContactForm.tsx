"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const AppointmentContactForm = () => {
  const [mailSent, setMailSent] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitForm = async (e: any) => {
    e.preventDefault();
    console.log(formData)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });

      if (response.ok) {
        toast.success("Submitted Successfully:");
        // Optionally, reset form fields after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
        setMailSent(true);
      } else {
        throw new Error("Message Not Sent ");
      }
    } catch (error) {
      toast.error(`Error submitting contact form: ${error}`);
    }

  };

  return (
    <div className="bg-white rounded-[8px] max-w-full lg:max-w-[400px]  ">
      {mailSent ? (
        <div className="flex flex-col items-center h-[50vh] justify-center">
          <Image
            src="/appointments/bookingsMessage.png"
            width={82}
            height={82}
            alt=""
            className="w-[82px] h-[82px]"
          />
          <div className="mt-4">
            <p className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-2xl font-bold leading-none ">
              Message sent
            </p>
            <p className="text-[12px] mt-2">we will get back to you soon 🤞</p>
          </div>
        </div>
      ) : (
        <form action="" className="mt-10" onSubmit={submitForm}>
          <div className="flex flex-col gap-y-3 ">
            <label htmlFor="">First Name</label>
            <input
              required
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
              className="border-[1px] border-gray-200 px-[10px] py-4 w-full text-base rounded-[6px] outline-none"
            />
          </div>
          <div className="flex flex-col gap-y-3 mt-6 ">
            <label htmlFor="">Last Name</label>
            <input
              required
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter Last Name"
              className="border-[1px] border-gray-200 px-[10px] py-4 w-full text-base rounded-[6px] outline-none"
            />
          </div>
          <div className="flex flex-col gap-y-3 mt-6">
            <label htmlFor="">Email Address</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email Address"
              className="border-[1px] border-gray-200 px-[10px] py-4 w-full text-base rounded-[6px] outline-none"
            />
          </div>
          <div className="flex flex-col gap-y-3 mt-6">
            <label htmlFor="">Message</label>
            <textarea
              required
              name="message"
              value={formData.message}
              onChange={handleChange}
              id=""
              cols={30}
              rows={10}
              className="border-[1px] border-gray-200 px-[10px] py-4 text-base rounded-[6px] h-full outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="py-4 px-3 text-base w-full rounded-[8px] font-semibold mt-10 mb-6 text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end"
          >
            Get Started
          </button>
        </form>
      )}
    </div>
  );
};

export default AppointmentContactForm;
