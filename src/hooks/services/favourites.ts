import { toast } from "@/components/ui/use-toast";
import { TFavouriteContact } from "@/types/favourites";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";

type useUpdateFavouritesResult = {
  updateFavourites: ({
    payload,
  }: {
    payload: TFavouriteContact;
  }) => Promise<void>;
} & RequestStatus;

export const useUpdateFavourites = ({
  userId,
}: {
  userId: number;
}): useUpdateFavouritesResult => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateFavourites = async ({ payload }: { payload: TFavourites }) => {
    setLoading(true);
    toast({
      description: "updating favourite...",
    });
    try {
      const { data, status } = await postRequest({
        endpoint: `/favourites/${userId}`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "favourites updated successfully",
      });
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { updateFavourites, isLoading, error };
};

type UseGetFavouritesResult = {
  favourites: TFavouriteContact;
  getFavourites: () => Promise<void>;
} & RequestStatus;

export const useGetFavourites = ({
  userId,
}: {
  userId: number;
}): UseGetFavouritesResult => {
  const [favourites, setFavourites] = useState<TFavouriteContact>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getFavourites = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TFavouriteContact>({
        endpoint: `/favourites/${userId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setFavourites(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavourites();
  }, [userId]);

  return { favourites, isLoading, error, getFavourites };
};
