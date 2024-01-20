"use client"

import { PaymentConfigProps } from '@/types';
import { config } from '@/config/__url';
import { HookConfig } from 'react-paystack/dist/types';

export const paymentConfig = ({ reference, email, amount }: PaymentConfigProps) => {

  const configuration: HookConfig = {
    reference: reference,
    email,
    amount: amount,
    publicKey: config.payment ?? '',
  };
  return configuration;
};

