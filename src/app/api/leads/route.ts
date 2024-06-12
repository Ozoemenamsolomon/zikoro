import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// const DUMMY_DATA = [
//   {
//     id: 1,
//     eventId: "EVT001",
//     createdAt: "2024-06-11T08:00:00Z",
//     boothStaffId: 101,
//     firstName: "John",
//     lastName: "Doe",
//     attendeeEmail: "john.doe@example.com",
//     jobTitle: "Software Engineer",
//     organization: "Tech Corp",
//     city: "San Francisco",
//     country: "USA",
//     phoneNumber: "+1 (123) 456-7890",
//     whatsappNumber: "+1 (123) 456-7890",
//     profilePicture: "https://example.com/profile.jpg",
//     bio: "Experienced software engineer with a passion for innovation.",
//     x: null,
//     linkedin: "https://www.linkedin.com/in/johndoe",
//     instagram: null,
//     facebook: null,
//     ticketType: "VIP",
//     attendeeType: ["Attendee"],
//     attendeeAlias: null,
//     attendeeId: 123456789,
//     firstContactChannel: "Email",
//     websiteUrl: "https://www.techcorp.com",
//     eventAlias: "TechExpo2024",
//     interests: ["programming", "IoT"],
//     boothStaffEmail: "staff@example.com",
//     stampCard: true,
//   },
//   {
//     id: 2,
//     eventId: "EVT001",
//     createdAt: "2024-06-11T09:30:00Z",
//     boothStaffId: 102,
//     firstName: "Jane",
//     lastName: "Smith",
//     attendeeEmail: "jane.smith@example.com",
//     jobTitle: "Data Scientist",
//     organization: "Data Insights Inc.",
//     city: "New York City",
//     country: "USA",
//     phoneNumber: "+1 (987) 654-3210",
//     whatsappNumber: null,
//     profilePicture: null,
//     bio: "Passionate about leveraging data for actionable insights.",
//     x: null,
//     linkedin: "https://www.linkedin.com/in/janesmith",
//     instagram: "https://www.instagram.com/janesmith",
//     facebook: null,
//     ticketType: "Standard",
//     attendeeType: ["Attendee"],
//     attendeeAlias: null,
//     attendeeId: 987654321,
//     firstContactChannel: "LinkedIn",
//     websiteUrl: null,
//     eventAlias: "TechExpo2024",
//     interests: ["data analytics", "machine learning"],
//     boothStaffEmail: "staff@example.com",
//     stampCard: false,
//   },
// ];

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { data, error, status } = await supabase.from("Leads").select("*");

      if (error) throw error;

      console.log(data);

      return NextResponse.json(
        { data },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error(error);
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

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const payload = await req.json();

      const { error } = await supabase.from("Leads").insert(payload);
      if (error) throw error;
      return NextResponse.json(
        { msg: "favourites updated successfully" },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error);
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
