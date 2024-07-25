import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
const supabase = createClientComponentClient();

//fetch discount codes 
export function useGetDiscountCodes() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        getDiscountCodes();
    }, []);

    async function getDiscountCodes() {
        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from("zikoroDiscount")
                .select("*")

            if (fetchError) {
                toast.error(fetchError.message);
                return null;
            }
            setData(data);
        } catch (error) {
            return null;
        } finally {
            setLoading(false);
        }
    }
    return {
        data,
        refetch: getDiscountCodes,
        isLoading,
    };
}