import { getRequest } from "@/utils/api";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { TEventQAQuestion } from "@/types";

const supabase = createClientComponentClient()

export const useGetQAQuestions = ({ qaId }: { qaId: string }) => {
  const [eventQAQuestions, setEventQAQuestions] = useState<
    TEventQAQuestion[] | null
  >(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getQAQUestions = async () => {
    try {
      setLoading(true);
      const { data, status } = await getRequest<TEventQAQuestion[]>({
        endpoint: `engagements/qa/${qaId}/questions`,
      });

      if (status !== 200) {
        throw data;
      }
      setEventQAQuestions(data.data);
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQAQUestions();
  }, [qaId]);

  const fetchQAQuestion = (updateQuestion: TEventQAQuestion[]) => {
    setEventQAQuestions(updateQuestion);
  };

  return {
    eventQAQuestions,
    isLoading,
    getQAQUestions,
    setEventQAQuestions: fetchQAQuestion,
  };
};


export const useQARealtimePresence = (isLive:boolean) => {

    useEffect(() => {
    // console.log("real presence")
    //if (!isLive) return;
        const channel = supabase.channel("live-quiz");
  
        channel
          .on("presence", { event: "sync" }, () => {
            const newState = channel.presenceState();
             console.log("sync", newState);
            for (let id in newState) {
              //  console.log(newState[id][0])
            }
          })
          .on("presence", { event: "join" }, ({ key, newPresences }) => {
            console.log("join", key, newPresences);
            // saveCookie("player", {
            //   userId: newPresences[0]?.presence_ref,
            //   connectedAt: newPresences[0]?.online_at,
            // });
          })
          .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
             console.log("leave", key, leftPresences);
          })
          .subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
              await channel.track({
                online_at: new Date().toISOString(),
              });
            }
          })
          
  
        return () => {
          supabase.removeChannel(channel);
        };
      
    }, [supabase, isLive]);

  
    
  };