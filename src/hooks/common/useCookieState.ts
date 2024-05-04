import { useState, useEffect } from "react";
import { getCookie } from "../services/auth";

const useCookieState = <T>(cookieName: string): T | undefined => {
  const [cookieValue, setCookieValue] = useState<T | undefined>(
    getCookie<T>(cookieName)
  );

  useEffect(() => {
    const handleCookieChange = () => {
      setCookieValue(getCookie<T>(cookieName));
    };

    window.addEventListener("storage", handleCookieChange);

    return () => {
      window.removeEventListener("storage", handleCookieChange);
    };
  }, [cookieName]);

  console.log(cookieValue)

  return cookieValue;
};

export default useCookieState;
