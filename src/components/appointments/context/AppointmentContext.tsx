"use client"

import { Booking, User, UserType } from '@/types/appointments';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchUser } from '../auth';

export interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  isFormUp: boolean;
  setIsFormUp: (loading: boolean) => void;
  bookingFormData: Booking; 
  setBookingFormData: React.Dispatch<React.SetStateAction<Booking>>;
  selectedType: string; 
  setselectedType: React.Dispatch<React.SetStateAction<string>>;
  inactiveSlots: string[]; 
  setInactiveSlots: React.Dispatch<React.SetStateAction<string[]>>;
  slotCounts: { [key: string]: number }; 
  setSlotCounts: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  user: UserType | null; 
  setUser: React.Dispatch<React.SetStateAction<UserType|null>>;
}

export interface AppointmentContextProps extends AppState {
  // Add other context properties or methods here if needed in the future
}

const AppointmentContext = createContext<AppointmentContextProps | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isFormUp, setIsFormUp] = useState<boolean>(false);
  const [user, setUser] = useState<UserType|null>(null);

  const [bookingFormData, setBookingFormData] = useState<Booking>({})
  const [inactiveSlots, setInactiveSlots] = useState<string[]>([]);
  const [selectedType, setselectedType] = useState<string>('');
  const [slotCounts, setSlotCounts] = useState<{ [key: string]: number }>({});

  const contextValue: AppointmentContextProps = {
    isLoading,setLoading,
    isFormUp,setIsFormUp,
    bookingFormData, setBookingFormData,
    inactiveSlots, setInactiveSlots,
    slotCounts, setSlotCounts,
    user, setUser,
    selectedType, setselectedType,
  };

  useEffect(() => {
    const fetch = async () => {
      const user = await fetchUser();
       if (user) setUser(user)
      }
    fetch();
  }, []);

  return (
    <AppointmentContext.Provider value={contextValue}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointmentContext = (): AppointmentContextProps => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointmentContext must be used within an AppProvider');
  }
  return context;
};
