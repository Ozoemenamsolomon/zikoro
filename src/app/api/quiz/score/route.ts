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
        <p>Hi dear,</p>
<p>Your quiz score is now available. You can view your score here: <a style="color:#0001fcc;" href=${deploymentUrl}${mailto?.url}> Quiz Score</a></p>
<br/>
<p>Interested in creating your own quiz? It's easy on <a href="https://www.zikoro.com">www.zikoro.com</a>! Here's how:</p>
<p>1.	Create an account by signing up on <a href="https://www.zikoro.com">www.zikoro.com</a>.</p>
<p>2.	Create a New Event: Start by creating a new event on our platform.</p>
<p>3.	Engage Your Audience: Navigate to the "Engagement" tab and select " + Interaction".</p>
<p>4.	Choose Quiz: Select "Quiz" as one of the interaction features to make your event even more engaging.</p>
<br/>
<p>Quizzes are just one of the many interactive features on <a href="https://www.zikoro.com">www.zikoro.com</a> designed to enhance your events. </p>

We look forward to seeing what you create!


<p>Best regards,</p>
<p>The Zikoro.com Team</p>

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