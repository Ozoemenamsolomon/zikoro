"use client";

import { toast } from "@/components/ui/use-toast";
import { postRequest, getRequest } from "@/utils/api";
import { useState, useEffect } from "react";

// Define the type for the team member invite payload
type TInviteTeamMember = {
    organizationName: string;
    organizationOwner: string;
    subject: string;
    emailBody: string;
    emailRecipient: string;
};

export const useSendTeamInviteEmail = ({ payload }: { payload: TInviteTeamMember }) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const sendTeamInviteEmail = async () => {
        setLoading(true);
        toast({
            description: "sending email...",
        });
        try {
            const { data, status } = await postRequest({
                endpoint: "teamMembers/invite/email",
                payload,
            });

            if (status !== 201) throw data.data;
            toast({
                description: "Email sent successfully",
            });
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return { sendTeamInviteEmail, isLoading, error };
};

