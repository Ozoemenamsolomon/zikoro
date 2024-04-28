"use client"
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const page = () => {
  const searchParams = useSearchParams();
  const certificateId = searchParams.get("certificateId");

  const router = useRouter();
  return router.push("create?certificateId=" + certificateId);
};

export default page;
