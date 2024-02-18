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
  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);

  function getBoxHeight(top: number, left: number) {
    // const clientX = localStorage.getItem("clientX");
    // const clientY = localStorage.getItem("clientY");

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
        //  setPosition({...position, top: yPosition})
      }

      setPosition(newPosition);
      //  localStorage.removeItem("clientX")
      setClientX(0);
      setClientY(0);
      //  localStorage.removeItem("clientY");
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
