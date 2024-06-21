'use client'

import { useEffect, RefObject } from 'react';

type UseClickOutsideProps = {
  ref: RefObject<HTMLElement>;
  callback: any;
};

export const useClickOutside= (ref: RefObject<HTMLElement>, callback: any) => {
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [ref, callback]);
};
