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
  boothNumber: string;
  boothStaff: JSON;
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
  industry: { name: string; color: string };
  jobs: PartnerJobType[];
  media: string;
  partnerType: string;
  phoneNumber: string;
  offers: PromotionalOfferType[];
  website: string;
  whatsApp: string;

}

export interface PartnerJobType {
  jobTitle: string;
  applicationLink: string;
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
  companyName:string
}

export interface PromotionalOfferType {
  serviceTitle:string
  endDate:string
  productPrice:string
  productPromo:string
  offerDetails:string
  voucherCode:any
  redeem:"email" | "url" | "whatsapp"
  url:string | undefined
  whatsApp:string | undefined
  email:string | undefined
  currencyCode: string;
  partnerId: string;
  companyName:string
  productImage:any


}