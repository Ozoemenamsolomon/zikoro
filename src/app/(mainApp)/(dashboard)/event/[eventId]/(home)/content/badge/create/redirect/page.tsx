"use client"
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const page = ({ searchParams: { badgeId } }) => {

  const router = useRouter();
  return router.push("create?badgeId=" + badgeId);
};

export default page;
