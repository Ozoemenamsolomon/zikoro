import { postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

export const usePostAttendees = () => {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data, status } = await postRequest({
        endpoint: "/attendees",
        payload: {},
      });

      setLoading(false);

      if (status !== 200) return setError(true);

      return setData(data);
    })();
  }, []);

  return { data, isLoading, error };
};
