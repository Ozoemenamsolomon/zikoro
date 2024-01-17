"use client"

import { config } from '@/config/__urls';
import { usePaystackPayment } from 'react-paystack';

export function usePayStackPayment() {
    const initializePayment = usePaystackPayment(config);

   
    async function initializePaystackPayment() {

        const payStackconfig = {
            reference: (new Date()).getTime().toString(),
            email: "",
            amount: 20000, 
            publicKey: config.payment,
        };
        initializePayment(onSuccess, onClose)
    
            
    // you can call this function anything
    const onSuccess = (reference) => {
        // Implementation for whatever you want to do with reference and after success call.
        console.log(reference);
      };
    
      // you can call this function anything
      const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')
      }
    }

}