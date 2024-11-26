import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { deploymentUrl } from "@/utils";
export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "PATCH") {
    try {
      const params = await req.json();
      const { quiz, mailto } = params;

      const { error } = await supabase
        .from("quiz")
        .update([
          {
            ...quiz,
          },
        ])
        .eq("quizAlias", quiz?.quizAlias);

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

      var { SendMailClient } = require("zeptomail");

      let client = new SendMailClient({
        url: process.env.NEXT_PUBLIC_ZEPTO_URL,
        token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
      });

      const resp = await client.sendMail({
        from: {
          address: process.env.NEXT_PUBLIC_EMAIL,
          name: "Zikoro",
        },
        to: [
          {
            email_address: {
              address: mailto?.email,
              name: "Player",
            },
          },
        ],
        subject: `Your ${quiz?.coverTitle} Quiz Score`,
        htmlbody: `<div>
 <div
              style="
                max-width: 600px;
                margin: 0 auto;
                display: block;
                padding-bottom: 1rem;
                margin-bottom: 1rem;
                border-bottom: 1px solid #b4b4b4;
              "
            >
              <div style="width:100; height:80px;">
              <img alt="ad" 
              style="
            
              " src="https://res.cloudinary.com/dkdrbjfdt/image/upload/v1730758848/qhurray_pofqdf.png" >
              </div>

              <p style="
              font-weight:600;
              font-size:28px;
              color: #001FCC;
              margin-bottom:2rem;
              margin-top:2rem;
              text-align:center;
              ">Hurray 🥳</p>

                <p style="
              margin-bottom:1rem;
              margin-top:1rem;
              text-align:center;
              ">You have completed the ${
                quiz?.interactionType !== "poll" ? "quiz" : "poll"
              }</p>
               <p style="
              margin-bottom:1rem;
              margin-top:1rem;
              text-align:center;
                font-weight:600;
              font-size:22px;
              ">${quiz?.coverTitle}</p>


            ${quiz?.interactionType !== "poll" &&  `<p style="
              font-weight:600;
              font-size:24px;
              
              margin-bottom:1rem;
              margin-top:3rem;
              text-align:center;
              ">${Number(mailto?.attendeePoint)?.toFixed(0)}</p>`}
             ${ quiz?.interactionType !== "poll" && `<p
              style="
              text-align:center;
              "
              >Points</p>`}

              <div
              style="
              background: #ffffff;
              border-radius: 1rem;
              padding: 1rem;
              max-width: 576px;
              margin: 0 auto;
              height: fit-content;
              "
              >
              <p style"text-align: center; margin-bottom: 2.5rem;">Share the quiz with friends</p>

              <div
                style="
                  display: flex;
                  align-items: center;
                  flex-direction: row;
                  justify-content: center;
                  gap: 0.75rem;
                   margin: 0 auto;
                   width: fit-content;
                "
              >
                <a style="margin-right:15px;" href="https://api.whatsapp.com/send?text=${
                  mailto?.url
                }">
             <span style="display:inline-block; width:24px; height:24px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"/></svg>
             </span>
                </a>
                <a style="margin-right:15px;" target="_blank" href="https://x.com/intent/tweet?url=${
                  mailto?.url
                }">
                  <span style="display:inline-block; width:24px; height:24px;">
                 <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M9.294 6.928L14.357 1h-1.2L8.762 6.147L5.25 1H1.2l5.31 7.784L1.2 15h1.2l4.642-5.436L10.751 15h4.05zM7.651 8.852l-.538-.775L2.832 1.91h1.843l3.454 4.977l.538.775l4.491 6.47h-1.843z"/></svg>
               </span>
                 </a>
                <a style="margin-right:15px;" href="https://www.facebook.com/sharer/sharer.php?u=${
                  mailto?.url
                }">
                  <span style="display:inline-block; width:24px; height:24px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </span>
                  </a>
                 <a style="margin-right:15px;" href="https://www.linkedin.com/shareArticle?url=${
                   mailto?.url
                 }">
                   <span style="display:inline-block; width:24px; height:24px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.5 9.5H4c-.943 0-1.414 0-1.707.293S2 10.557 2 11.5V20c0 .943 0 1.414.293 1.707S3.057 22 4 22h.5c.943 0 1.414 0 1.707-.293S6.5 20.943 6.5 20v-8.5c0-.943 0-1.414-.293-1.707S5.443 9.5 4.5 9.5m2-5.25a2.25 2.25 0 1 1-4.5 0a2.25 2.25 0 0 1 4.5 0m5.826 5.25H11.5c-.943 0-1.414 0-1.707.293S9.5 10.557 9.5 11.5V20c0 .943 0 1.414.293 1.707S10.557 22 11.5 22h.5c.943 0 1.414 0 1.707-.293S14 20.943 14 20v-3.5c0-1.657.528-3 2.088-3c.78 0 1.412.672 1.412 1.5v4.5c0 .943 0 1.414.293 1.707s.764.293 1.707.293h.499c.942 0 1.414 0 1.707-.293c.292-.293.293-.764.293-1.706L22 14c0-2.486-2.364-4.5-4.703-4.5c-1.332 0-2.52.652-3.297 1.673c0-.63 0-.945-.137-1.179a1 1 0 0 0-.358-.358c-.234-.137-.549-.137-1.179-.137" color="currentColor"/></svg>
                 </span>
                  </a>
               
              </div>
            </div>

            <a
            style="
              margin:0 auto;
              display:block;
              text-align:center;
              width:fit-content;
             "
             href="${deploymentUrl}${mailto?.leaderboard}"
            >
              <button
            style="
            border:0;
            border-radius:8px;
             background: linear-gradient(to right, #001FCC19 0%, #9D00FF19 100%);
             padding:4px;
             color:#001fcc;
             margin:3rem auto;
           
              
            "
            >Leaderboard</button> 
            </a>
          

             <div
             max-width: 600px;
                margin: 0 auto;
                margin-top:6rem;
                display: block;
                height:fit-content;
                padding:1rem;
                background: linear-gradient(to right, #001FCC19 0%, #9D00FF19 100%);

             >

                <div style="margin: 0 auto;">
              <img alt="adw" 
              style="
              
              " src="https://res.cloudinary.com/dkdrbjfdt/image/upload/v1730758845/qhuman_czpvvs.png" >
              </div>
                <p
                text-align:center;
                margin-top:6rem;
                margin-bottom:0.5rem;
                font-weight:600;
                font-size:26px;
                >Organize your own ${
                  quiz?.interactionType !== "poll" ? "quiz" : "poll"
                } now</p>

              <a
             style="
              margin:0 auto;
              width:160px;
             "

              href="${deploymentUrl}/create"
              >
                 <button
            style="
            border:0;
            border-radius:8px;
             
             padding:8px;
             background:#001fcc;
             color:#ffffff;
             margin:0 auto;
           
              
            "
            >Create your own ${
              quiz?.interactionType !== "poll" ? "quiz" : "poll"
            }!</button>
              </a>
                
             </div>
              </div>

             </div>`,
      });

      return NextResponse.json(
        { msg: "quiz updated successfully" },
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
export const dynamic = "force-dynamic";
