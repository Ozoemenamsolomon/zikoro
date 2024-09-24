"use client";
import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components";
import { ArrowBack } from "styled-icons/boxicons-regular";
import { PaystackButton } from "react-paystack";
import { Lock } from "styled-icons/fa-solid";
import { paymentConfig, useCreateOrganisation } from "@/hooks";
import { useCreateOrgSubscription } from "@/hooks/services/subscription";
import useUserStore from "@/store/globalUserStore";

type TParsedData = {
  paymentReference: string;
  email: string;
  total: string;
  currency: string;
  discount: string;
  discountCode: string;
  organizationAlias: string;
  redirectUrl: string;
  isMonthly: string;
  plan: string;
  organizationName: string;
  organizationType: string;
  subscriptionPlan: string;
};
function PaymentComponent() {
  const router = useRouter();
  const { user } = useUserStore();
  const params = useSearchParams();
  const data = params.get("data");
  const { organisation } = useCreateOrganisation();

  const parsedData: TParsedData | null = useMemo(() => {
    if (data) {
      const decodedData = decodeURIComponent(data);
      const parsedData = JSON.parse(decodedData);
      return parsedData;
    }
    return null;
  }, [data]);

  const { createOrgSubscription } = useCreateOrgSubscription(
    String(user?.id || ""),
    Number(parsedData?.total || 0) - Number(parsedData?.discount || 0),
    parsedData?.currency!,
    parsedData?.plan!,
    parsedData?.isMonthly!,
    parsedData?.total || "",
    parsedData?.discountCode || null,
    Number(parsedData?.discount || 0) || null,
    parsedData?.organizationAlias,
    null,
  );

  async function handleSuccess(reference: any) {
    try {
      await createOrgSubscription();

      if (parsedData) {
        await organisation({
          organizationName: parsedData?.organizationName,
          organizationType: parsedData?.organizationType,
          subscriptionPlan: parsedData?.subscriptionPlan,
        });
        router.push(parsedData?.redirectUrl);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const config = paymentConfig({
    reference: parsedData?.paymentReference!,
    email: parsedData?.email!,
    amount: Number(parsedData?.total),
    currency: parsedData?.currency,
  });

  const componentProps: any = {
    ...config,
    // text: 'Paystack Button Implementation',
    children: (
      <Button className="w-full min-w-[280px]  gap-x-2 bg-basePrimary text-gray-50 font-medium">
        <Lock size={22} />
        <span>{`Pay ${parsedData?.currency} ${Number(
          parsedData?.total
        )?.toLocaleString()}`}</span>
      </Button>
    ),
    onSuccess: (reference: any) => handleSuccess(reference),
  };
  return (
    <div className="w-full bg-[#F9FAFF] fixed inset-0 h-full">
      <div className="max-w-lg m-auto flex flex-col items-start justify-start gap-y-3 p-4 w-[95%] inset-0 absolute h-fit">
        <Button
          onClick={() => router.back()}
          className="px-0 h-fit w-fit  bg-none  "
        >
          <ArrowBack className="px-0 w-fit h-fit" size={20} />
        </Button>

        <div className="w-full bg-white h-fit flex items-center justify-center flex-col gap-y-5 rounded-lg p-4">
          <p className="font-semibold text-lg sm:text-xl">Order Summary</p>

          <div className="w-full border rounded-lg py-6 px-4">
            <p className="w-full border-b pb-2">Orders</p>

            <div className="w-full mt-6 mb-2 flex items-center justify-between">
              <p> SubTotal</p>
              <p className="font-medium">
                {parsedData?.currency}{" "}
                {(
                  Number(parsedData?.total || 0) -
                  Number(parsedData?.discount || 0)
                )?.toLocaleString()}
              </p>
            </div>

            <div className="w-full mt-6 mb-2 flex items-center justify-between">
              <p> Discount</p>
              <p className="font-medium">
                - {parsedData?.currency}{" "}
                {Number(parsedData?.discount || 0)?.toLocaleString()}
              </p>
            </div>

            <div className="w-full mt-6 flex items-center justify-between">
              <p className="font-semibold">Total</p>
              <p className="font-semibold">
                {parsedData?.currency}{" "}
                {Number(parsedData?.total || 0)?.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <PaystackButton {...componentProps} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Suspense>
      <PaymentComponent />
    </Suspense>
  );
}
