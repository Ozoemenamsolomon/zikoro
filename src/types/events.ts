export interface Attendees {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  whatsappNumber: string;
}
export interface OrganizerContact {
  whatsappNumber: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
}

export enum EventDetailTab {
  ABOUT_TAB = 1,
  AGENDA_TAB,
  SPEAKERS_TAB,
  EXIHIBITORS_TAB,
}

interface PricingType {
  ticketQuantity: string;
  attendeeType: string;
  description: string;
  price: string;
  validity: string;
}

export type PartnerIndustry = {
  name: string;
  color: string;
};

export interface Event {
  createdAt: string;
  createdBy: string;
  description: string;
  email: string;
  endDateTime: string;
  eventAddress: string;
  eventCategory: string;
  eventCity: string;
  eventCountry: string;
  eventTitle: string;
  eventVisibility: string;
  expectedParticipants: number;
  facebook: string;
  id: number;
  industry: string;
  instagram: string;
  x: string;
  linkedin: string;
  locationType: "Hybrid" | "Onsite" | "Virtual";
  organisationLogo: string;
  organisationName: string;
  phoneNumber: string;
  prerequisites: string;
  pricing: PricingType[];
  pricingCurrency: string;
  published: boolean;
  startDateTime: string;
  trainingDuration: string;
  whatsappNumber: string;
  registered: string;
  partnerIndustry: PartnerIndustry[];
  eventPoster: string[];
  exhibitionHall: { name: string; capacity: string }[];
  sponsorCategory: { type: string; id: string }[];
  eventAlias: string;
  eventTimeZone: string;
}

export interface PaymentConfigProps {
  email: string;
  amount?: number;
  reference: string;
}

export interface DiscountCodeType {
  created_at: string;
  discountAmount: number;
  discountCode: string;
  discountPercentage: string;
  eventId: number;
  id: number;
  minQty: number;
  quantity: number;
  status: boolean;
  validUntil: string;
}

export interface Organization {
  id: number;
  organizationName: string;
  subscriptionPlan: string;
  subscritionStartDate: Date;
  subscriptionEndDate: Date;
  organizationOwner: string;
  BillingAddress: string;
  TaxID: string;
  organizationType: string;
  organizationLogo: string;
  country: string;
  eventPhoneNumber: string;
  eventWhatsApp: string;
  eventContactEmail: string;
  x: string;
  linkedIn: string;
  instagram: string;
  facebook: string;
  certificateAsset: string;
  tiktok: string;
}
