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
              width:100;
              height:100;
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
              font-size:24px;
              ">${quiz?.coverTitle}</p>


              <p style="
              font-weight:600;
              font-size:24px;
              
              margin-bottom:1rem;
              margin-top:3rem;
              text-align:center;
              ">${mailto?.attendeePoint}</p>
              <p
              style="
              text-align:center;
              "
              >Points</p>

              <div
              style="
              background:#ffffff;
              border-radius:2rem;
              padding:1rem;
              max-width:576px;
              margin:0 auto;
              height: fit-content;
              "
              >
              <p style"text-align:center; margin-bottom:2.5rem;">Share the quiz with friends</p>

              <div
                style="
                  display: flex;
                  align-items: center;
                  flex-direction: row;
                  gap: 0.75rem;
                "
              >
                <a style="margin-right:15px;" href="https://api.whatsapp.com/send?text=${
                  mailto?.url
                }">
               <img src="https://res.cloudinary.com/dkdrbjfdt/image/upload/v1730763544/ic--baseline-whatsapp_di4kh5.svg" style="width:30px; height:30px;" >
                </a>
                <a style="margin-right:15px;" target="_blank" href="https://x.com/intent/tweet?url=${
                  mailto?.url
                }">
                 <img src="https://res.cloudinary.com/dkdrbjfdt/image/upload/v1730763623/pajamas--twitter_ripnam.svg" style="width:30px; height:30px;">
                </a>
                <a style="margin-right:15px;" href="https://www.facebook.com/sharer/sharer.php?u=${
                  mailto?.url
                }">
                  <img src="https://res.cloudinary.com/dkdrbjfdt/image/upload/v1730763652/iconoir--facebook_hvcxpw.svg" style="width:30px; height:30px;" >
                </a>
                 <a style="margin-right:15px;" href="https://www.linkedin.com/shareArticle?url=${
                   mailto?.url
                 }">
                  <img src="https://res.cloudinary.com/dkdrbjfdt/image/upload/v1730764522/hugeicons--linkedin-02_fm0or0.svg" style="width:30px; height:30px;" >
                </a>
               
              </div>
            </div>

            <a
            style="
              margin:0 auto;
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
                <h4
                text-align:center;
                margin-top:6rem;
                margin-bottom:1rem;
                >Organize your own ${
                  quiz?.interactionType !== "poll" ? "quiz" : "poll"
                } now</h4>

              <a
             style="
              margin:0 auto;
              width:fit-content;
             "

              href="${deploymentUrl}${mailto?.createQuiz}"
              >
                 <button
            style="
            border:0;
            border-radius:8px;
             
             padding:4px;
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
