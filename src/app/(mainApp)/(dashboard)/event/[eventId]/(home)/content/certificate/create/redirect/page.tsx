"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const page = ({ searchParams: { certificateId } }) => {
  const router = useRouter();
  return router.push("create?certificateId=" + certificateId);
};

export default page;
