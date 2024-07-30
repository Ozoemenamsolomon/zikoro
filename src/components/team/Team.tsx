"use client";
import React, { useEffect, useState } from "react";
import { PlusCircleIcon, TeamIcon, TeamRemoveIcon } from "@/constants";
import { SearchAlt2 } from "styled-icons/boxicons-regular";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  useCreateTeamMember,
  useDeleteTeamMember,
} from "@/hooks/services/workspace";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { v4 as uuidv4 } from "uuid";

type FormDataType = {
  id: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  userRole: string;
};

export default function Team() {
  const [formData, setFormData] = useState<FormDataType>({
    id: "",
    firstName: "",
    lastName: "",
    userEmail: "",
    userRole: "",
  });

  const { organization } = useOrganizationStore();
  const { currentTeamMembers, createTeamMember } = useCreateTeamMember(
    organization?.id ?? 0
  );
  const { deleteTeamMember, fetchTeamMembers } = useDeleteTeamMember(
    organization?.id ?? 0
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const roles = ["owner", "editor", "collaborator"];

  // handles input change for search
  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  //handles input change
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateTeamMember = async (e: any) => {
    e.preventDefault();
    const newTeamMember = {
      id: uuidv4(), // Generate a unique ID
      userFirstName: formData.firstName,
      userLastName: formData.lastName,
      userEmail: formData.userEmail,
      userRole: formData.userRole,
    };

    const payload = {
      ...currentTeamMembers,
      teamMembers: [...currentTeamMembers?.teamMembers, newTeamMember],
    };
    await createTeamMember(payload);
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      userEmail: "",
      userRole: "",
    });
    createTeamMember();
  };

  const handleDeleteTeamMember = async (memberId: string) => {
    await deleteTeamMember(memberId);
    fetchTeamMembers();
  };

  // Filter team members based on search query
  const filteredTeamMembers = currentTeamMembers?.teamMembers?.filter(
    (member: any) =>
      member.userFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.userLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-[60px] ml-0 lg:ml-[12px] mr-0 lg:mr-[47px] pl-3 lg:pl-[24px] pr-3 lg:pr-[114px]">
      <div className="flex items-center gap-x-3">
        <TeamIcon />
        <p className="text-xl font-semibold"> Team Members</p>
      </div>

      <div className="mt-[52px] items-center justify-between flex flex-col lg:flex-row gap-y-3">
        {/* search */}
        <div className="px-[14px] py-[12px] flex gap-x-3 items-center w-full lg:w-[343px] border-[1px] border-indigo-600 rounded-md h-[52px]">
          <SearchAlt2 size={16} className="text-indigo-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border-0 outline-none h-full placeholder-black"
            placeholder=" Search..."
          />
        </div>
        {/* Invite team members */}
        <Dialog>
          <DialogTrigger className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end flex w-full lg:w-auto rounded-md gap-x-3 items-center px-[20px] h-[52px] cursor-pointer">
            <PlusCircleIcon />
            <p className="font-medium text-white text-base">
              Invite team members
            </p>
          </DialogTrigger>
          <DialogContent className="w-full max-w-full lg:max-w-[1000px] xl:max-w-[1120px] px-1 lg:px-10">
            <DialogHeader>
              <DialogDescription className="mt-8">
                <p className="text-2xl font-semibold text-black">
                  Invite Team Member
                </p>

                <form
                  action=""
                  onSubmit={handleCreateTeamMember}
                  className="my-10"
                >
                  <div className="flex flex-col lg:flex-row gap-4 mt-10 ">
                    <div className=" w-full lg:w-[450px] xl:w-[500px]">
                      <p className="text-[14px] text-[#1f1f1f] text-left">
                        First Name
                      </p>
                      <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f] p-1 border-[1px] border-indigo-600 rounded-xl">
                        <input
                          type="text"
                          value={formData.firstName}
                          name="firstName"
                          onChange={handleInputChange}
                          className="w-full h-full rounded-xl bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f]"
                        />
                      </div>
                    </div>

                    <div className=" w-full lg:w-[450px] xl:w-[500px]">
                      <p className="text-[14px] text-[#1f1f1f] text-left">
                        Last Name
                      </p>
                      <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f] p-1 border-[1px] border-indigo-600 rounded-xl">
                        <input
                          type="text"
                          value={formData.lastName}
                          name="lastName"
                          onChange={handleInputChange}
                          className="w-full h-full rounded-xl bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4 mt-8 ">
                    <div className=" w-full lg:w-[450px] xl:w-[500px]">
                      <p className="text-[14px] text-[#1f1f1f] text-left">
                        Email
                      </p>
                      <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f] p-1 border-[1px] border-indigo-600 rounded-xl">
                        <input
                          type="email"
                          value={formData.userEmail}
                          name="userEmail"
                          onChange={handleInputChange}
                          className="w-full h-full rounded-xl bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f]"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-[450px] xl:w-[500px]">
                      <p className="text-[14px] text-[#1f1f1f] text-left">
                        Role
                      </p>
                      <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f] p-1 border-[1px] border-indigo-600 rounded-xl">
                        <select
                          name="userRole"
                          value={formData.userRole}
                          onChange={handleInputChange}
                          className="w-full h-full rounded-xl bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end text-[14px] text-[#1f1f1f] outline-none px-[10px] py-[7px]"
                        >
                          {roles.map((role) => (
                            <option
                              key={role}
                              value={role}
                              className="bg-transparent text-black"
                            >
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <DialogClose
                    asChild
                    className="flex justify-end mt-8 mr-0 lg:mr-3 xl:mr-6"
                  >
                    <button
                      className=" py-2 px-4 text-white text-[14px] bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-lg"
                      type="submit"
                    >
                      Invite
                    </button>
                  </DialogClose>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 overflow-y-auto hide-scrollbar  lg:overflow-y-hidden ">
        <table className="w-full">
          <thead className="px-2 py-4">
            <tr className=" bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-l-md rounded-r-md">
              <th className="font-semibold text-base w-1/3 text-left px-2 py-4">
                Name & Email
              </th>
              <th className="font-semibold text-base w-1/3 text-left px-2 py-4">
                Role
              </th>
              <th className="font-semibold text-base w-1/3 text-left px-2 py-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {/* display filtered team members */}
            {filteredTeamMembers && filteredTeamMembers.length > 0 ? (
              filteredTeamMembers.map((member: any, index: number) => (
                <tr
                  key={index}
                  className="px-2 py-4 border-b-[1px] border-gray-200"
                >
                  <td className="w-1/3 px-2 py-4">
                    <div className="flex items-center gap-x-3">
                      <p className="h-fit lg:h-[100%] px-1 lg:px-2 py-1 lg:py-[10px] bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-full text-white text-base lg:text-2xl font-medium">
                        {member?.userFirstName?.charAt(0).toUpperCase()}
                        {member?.userLastName?.charAt(0).toUpperCase()}
                      </p>
                      <div className="flex flex-col gap-y-1">
                        <p className="text-base font-semibold">
                          {`${member?.userFirstName} ${member?.userLastName}`}
                        </p>
                        <p className="text-[14px]">{member.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-base w-1/3 text-left px-2 py-4">
                    {member.userRole}
                  </td>
                  <td className="text-base w-1/3 px-2 py-4 cursor-pointer">
                    <Dialog>
                      <DialogTrigger className="text-sm font-bold text-[#E74C3C]">
                        Remove
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogDescription className="my-16 mx-4 lg:mx-8 flex flex-col justify-center items-center">
                            <TeamRemoveIcon />
                            <p className="mt-6 text-[#E74C3C] font-semibold text-2xl text-center">
                              Remove Team Member
                            </p>
                            <p className="mt-3 text-base text-center">
                              You are about to remove this team member, are you
                              sure you want to proceed?
                            </p>
                            <DialogClose asChild className="">
                              <button
                                className="bg-[#E74C3C] text-white text-base rounded-[8px] px-[10px] py-[20px] mt-6"
                                onClick={() =>
                                  handleDeleteTeamMember(member.id)
                                }
                              >
                                Yes, remove team member
                              </button>
                            </DialogClose>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-[12px] text-center py-4">
                  No Team Members
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
