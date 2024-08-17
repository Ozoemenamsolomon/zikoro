import { TAttendee, TAgenda } from "@/types";

export enum PartnersEnum {
  SPONSORS_TAB = 1,
  EXHIBITORS_TAB,
}

export interface IndustryType {
  name: string;
  color: string;
}

export interface PartnerBannerType {
  file: string;
  link: string;
}

export interface TPartner {
  banners: PartnerBannerType[];
  boothNumber: string[];
  boothStaff: TAttendee[];
  city: string;
  companyLogo: string;
  companyName: string;
  country: string;
  stampIt: boolean;
  created_at: string;
  description: string;
  email: string;
  eventId: number;
  eventName: string;
  exhibitionHall: string;
  id: number;
  industry: string;
  jobs: PartnerJobType[];
  media: string;
  partnerType: string;
  phoneNumber: string;
  offers: PromotionalOfferType[];
  website: string;
  whatsApp: string;
  sponsorCategory: string;
  eventAlias: string;
  sponsoredSession: { session: TAgenda; sessionLink: string }[];
  partnerAlias: string;
  organizerEmail: string;
  tierName: string;
  amountPaid: number;
  partnerStatus: string;
  currency: string;
  paymentReference: string;
  contactLastName:string;
  contactFirstName: string;
}

export interface TExPartner {
  banners: PartnerBannerType[];
  boothNumber: string[];
  boothStaff: TAttendee[];
  city: string;
  companyLogo: string;
  companyName: string;
  country: string;
  stampIt: boolean;
  created_at: string;
  description: string;
  email: string;
  eventId: number;
  eventName: string;
  exhibitionHall: string;
  id: number;
  industry: string;
  jobs: boolean;
  media: string;
  partnerType: string;
  phoneNumber: string;
  offers: boolean;
  website: string;
  whatsApp: string;
  eventAlias: string;
  sponsoredSession: { session: TAgenda; sessionLink: string }[];
  partnerAlias: string;
  organizerEmail: string;
  tierName: string;
  amountPaid: number;
  partnerStatus: string;
  currency: string;
  paymentReference: string;
  contactLastName:string;
  contactFirstName: string;
}

export interface PartnerJobType {
  jobTitle: string;
  applicationLink?: string;
  maxSalary: string;
  minSalary: string;
  salaryDuration: string;
  flexibility: string;
  description: string;
  city: string;
  country: string;
  employmentType: string;
  experienceLevel: string;
  qualification: string;
  currencyCode: string;
  partnerId: string;
  companyName: string;
  applicationMode: string;
  email?: string;
  whatsApp?: string;
  id: string;
}

export interface PromotionalOfferType {
  serviceTitle: string;
  endDate: string;
  productPrice: string;
  productPromo: string;
  offerDetails: string;
  voucherCode: any;
  redeem: "email" | "url" | "whatsapp";
  url: string | undefined;
  whatsApp: string | undefined;
  email: string | undefined;
  currencyCode: string;
  partnerId: string;
  companyName: string;
  productImage: any;
  id: string;
}
