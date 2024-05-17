"use client"

import React, { useEffect, useRef, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: ReactNode;
  
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const portalContainerRef = useRef<HTMLDivElement | null>(null);
 
  useEffect(() => {
    const portalContainer = document.createElement('div');
    document.body.appendChild(portalContainer);
    portalContainerRef.current = portalContainer;
  
    return () => {
      if (portalContainerRef.current && portalContainerRef.current.parentNode === document.body) {
        document.body.removeChild(portalContainerRef.current);
      }
    };
  }, []);

  return portalContainerRef.current
    ? ReactDOM.createPortal(children, portalContainerRef.current)
    : null;
};


export {Portal};
