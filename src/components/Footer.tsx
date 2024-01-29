"use client";
import Image from "next/image";
import { TwitterSquare } from "@styled-icons/fa-brands/TwitterSquare";
import { LinkedinSquare } from "@styled-icons/boxicons-logos/LinkedinSquare";
import { FacebookSquare } from "@styled-icons/boxicons-logos/FacebookSquare";
import { Instagram } from "@styled-icons/remix-fill/Instagram";
export const Footer = () => {
  return (
    <div className="grid bg-black text-white w-full pt-4">
      <div className="flex justify-start mb-6">
        <div className="flex flex-col p-4 ">
          <Image
            src="/zikoro1.svg"
            alt="zikoro logo"
            width={200}
            height={200}
            className="w-2/6 mb-7"
          />
          <p className="text-[10px] text-white w-3/6">
            2A Musari Apena Street, Ewu-Titan, off Labinjo Kalejaiye Street,
            Mafoluku, Oshodi, Lagos State, Nigeria
          </p>
        </div>
        <div>
          <div className="flex gap-20 justify-start text-start">
            <ul className="flex flex-col py-4 space-y-4 text-sm">
              <li className="text-lg font-medium">COMPANY</li>
              <li>About us</li>
              <li>Careers</li>
              <li>Contact us</li>
            </ul>
            <ul className="flex flex-col py-4 space-y-4 text-sm">
              <li className="text-lg font-medium">FEATURES</li>
              <li>Ticketing & Registration</li>
              <li> Digital Credentialing</li>
              <li>Event Management</li>
              <li>Attendee Experience</li>
              <li>Branding</li>
              <li>Exhibitors’ Hub</li>
            </ul>
            <ul className="flex flex-col py-4 space-y-4 text-sm">
              <li className="text-lg font-medium">USE CASES</li>
              <li>Conferences</li>
              <li>Tradeshows & Exhibitions</li>
              <li>Seminars & Workshops</li>
              <li>Networking</li>
              <li>Culture & Arts</li>
              <li>Celebrations</li>
              <li>Sports</li>
              <li>Job Fairs</li>
              <li>Festivals</li>
              <li>Charity</li>
            </ul>
            <ul className="flex flex-col py-4 space-y-4 text-sm">
              <li className="text-lg font-medium">RESOURCES</li>
              <li>Verify certificates</li>
              <li>Blog</li>
              <li>FAQ</li>
              <li>Affiliates</li> <li>API</li>
              <li>Legal</li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="w-full h-1" />
      <div className="flex justify-between p-10">
        <p>Copyright © 2022 - Zikoro</p>
        <div className="text-start">
          <p>Follow Zikoro</p>
          <div className="space-x-4 mt-2">
            <TwitterSquare className="w-8 h-8" />
            <LinkedinSquare className="w-8 h-8" />
            <FacebookSquare className="w-8 h-8" />
            <Instagram className="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};
