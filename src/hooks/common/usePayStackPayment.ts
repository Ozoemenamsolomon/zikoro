"use client"

import { PaymentConfigProps } from '@/types';
import { config } from '@/config/__url';
import { HookConfig } from 'react-paystack/dist/types';

export const paymentConfig = ({ email, amount }: PaymentConfigProps) => {

  const configuration: HookConfig = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount,
    publicKey: config.payment ?? '',
  };
  return configuration;
};

