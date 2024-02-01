export enum PartnersEnum {
  SPONSORS_TAB = 1,
  EXHIBITORS_TAB,
}

export interface IndustryType {
  name: string;
  color: string;
}

export interface TPartner {
  banners: string;
  boothNumber: string;
  boothStaff: JSON;
  city: string;
  companyLogo: string;
  companyName: string;
  country: string;
stampIt:boolean
  created_at: string;
  description: string;
  email: string;
  eventId: number;
  eventName: string;
  exhibitionHall: string;
  id: number;
  industry: { name: string; color: string };
  jobs: JSON;
  media: string;
  partnerType: string;
  phoneNumber: string;
  products: JSON;
  website: string;
  whatsApp: string;
}
