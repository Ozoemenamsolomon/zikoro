import React, { useCallback, useRef } from "react";

function infiniteScroll(
  node: HTMLDivElement | null,
  observer: React.MutableRefObject<IntersectionObserver| null>,
  setFrom: React.Dispatch<React.SetStateAction<number>>,
  setTo: React.Dispatch<React.SetStateAction<number>>,
  setInitialLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (observer.current) observer.current.disconnect();
  observer.current = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          setFrom((prev) => prev + 50);
          setTo((prev) => prev + 50);
          setInitialLoading(false)
        }, 1000);
      }
    },
    {
      threshold: 1,
    }
  );

  if (node) observer.current.observe(node);

  // Cleanup when the component unmounts
  return () => {
    if (observer.current) {
      observer.current.disconnect();
    }
  };
}

export const useInfiniteScrollPagination = (
  hasReachedLastPage = false,
  setFrom: React.Dispatch<React.SetStateAction<number>>,
  setTo: React.Dispatch<React.SetStateAction<number>>,
  setInitialLoading:  React.Dispatch<React.SetStateAction<boolean>>,
) => {
  let observer = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (hasReachedLastPage) return;
      infiniteScroll(node, observer, setFrom, setTo, setInitialLoading);
    },

    [hasReachedLastPage]
  );

  return { ref };
};
