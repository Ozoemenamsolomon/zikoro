import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const body = await req.json();

      const transferRecipientParams = {
        type: "nuban",
        name: body.accountDetails.accountName,
        account_number: body.accountDetails.accountNumber,
        bank_code: body.accountDetails.bankCode,
        currency: body.accountDetails.currency,
      };

      const config = {
        headers: {
          Authorization: `Bearer sk_test_08e2c07402912fd01816ead89a786bff070e2d85`,
          "Content-Type": "application/json",
        },
      };

      const transferRecipientResponse = await axios.post(
        `https://api.paystack.co/transferrecipient`,
        transferRecipientParams,
        config
      );

      if (!transferRecipientResponse.data.status)
        throw new Error(transferRecipientResponse.data.message);

      console.log(transferRecipientResponse.data.data);

      const { recipient_code } = transferRecipientResponse.data.data;

      const transferParams = {
        source: "balance",
        reason: `payout for ${body.reference}`,
        amount: body.amount * 100,
        recipient: recipient_code,
        reference: body.reference,
        currency: body.accountDetails.currency,
      };

      const transferResponse = await axios.post(
        `https://api.paystack.co/transfer`,
        transferParams,
        config
      );

      if (!transferResponse.data.status)
        throw new Error(transferResponse.data.message);

      console.log(transferResponse.data.data);

      const { transfer_code } = transferResponse.data.data;

      return NextResponse.json(
        {
          msg: transferResponse.data.message,
          data: { transferCode: transfer_code },
        },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: "An error occurred while making the request.",
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}
