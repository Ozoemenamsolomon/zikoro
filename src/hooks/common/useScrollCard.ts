'use client';

import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

export const useScrollCard = (scroll: MutableRefObject<HTMLElement | null>) => {
  const [isPrevious, setPrevious] = useState(false);
  const [isNext, setNext] = useState(true);

  function previous() {
    scroll.current?.scrollBy({
      left: -scroll.current.scrollWidth / 10,
      behavior: 'smooth',
    });
  }

  function next() {
    scroll.current?.scrollBy({
      left: scroll.current.scrollWidth / 10,
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    const currentSlide = scroll.current;
    function scrollEl() {
      if (currentSlide) {
        if (currentSlide?.scrollLeft === 0) {
          setPrevious(false);
        } else {
          setPrevious(true);
        }
        if (
          currentSlide.scrollLeft + currentSlide.offsetWidth >=
          currentSlide.scrollWidth
        ) {
          setNext(false);
        } else {
          setNext(true);
        }
      }
    }
    if (currentSlide) {
      currentSlide?.addEventListener('scroll', scrollEl);
    }
    return () => {
      if (currentSlide) currentSlide.removeEventListener('scroll', scrollEl);
    };
  }, [scroll.current?.scrollLeft]);

  return {
    next,
    previous,
    isPrevious,
    isNext,
  };
};
