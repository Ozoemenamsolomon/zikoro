import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const {
        sessionModerators,
        sessionSpeakers,
        sessionSponsors,
        ...restData
      } = params;

      const { error, data } = await supabase.from("agenda").upsert(params);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          {
            status: 400,
          }
        );
      }

      if (Array.isArray(sessionModerators) && sessionModerators.length > 0) {
        const updatedModerators = sessionModerators?.map((moderator) => {
          if (Array.isArray(moderator?.moderatingAt)) {
            // add to the existing session if it is not present
            // check if session is already present and update
            const presentSession = moderator?.moderatingAt?.session?.find(
              ({ sessionAlias }: { sessionAlias: string }) =>
                sessionAlias === params?.sessionAlias
            )?.sessionAlias;
            const filterModerators = moderator?.moderatingAt?.filter(
              (s: any) => {
                return s.session?.map(
                  ({ sessionAlias }: { sessionAlias: string }) =>
                    sessionAlias !== presentSession
                );
              }
            );

            return {
              ...moderator,
              moderatingAt: [
                ...filterModerators,
                {
                  session: restData,
                  sessionLink: `${window.location.origin}/event/${params?.eventAlias}/agenda/${params?.sessionAlias}`,
                },
              ],
            };
          } else {
            return {
              ...moderator,
              moderatingAt: [
                {
                  session: restData,
                  sessionLink: `${window.location.origin}/event/${params?.eventAlias}/agenda/${params?.sessionAlias}`,
                },
              ],
            };
          }
        });
      }

      if (error) throw error;

      return NextResponse.json(
        { msg: "Agenda created successfully", data },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: error,
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "PATCH") {
    try {
      const params = await req.json();

      const {
        sessionModerators,
        sessionSpeakers,
        sessionSponsors,
        ...restData
      } = params;

      const { error } = await supabase
        .from("agenda")
        .update([
          {
            ...params,
          },
        ])
        .eq("id", params?.id);

      if (error) {
        return NextResponse.json(
          {
            error: error?.message,
          },
          {
            status: 400,
          }
        );
      }
      if (error) throw error;

      if (Array.isArray(sessionModerators) && sessionModerators.length > 0) {
        const updatedModerators = sessionModerators?.map((moderator) => {
          if (Array.isArray(moderator?.moderatingAt)) {
            // add to the existing session if it is not present
            // check if session is already present and update

            const presentSession = moderator?.moderatingAt?.session?.find(
              ({ sessionAlias }: { sessionAlias: string }) =>
                sessionAlias === params?.sessionAlias
            )?.sessionAlias;
            const filterModerators = moderator?.moderatingAt?.filter(
              (s: any) => {
                return s.session?.map(
                  ({ sessionAlias }: { sessionAlias: string }) =>
                    sessionAlias !== presentSession
                );
              }
            );

            return {
              ...moderator,
              moderatingAt: [
                ...filterModerators,
                {
                  session: restData,
                  sessionLink: `https://zikoro-git-integrate-ajax484s-projects.vercel.app/event/${params?.eventAlias}/agenda/${params?.sessionAlias}`,
                },
              ],
            };
          } else {
            return {
              ...moderator,
              moderatingAt: [
                {
                  session: restData,
                  sessionLink: `https://zikoro-git-integrate-ajax484s-projects.vercel.app/event/${params?.eventAlias}/agenda/${params?.sessionAlias}`,
                },
              ],
            };
          }
        });

        for (let attendee of updatedModerators) {
          const { error: moderatorError, status } = await supabase
            .from("attendees")
            .update([
              {
                ...attendee,
              },
            ])
            .eq("id", attendee?.id);

          console.log("ddddd", status);

          const { data: aa } = await supabase.from("attendees").select("*");

          if (moderatorError) {
            return NextResponse.json(
              {
                error: moderatorError?.message,
              },
              {
                status: 400,
              }
            );
          }
        }

        // console.log("updated",updatedModerators)
      }

      if (Array.isArray(sessionSpeakers) && sessionSpeakers.length > 0) {
        const updatedSpeakers = sessionSpeakers?.map((speaker) => {
          if (Array.isArray(speaker?.speakingAt)) {
            // add to the existing session if it is not present
            // check if session is already present and update

            const presentSession = speaker?.speakingAt?.session?.find(
              ({ sessionAlias }: { sessionAlias: string }) =>
                sessionAlias === params?.sessionAlias
            )?.sessionAlias;
            const filterSpeakers = speaker?.speakingAt?.filter((s: any) => {
              return s.session?.map(
                ({ sessionAlias }: { sessionAlias: string }) =>
                  sessionAlias !== presentSession
              );
            });

            return {
              ...speaker,
              speakingAt: [
                ...filterSpeakers,
                {
                  session: restData,
                  sessionLink: `https://zikoro-git-integrate-ajax484s-projects.vercel.app/event/${params?.eventAlias}/agenda/${params?.sessionAlias}`,
                },
              ],
            };
          } else {
            return {
              ...speaker,
              speakingAt: [
                {
                  session: restData,
                  sessionLink: `https://zikoro-git-integrate-ajax484s-projects.vercel.app/event/${params?.eventAlias}/agenda/${params?.sessionAlias}`,
                },
              ],
            };
          }
        });

        for (let attendee of updatedSpeakers) {
          const { error: speakerError, status } = await supabase
            .from("attendees")
            .update([
              {
                ...attendee,
              },
            ])
            .eq("id", attendee?.id);

          // console.log('ddddd', status)

          if (speakerError) {
            return NextResponse.json(
              {
                error: speakerError?.message,
              },
              {
                status: 400,
              }
            );
          }
        }

        // console.log("updated",updatedModerators)
      }

      if (Array.isArray(sessionSponsors) && sessionSponsors.length > 0) {
        const updatedSponsors = sessionSponsors?.map((sponsor) => {
          if (Array.isArray(sponsor?.sponsoredSession)) {
            // add to the existing session if it is not present
            // check if session is already present and update

            const presentSession = sponsor?.sponsoredSession?.session?.find(
              ({ sessionAlias }: { sessionAlias: string }) =>
                sessionAlias === params?.sessionAlias
            )?.sessionAlias;
            const filtersponsors = sponsor?.sponsoredSession?.filter(
              (s: any) => {
                return s.session?.map(
                  ({ sessionAlias }: { sessionAlias: string }) =>
                    sessionAlias !== presentSession
                );
              }
            );

            return {
              ...sponsor,
              sponsoredSession: [
                ...filtersponsors,
                {
                  session: restData,
                  sessionLink: `https://zikoro-git-integrate-ajax484s-projects.vercel.app/event/${params?.eventAlias}/agenda/${params?.sessionAlias}`,
                },
              ],
            };
          } else {
            return {
              ...sponsor,
              sponsoredSession: [
                {
                  session: restData,
                  sessionLink: `https://zikoro-git-integrate-ajax484s-projects.vercel.app/event/${params?.eventAlias}/agenda/${params?.sessionAlias}`,
                },
              ],
            };
          }
        });

        for (let partner of updatedSponsors) {
          const { error: sponsorError, status } = await supabase
            .from("eventPartners")
            .update([
              {
                ...partner,
              },
            ])
            .eq("id", partner?.id);

          // console.log('ddddd', status)

          if (sponsorError) {
            return NextResponse.json(
              {
                error: sponsorError?.message,
              },
              {
                status: 400,
              }
            );
          }
        }

        // console.log("updated",updatedModerators)
      }

      return NextResponse.json(
        { msg: "agenda updated successfully" },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error(error, "patch");
      return NextResponse.json(
        {
          error: "An error occurred while making the request.",
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}
