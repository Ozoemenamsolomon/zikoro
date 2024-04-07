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

interface TEventStatusDetail {
  createdAt: string;
  status: string;
  user: string;
}
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
  organisationId: string;
  x: string;
  linkedin: string;
  locationType: "Hybrid" | "Onsite" | "Virtual" | string;
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
  eventStatusDetails: TEventStatusDetail[];
  eventStatus: string;
  attendeePayProcessingFee: boolean;
  explore: boolean;
  eventAppAccess: string;
  eventWebsiteSettings: { title: string; status: boolean }[];
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

export interface Reward {
  rewardTitle: string;
  image: string;
  quantity: string;
  point: string;
  eventId: string;
  eventName: string;
}

export interface TPayment {
  total?: number;
  allowPayment: (bool: boolean) => void;
  discount: number;
  count: number;
  currency: string | undefined;
  processingFee?: number;
  amountPayable?: number;
  attendeesDetails: any[];
  eventImage: string;
  eventPrice?: number;
  startDate?: string;
  endDate?: string;
  organization?: string | null;
  organizerContact: OrganizerContact;
  eventId?: number;
  eventDate?: string;
  priceCategory?: string;
  eventTitle?: string;
  eventLocation?: string;
  eventReference: string;
  address?: string;
  discountCode?: string;
  referralSource?: string;
}

interface TAttendeeDetail {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whatsappNumber: string;
}
export interface TEventTransactionDetail {
  affiliateCode: string;
  affiliateCommission: string;
  amountPaid: number;
  amountPayable: number;
  attendees: number;
  attendeesDetails: TAttendeeDetail[];
  created_at: string;
  currency: string;
  discountCode: string;
  discountValue: number;
  event: string;
  eventDate: string;
  eventId: number;
  eventPrice: number;
  eventRegistrationRef: string;
  expiredAt: string;
  id: number;
  payOutDate: string;
  payOutOption: string;
  payOutRequestDate: string;
  payOutRequestedBy: string;
  payOutStatus: string;
  paymentDate: string;
  processingFee: string;
  referralSource: string;
  registrationCompleted: boolean;
  ticketCategory: string;
  userEmail: string;
  userId: string;
}
