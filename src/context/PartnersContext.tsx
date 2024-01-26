"use client"

import {
  createContext,
  SetStateAction,
  useState,
  useContext,
  useMemo,
} from "react";

type PartnersContextType = {
  active: number;
  setActive: React.Dispatch<SetStateAction<number>>;
};
export const PartnersContext = createContext<PartnersContextType>(
  {} as PartnersContextType
);

export function PartnersProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(1);

  // memoized to avoid re-rendering
  const contextValue = useMemo(() => {
    return {
      active,
      setActive,
    };
  }, [active, setActive]);

  return (
    <PartnersContext.Provider value={contextValue}>
      {children}
    </PartnersContext.Provider>
  );
}

export const usePartnersTab = () => {
  const context = useContext(PartnersContext);
  if (!context) {
    throw new Error("usePartnersTab must be used within an PartnersProvider");
  }
  return context;
};
