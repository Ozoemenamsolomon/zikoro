"use client";
import Image from "next/image";
import { useState } from "react";
import { NotificationsActive } from "@styled-icons/material-outlined/NotificationsActive";
import { AngleUp } from "@styled-icons/fa-solid/AngleUp";
import { AngleDown } from "@styled-icons/fa-solid/AngleDown";
import Link from "next/link";

export default function HomePage() {
  const [hide, setHide] = useState(false);
  return (
    <div className="h-full w-screen bg-white">
      <div>
        <div className="relative text-center">
          <div className="hero-text absolute">
            <h1 className="w-[1000px] text-5xl font-extrabold text-white leading-snug">
              All-in-one event management platform <br /> for all kinds of
              events
            </h1>
            <p className="text-lg px-20 my-8 font-medium text-white">
              Effortlessly sell multi-tier event tickets, engage your attendees,
              impress and deliver data-driven results to your event sponsors and
              exhibitors. It's easy to get started. And it's free. 
            </p>
            <div>
              <button className="w-32 h-14 bg-white text-bluebg font-semibold rounded-md border-none">
                Start for free
              </button>
              <p className="text-white font-medium text-xs pt-3">
                Free 14-days trial. No credit card required.
              </p>
            </div>
          </div>
          <Image
            src="/herobg.png"
            alt="home image"
            width={900}
            height={500}
            className="w-full h-full"
          />

          <div className="mobile-display-img">
            <img
              src="/mobile-display.svg"
              alt="screen-display"
              style={{ maxWidth: "1100px", height: "100%" }}
            />
          </div>
        </div>
        <div className="bg-[#EEF0FF]">
          <div className="h-80 bg-white"></div>
          <img
            src="/divider-img.svg"
            alt="divider image"
            className="h-16 w-full opacity-30 border-t-2 border-bluebg"
          />
          <div className="text-center py-16">
            <p className="text-[#15161B] text-4xl font-semibold">
              Made for people. Built for engagements & connections.
            </p>
            <div className="grid grid-cols-3 justify-items-center mx-12 text-[#3E404B] my-10">
              <div className="flex justify-center items-center space-x-3">
                <img
                  src="/time.svg"
                  alt="time"
                  width={40}
                  height={40}
                  className=""
                />
                <div className="text-start font-semibold w-40">
                  <p className="text-4xl">10%</p>
                  <p>minutes to publish an event</p>
                </div>
              </div>
              <div className="flex justify-center items-center space-x-3">
                <img
                  src="/person.svg"
                  alt="time"
                  width={40}
                  height={40}
                  className=""
                />
                <div className="text-start font-semibold w-40">
                  <p className="text-4xl">100%</p>
                  <p>Attendee engagement</p>
                </div>
              </div>
              <div className="flex justify-center items-center space-x-3">
                <img
                  src="/roi.svg"
                  alt="roi"
                  width={50}
                  height={50}
                  className=""
                />
                <div className="text-start font-semibold w-40">
                  <p className="text-4xl">80%</p>
                  <p>Increase in ROI</p>
                </div>
              </div>
            </div>
          </div>
          <img
            src="/divider-img.svg"
            alt="divider image"
            className="h-16 w-full opacity-30 border-b-2 border-bluebg"
          />
        </div>
        <div>
          <div className="flex flex-col text-center items-center mt-8">
            <h3 className="text-3xl text-bluebg uppercase">Features</h3>
            <p className="text-[#15161B] text-4xl leading-snug font-semibold my-4">
              See what you get from the most practical event <br />
              management platform
            </p>
            <div className="mt-3">
              <ul className="flex space-x-6 text-[#717171]">
                <li className="p-4 border-b-2 text-bold border-bluebg text-bluebg">
                  Ticketing & Registeration
                </li>
                <li className="p-4">Digital Credentialing</li>
                <li className="p-4">Event Management</li>
                <li className="p-4">Attendee Engagement</li>
                <li className="p-4">Gamification</li>
                <li className="p-4">Exhibitor's Hub </li>
              </ul>
            </div>
            <div
              className="grid text-start m-6 text-[#3E404B] gap-16"
              id="features"
            >
              <div className="px-6 flex justify-between items-center gap-6 w-100">
                <div className="shadow-sm py-4 px-6 h-72 w-full">
                  <Image
                    src="/document.svg"
                    alt="time"
                    width={50}
                    height={50}
                  />
                  <h6 className="font-semibold text-xl py-4">
                    Dedicated event landing page
                  </h6>
                  <p className="text-base">
                    Streamline your event experience, providing a centralized
                    and user-friendly space for all your event-related needs.
                    Attendees can directly register and buy tickets from your
                    dedicated landing page.
                  </p>
                </div>
                <div className="shadow-sm py-4 px-6  h-72 w-full">
                  <Image src="/ticket.svg" alt="time" width={50} height={50} />
                  <h6 className="font-semibold text-xl py-6">
                    Multi-tier ticketing
                  </h6>
                  <p className="text-base">
                    Effortlessly offer a range of ticket options with limited
                    validity, offering attendees diverse access and benefits.
                    Our platform gives you complete control over the success of
                    your event.
                  </p>
                </div>

                <div className="shadow-sm py-4 px-6  h-72 w-full">
                  <NotificationsActive size={50} />
                  <h6 className="font-semibold text-xl py-6">
                    Payment reminders
                  </h6>
                  <p className="text-base">
                    We make event organization easier with personalized payment
                    reminders. Choose your frequency and timing preferences, and
                    leave the rest to Zikoro!
                  </p>
                </div>
              </div>

              <div
                className={`px-6 flex items-center w-100 gap-6  ${
                  !hide ? "hidden" : ""
                }`}
              >
                <div className="shadow-sm py-4 px-6 h-72 w-full">
                  <Image
                    src="/payment.svg"
                    alt="payment"
                    width={50}
                    height={50}
                  />
                  <h6 className="font-semibold text-xl py-6">
                    Payment processing
                  </h6>
                  <p className="text-base">
                    Build trust with your customers and enhance their overall
                    satisfaction. We offer a payment experience that is not only
                    secure but also versatile.
                  </p>
                </div>
                <div className="shadow-sm py-4 px-6 h-72 w-full">
                  <Image
                    src={"/discount.svg"}
                    alt="discount"
                    width={50}
                    height={50}
                  />
                  <h6 className="font-semibold text-xl py-6">
                    Volume discounts
                  </h6>
                  <p className="text-base">
                    Encourage group participation, making it more enticing for
                    attendees to bring their friends, colleagues, or teams.
                    Drive attendance by making group participation
                    cost-effective and rewarding.
                  </p>
                </div>
                <div className="shadow-sm py-4 px-6 h-72 w-full">
                  <Image src="/coupon.svg" alt="time" width={50} height={50} />
                  <h6 className="font-semibold text-xl py-6">
                    Discount coupons
                  </h6>
                  <p className="text-base">
                    Generate unique codes, set discount values or percentages,
                    and define usage limitations to align with your event's
                    goal.
                  </p>
                </div>
              </div>
              <div
                className={`px-6 flex items-center w-100 gap-6  ${
                  !hide ? "hidden" : ""
                }`}
              >
                <div className="shadow-sm py-4 px-6 h-72 w-full">
                  <Image src="/invoice.svg" alt="time" width={40} height={40} />
                  <h6 className="font-semibold text-xl py-6">
                    Event invoicing
                  </h6>
                  <p className="text-base">
                    Creating and sending professional invoices for your events
                    is easy on our platform. Customize your invoices with your
                    event branding and essential details.
                  </p>
                </div>
                <div className="shadow-sm py-4 px-6 h-72 w-full">
                  <Image src="/invite.svg" alt="time" width={50} height={50} />
                  <h6 className="font-semibold text-xl py-6">
                    Track invite list
                  </h6>
                  <p className="text-base">
                    Our app provides a seamless experience for organizing and
                    managing your guest list. The intuitive interface lets you
                    quickly identify confirmed attendees, send reminders, and
                    update guest information on the fly.
                  </p>
                </div>
                <div className="shadow-sm py-4 px-6 h-72 w-full">
                  <Image
                    src="/attendee-data.svg"
                    alt="attendee"
                    width={50}
                    height={50}
                  />
                  <h6 className="font-semibold text-xl py-6">
                    Import and export attendees registration data
                  </h6>
                  <p className="text-base">
                    Effortlessly manage attendee information to best suit your
                    event's unique requirements, with unparalleled ease of
                    movement in and out of the system. Stay organized and in
                    control.
                  </p>
                </div>
              </div>
              <div className="text-end px-6">
                <span
                  className="text-bluebg pointer-events-auto cursor-pointer"
                  onClick={() => setHide(!hide)}
                >
                  {hide ? (
                    <span>
                      See less <AngleUp size="15" />
                    </span>
                  ) : (
                    <span>
                      See more <AngleDown size="15" />
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 justify-items-stretch items-center  text-[#3E404B]">
              <div className="text-start pl-6 mt-2">
                <p className="text-3xl font-bold">
                  Attendees, sponsors, and exhibitors will not just attend –
                  they'll thank you for an exceptional experience.
                </p>
                <p className="py-10 leading-8">
                  Practical features that offer a personalised experience for
                  everyone. Keep event participants updated about any
                  last-minute changes to the agenda and gamify every aspect of
                  your event.
                </p>
                <button className="bg-bluebg text-white py-4 px-10 rounded-md">
                  Start for free
                </button>
              </div>
              <div className="mt-2 justify-self-end">
                <Image
                  src="/Frame99.svg"
                  alt="frame"
                  width={700}
                  height={400}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 relative mt-36">
              <div>
                <Image
                  src={"/Analytics.svg"}
                  alt={"analytics"}
                  width={600}
                  height={600}
                />
                <Image
                  src={"/Payments.svg"}
                  alt={"payments"}
                  width={600}
                  height={600}
                  className="
                  absolute
                  left-[10rem]
                  -top-8 transform -translate-y-20"
                />
              </div>
              <div className="text-start px-6 text-[#3E404B]">
                <p className="text-3xl font-semibold">
                  Maximize your event ROI
                </p>
                <p className="py-6 leading-8">
                  Significantly maximize your revenue and cut down event costs
                  with Zikoro. Increase your exhibitors' and sponsors'
                  visibility and engagement. With our platform, you can also
                  access real-time analytics to measure the impact of their
                  participation.
                </p>
                <button className="bg-bluebg text-white py-4 px-10 rounded-md">
                  See pricing
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 justify-items-center items-center text-[#3E404B] my-36">
              <div className="text-start pl-6">
                <p className="text-3xl font-semibold">
                  Easy registration and Ticketing
                </p>
                <p className="py-10 leading-8">
                  Create a personalized landing page for your events and sell
                  tickets with multiple tiers. You can track your event
                  attendees and ticket sales in real-time with the help of a
                  backend system. In addition, you can offer discount coupons
                  and automate every process, eliminating administrative
                  hassles.
                </p>
              </div>
              <div className="w-full flex justify-center items-center relative">
                <Image
                  src="/ticketing-frame3.svg"
                  alt="group-ticketing"
                  width={100}
                  height={100}
                  className="w-[500px] absolute"
                />{" "}
                <Image
                  src="/ticketing-frame2.svg"
                  alt="group-ticketing"
                  width={100}
                  height={100}
                  className="w-[500px] absolute top-0 right-0"
                />{" "}
                <Image
                  src="/ticketing-frame1.svg"
                  alt="group-ticketing"
                  width={100}
                  height={100}
                  className="w-[500px] absolute -top-[28rem] right-0
                  "
                />
              </div>
            </div>
            <div className="grid grid-cols-2 justify-items-center items-center text-[#3E404B]">
              <div className="w-full flex justify-center items-center">
                <Image
                  src="/group-event.svg"
                  alt="group-events"
                  width={100}
                  height={100}
                  className="w-[550px]"
                />
              </div>
              <div className="text-start pl-6">
                <p className="text-3xl font-semibold">
                  Facilitate connections that go beyond
                  <br />
                  your event.
                </p>
                <p className="py-10 leading-8">
                  Foster meaningful connections between event speakers and
                  attendees well before the event begins. Leverage our platform
                  to initiate engaging conversations and gain valuable insights
                  through interactive polls, social walls, photos and discussion
                  channels.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 justify-items-center items-center text-[#3E404B] my-36">
              <div className="text-start pl-6">
                <p className="text-3xl font-semibold">
                  Amplify your events sales through
                  <br /> affiliates
                </p>
                <p className="py-10">
                  Empower partners to easily promote your events and earn
                  commissions while you effortlessly track their performance.
                </p>
                <button className="bg-bluebg text-white py-4 px-10 rounded-md">
                  Learn more
                </button>
              </div>
              <div className="w-full flex justify-center items-center relative">
                <Image
                  src="/affiliate-frame2.svg"
                  alt="group-ticketing"
                  width={100}
                  height={100}
                  className="w-[500px] absolute"
                />
                <Image
                  src="/affiliate-frame1.svg"
                  alt="group-ticketing"
                  width={100}
                  height={100}
                  className="w-[500px] absolute -top-[20rem] left-0"
                />
              </div>
            </div>

            <div className="bg-[#EEF0FF]">
              <img
                src="/divider-img.svg"
                alt="divider image"
                className="h-16 w-full opacity-30 border-t-2 border-bluebg"
              />
              <div className="text-center py-16">
                <p className="text-[#15161B] text-3xl font-semibold w-4/6 mx-auto">
                  Ready to execute impactful and memorable events that resonate
                  with participants?
                </p>
                <div className="text-center space-x-4 my-10">
                  <button className="bg-bluebg text-white py-4 px-10 rounded-md">
                    Get started
                  </button>
                  <Link
                    href="/contact"
                    className="border border-bluebg text-bluebg text-semibold py-4 px-10 rounded-md"
                  >
                    Contact sales
                  </Link>
                </div>
              </div>
            </div>
            {/* Footer */}
          </div>
        </div>
      </div>
    </div>
  );
}
