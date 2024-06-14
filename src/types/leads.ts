export interface ILead {
  id: number;
  eventId?: string;
  createdAt: Date;
  boothStaffId?: bigint;
  firstName: string;
  lastName: string;
  attendeeEmail: string;
  jobTitle?: string;
  organization?: string;
  city?: string;
  country?: string;
  phoneNumber: string;
  whatsappNumber?: string;
  profilePicture?: string;
  bio?: string;
  x?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  ticketType?: string;
  attendeeType?: object;
  attendeeAlias?: string;
  attendeeId?: number;
  firstContactChannel?: string;
  websiteUrl?: string;
  eventAlias?: string;
  interests?: object;
  boothStaffEmail?: string;
  stampCard?: boolean;
}

export interface TLead {
  id: number;
  eventId: number;
  createdAt: string;
  boothStaffId: number;
  firstName: string;
  lastName: string;
  attendeeEmail: string;
  jobTitle: string;
  organization: string | null;
  city: string | null;
  country: string | null;
  phoneNumber: string;
  whatsappNumber: string | null;
  profilePicture: string | null;
  bio: string | null;
  x: string | null;
  linkedin: string | null;
  instagram: string | null;
  facebook: string | null;
  ticketType: string;
  attendeeType: string[];
  attendeeAlias: string;
  attendeeId: number;
  firstContactChannel: string;
  websiteUrl: string;
  eventAlias: string;
  boothStaffEmail: string;
  stampCard: boolean;
  eventPartnerId: number;
  eventPartnerAlias: string;
}

export interface TLeadsInterest {
  id?: number;
  created_at?: string;
  eventAlias?: string;
  attendeeId?: number;
  attendeeAlias?: string;
  eventPartnerAlias?: string;
  interestType: string;
  title: string;
  note: string;
}


export interface TAllLeads extends TLead  {
  interests: TLeadsInterest;
}