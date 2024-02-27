"use client";

import {
  createContext,
  SetStateAction,
  useState,
  useContext,
  MouseEvent,
  useMemo,
} from "react";

type BoxPositionContextType = {
  position: { left: number; top: number };
  getClientPosition: (e: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  getBoxHeight: (t: number, r: number) => void;
  isActive: boolean;
  setIsActive: React.Dispatch<SetStateAction<boolean>>;
};

export const BoxPositionContext = createContext<BoxPositionContextType>(
  {} as BoxPositionContextType
);

export function BoxPositionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [position, setPosition] = useState({ left: 0, top: 28 });
  const [isActive, setIsActive] = useState(false)
  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);

  function getBoxHeight(top: number, left: number) {
 

    const newPosition = { ...position };
   
    if (clientX && clientY) {
      if (clientX < 150) {
        newPosition.left = -left;
      } else if (clientX < 0) {
        newPosition.left = left;
      }

      if (clientY < 300) {
        let yPosition = -top;

        newPosition.top = yPosition;
       
      }

      setPosition(newPosition);
    
      setClientX(0);
      setClientY(0);
    
    }
  }



  function getClientPosition(e: MouseEvent<HTMLButtonElement, MouseEvent>) {
  
    setPosition({ left: 0, top: 28 });
    setClientY(window.innerHeight - e.clientY);
    setClientX(window.innerWidth - e.clientX);
    // localStorage.setItem("clientX", String(window.innerWidth - e.clientX));
    // localStorage.setItem("clientY", String(window.innerHeight - e.clientY));
  }

  // memoized to avoid re-rendering
  const contextValue = useMemo(() => {
    return {
      position,
      getClientPosition,
      getBoxHeight,
      isActive,
      setIsActive,
    };
  }, [position]);

  return (
    <BoxPositionContext.Provider value={contextValue}>
      {children}
    </BoxPositionContext.Provider>
  );
}

export const useDropBoxPosition = () => {
  const context = useContext(BoxPositionContext);
  if (!context) {
    throw new Error("usePartnersTab must be used within an PartnersProvider");
  }
  return context;
};
