import { TUser } from "./user";

export interface ISubscription {
  id: number;
  created_at: string;
  userId: number;
  organizationId: number;
  subscriptionType: string;
  amountPayed: number;
  startDate: string;
  expirationDate: string;
  discountCode: string;
  discountValue: number;
  currency: string;
  monthYear: string;
  user: TUser;
  planPrice: number;
  organizationAlias: string;
}
