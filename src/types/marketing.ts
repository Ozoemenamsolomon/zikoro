import { AffiliateSchema } from "@/schemas/marketing";
import { z } from "zod";
import { TEventTransaction } from "./billing";

export interface TSentEmail {
  id?: number;
  created_at?: Date;
  organizationId: number;
  userId: number;
  userEmail: string;
  emailCategory: string;
  subject: string;
  sendersName: string;
  replyTo?: string;
  emailBody: string;
  emailRecipient: {
    attendeeAlias: string;
    email: string;
    firstName: string;
    lastName: string;
  }[];
  sendDateTime?: Date;
  sendTimeZone?: string;
  eventAlias: string;
}

// interface TAffiliate {
//   id: number;
//   created_at: Date;
//   organizationId: number ;
//   organizationName: string ;
//   userId: number ;
//   userEmail: string ;
//   firstName: string ;
//   lastname: string ;
//   email: string ;
//   accountDetails: Record<string, any> ; // You might want to define a proper type for accountDetails
//   payoutSchedule: string ;
//   affliateStatus: boolean ;
// }

export interface TAffiliate extends z.TypeOf<typeof AffiliateSchema> {
  createdBy: string;
  affliateCode: string;
  organizationId: number;
  attendeeAlias: string;
}

export interface TAffiliateLink {
  id?: number;
  created_at?: Date;
  userId?: number;
  affiliateId?: number;
  eventName?: string;
  payoutSchedule?: string;
  commissionType: string;
  commissionValue: number;
  validity?: Date;
  Goal?: string;
  affiliateLink?: string;
  eventId?: number;
  affiliateEmail?: string;
  affiliate?: TAffiliate;
  eventTransactions?: TEventTransaction[];
  linkCode?: string;
}
