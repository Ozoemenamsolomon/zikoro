interface TSentEmail {
  id?: number;
  created_at?: Date;
  organizationId: number;
  userId: number;
  userEmail: string;
  emailCategory: string;
  subject: string;
  sendersName: string;
  replyTo?: string | null;
  emailBody: string;
  emailRecipient: string[];
  sendDateTime?: Date | null;
  sendTimeZone?: string | null;
}

interface TAffiliate {
  id: number;
  created_at: Date;
  organizationId: number | null;
  organizationName: string | null;
  userId: number | null;
  userEmail: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  accountDetails: Record<string, any> | null; // You might want to define a proper type for accountDetails
  payoutSchedule: string | null;
  affliateStatus: boolean | null;
}

interface TAffiliateLink {
  id: number;
  created_at: Date;
  userId: number | null;
  affliateId: number | null;
  event: string | null;
  payoutSchedule: string | null;
  commissionType: string | null;
  commissionValue: number | null;
  validity: Date | null;
  Goal: string | null;
  affliateLink: string | null;
}
