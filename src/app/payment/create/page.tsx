import PaymentComponent from "@/components/payment/PaymentComponent";

type SearchParams = {
  name: string;
  id: string;
  orgId: string;
  orgAlias: string;
  plan: string;
  total: string;
  coupon: string;
  monthly: string;
  currency: string;
  orgName: string;
  orgType: string;
  subPlan: string;
  redirectUrl: string;
  isCreate: string;
};

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return <PaymentComponent searchParams={searchParams} />;
}
