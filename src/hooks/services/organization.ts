import { TOrganization } from "@/types/organization";
import { toast } from "@/components/ui/use-toast";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";
import { UseGetResult, usePostResult } from "@/types/request";

export const useGetOrganizations = (): UseGetResult<
  TOrganization[],
  "organizations",
  "getOrganizations"
> => {
  const [organizations, setOrganizations] = useState<TOrganization[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getOrganizations = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TOrganization[]>({
        endpoint: "organization",
      });

      if (status !== 200) {
        throw data;
      }
      setOrganizations(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  return {
    organizations,
    isLoading,
    error,
    getOrganizations,
  };
};

type UseGetOrganizationResult = UseGetResult<
  TOrganization,
  "organization",
  "getOrganization"
>;

export const useGetOrganization = ({
  organizationId,
}: {
  organizationId: number;
}): UseGetOrganizationResult => {
  const [organization, setOrganization] = useState<TOrganization | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getOrganization = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TOrganization>({
        endpoint: `organization/${organizationId}`,
      });

      if (status === 200) {
        setOrganization(data.data);
        setError(false);
      } else {
        throw new Error("Failed to fetch organization data");
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrganization();
  }, [organizationId]);

  return {
    organization,
    isLoading,
    error,
    getOrganization,
  };
};

export const useUpdateOrganization = ({
  organizationId,
}: {
  organizationId: number;
}): usePostResult<Partial<TOrganization>, "updateOrganization"> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateOrganization = async ({
    payload,
  }: {
    payload: Partial<TOrganization>;
  }) => {
    setLoading(true);
    toast({
      description: "updating organization...",
    });
    try {
      console.log(organizationId, "organizationId");
      const { data, status } = await postRequest({
        endpoint: `organization/${organizationId}`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Organization updated successfully",
      });
    } catch (error) {
      setError(true);
      toast({
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateOrganization, isLoading, error };
};
