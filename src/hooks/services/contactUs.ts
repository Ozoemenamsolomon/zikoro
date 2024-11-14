"use client";
import { useState } from "react";
import { toast } from "react-hot-toast"; // Changed from react-toastify to react-hot-toast to keep consistency
import { createClient } from "@/utils/supabase/client";

type UpdateContactRequestBody = {
    formData: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
        annualEvents?: string;
        attendees?: string;
        industry?: string;
        comments: string;
        source: string;
    };
};

export function useContactUs() {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    async function submitForm(values: UpdateContactRequestBody["formData"]) {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from("contactForm")
                .insert({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    source: values.source,
                    phoneNumber: values.phoneNumber,
                    annualEvents: values.annualEvents,
                    attendees: values.attendees,
                    industry: values.industry,
                    comments: values.comments,
                });
                

            if (error) {
                throw error;
            }

            toast.success("Your message has been sent");
            return data;
        } catch (error: any) {
            toast.error(`${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return {
        submitForm,
        loading,
    };
}
