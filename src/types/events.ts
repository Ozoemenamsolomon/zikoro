export interface Event {
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: string;
  price: number;
  publishedDate: string;
}

export interface Attendees {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  whatsappNumber: string;
}

export enum EventDetailTab {
  ABOUT_TAB = 1,
  SPEAKERS_TAB,
  AGENDA_TAB,
  EXIHIBITORS_TAB,
}

interface PricingType {
  earlyBird?: number;
  standard?: number;
  lateBird?: number;
  validity: string;
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
  x: string;
  linkedin: string;
  locationType: "Hybrid" | "Onsite" |  "Virtual";
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
