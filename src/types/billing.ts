import { TUser } from ".";
import { TAttendee } from "./attendee";

export type TEventTransaction = {
  id: number;
  created_at: string;
  expiredAt: string;
  eventRegistrationRef: string;
  eventId: number;
  event: string;
  eventDate: string;
  userId: number;
  userEmail: number;
  eventPrice: number;
  paymentDate: string;
  referralSource: string;
  discountCode: string;
  discountValue: number;
  affliateEmail: string;
  affliateCode: string;
  amountPaid: number;
  registrationCompleted: boolean;
  attendees: number;
  attendeesDetails: Partial<TAttendee>[];
  payOutStatus: string;
  payOutDate: string;
  currency: string;
  ticketCategory: string;
  affliateCommission: number;
  processingFee: number;
  payOutRequestDate: string | null;
  payOutRequestedBy: string | null;
};

export interface IPayOut {
  id?: number;
  created_at?: Date;
  payOutRef: string;
  payOutStatus: string;
  Amount: number;
  paidAt?: Date | null;
  requestedBy: string;
  requestedFor: number;
  user: TUser;
}

export interface IBank {
  name: string;
  slug: string;
  code: string;
  longcode: string | null;
  gateway: any | null;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: string;
  type: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface IBankCountry {
  id: number;
  name: string;
  iso_code: string;
  default_currency_code: string;
  integration_defaults: Record<string, any>;
  relationships: {
    currency: {
      type: string;
      data: string[];
    };
    integration_feature: {
      type: string;
      data: any[];
    };
    integration_type: {
      type: string;
      data: string[];
    };
    payment_method: {
      type: string;
      data: string[];
    };
  };
}

export interface IResolvedAccount {
  account_number: string;
  account_name: string;
}
