import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

const supabase = createClientComponentClient();

type DBWorkspaceData = {
  id: number;
  created_at: string;
  organizationName: string;
  subscritionStartDate: string;
  subscriptionEndDate: string;
  organizationOwner: string;
  BillingAddress: string;
  TaxID: string;
  payoutAccountDetails: string;
  organizationOwnerId: string;
  organizationType: string;
  organizationLogo: string;
  country: string;
  eventPhoneNumber: string;
  eventWhatsApp: string;
  eventContactEmail: string;
  x: string;
  linkedIn: string;
  instagram: string;
  certificateAsset: string;
  tiktok: string;
  teamMembers: {
    userId: number;
    userEmail: string;
    userRole: string;
  };
};
