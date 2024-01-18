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
  "Early Bird"?: number;
  "Standard"?: number;
  "Late Bird"?: number;
  Validity: string;
}

export interface Event {
  createdAt: string
createdBy: string
description: string
email: string
endDateTime: string
eventAddress: string
eventCategory: string
eventCity:string
eventCountry:string
eventTitle: string
eventVisibility: string
expectedParticipants: number
facebook: string
id: number
twitter:string
industry:string
instagram:string
linkedin:string
locationType: "Hybrid" | "Onsite" | "Online" | "Virtual";
organisationLogo: string
organisationName: string
phoneNumber: string
prerequisites: string
pricing: PricingType[]
pricingCurrency: string
published: boolean
startDateTime: string
trainingDuration: string
whatsappNumber: string
registered: string
}

export interface PaymentConfigProps {
  email: string;
  amount?: number;
}