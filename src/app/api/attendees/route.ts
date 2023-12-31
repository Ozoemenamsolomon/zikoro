import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "POST") {
    try {
      const params = await req.json();

      const { error } = await supabase.from("attendees").insert(params);
      if (error) throw error;
      return NextResponse.json(
        { msg: "attendee created successfully" },
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

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "PATCH") {
    try {
      const params = await req.json();

      const { error } = await supabase
        .from("attendees")
        .upsert(params, { onConflict: "id" });
      if (error) throw error;
      return NextResponse.json(
        { msg: "attendees updated successfully" },
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

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  if (req.method === "GET") {
    try {
      const { data, error, status } = await supabase
        .from("attendees")
        .select("*");

      if (error) throw error;

      return NextResponse.json(
        {
          // data: [
          //   {
          //     id: 29,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-25T22:08:15.85+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "Tola",
          //     lastName: "Badmus",
          //     email: "tola@hotmail.com",
          //     jobTitle: "Software developer",
          //     organization: "Procter and Gamble",
          //     city: "Ikeja",
          //     country: "Nigeria",
          //     phoneNumber: "015771166822",
          //     whatsappNumber: "89000866",
          //     profilePicture: null,
          //     bio: "I manage a small cafe. I'm passionate about making delicious food for others",
          //     x: null,
          //     linkedin: null,
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Standard",
          //     amount: null,
          //     attendeeType: ["attendee", "speaker", "sponsor"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 19,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-25T19:22:39.039+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "Stephen",
          //     lastName: "Jackson",
          //     email: "kachiozo@gmail.com",
          //     jobTitle: "biomechanist",
          //     organization: "Institute of Biomechanics and Orthopaedics",
          //     city: "Lekki",
          //     country: "Nigeria",
          //     phoneNumber: "015771166822",
          //     whatsappNumber: "89000866",
          //     profilePicture: null,
          //     bio: "I recently graduated with an advanced diploma from Smith secondary school. I'm seeking an internship where I can apply my skills in content creation and increase my experience in digital marketing",
          //     x: null,
          //     linkedin: null,
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Standard",
          //     amount: null,
          //     attendeeType: [
          //       "attendee",
          //       "speaker",
          //       "sponsor",
          //       "exhibitor",
          //       "moderator",
          //     ],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 38,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-27T08:56:01.917+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "Patrick",
          //     lastName: "Michael",
          //     email: "Caleb@gmail.com",
          //     jobTitle: "Neurosurgeon",
          //     organization: "Institute of Biomechanics and Orthopaedics",
          //     city: "Mafoluku",
          //     country: "Nigeria",
          //     phoneNumber: "+2345771166822",
          //     whatsappNumber: "+2348994056060",
          //     profilePicture: "C:\\fakepath\\image1.jpg",
          //     bio: null,
          //     x: null,
          //     linkedin: null,
          //     instagram: null,
          //     facebook: null,
          //     ticketType: null,
          //     amount: null,
          //     attendeeType: ["attendee", "speaker"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 24,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-25T19:31:34.95+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "Kennet",
          //     lastName: "Wilson",
          //     email: "kennethi@cedarcrest.com",
          //     jobTitle: "Surgeon",
          //     organization: "Cedarcrest",
          //     city: "Yenagoa",
          //     country: "Nigeria\r\n",
          //     phoneNumber: "015771166822",
          //     whatsappNumber: "89000866",
          //     profilePicture: null,
          //     bio: "I'm a recent college graduate with a Bachelor's Degree in Web Design. I'm seeking a full-time opportunity where I can employ my programming skills.",
          //     x: null,
          //     linkedin: null,
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Early Bird",
          //     amount: null,
          //     attendeeType: ["attendee", "speaker", "organizer"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 28,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-25T22:06:36.411+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "Idris",
          //     lastName: "Tosin",
          //     email: "tosin@hotmail.com",
          //     jobTitle: "Software developer",
          //     organization: "Solid Works International company",
          //     city: "Abeokuta",
          //     country: "Nigeria\r\n",
          //     phoneNumber: "015771166822",
          //     whatsappNumber: "89000866",
          //     profilePicture: null,
          //     bio: "I'm a farmer. I'm passionate about community-supported agriculture and sustainability",
          //     x: null,
          //     linkedin: null,
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Standard",
          //     amount: null,
          //     attendeeType: ["attendee"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 23,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-25T19:26:20.736+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "Godwin",
          //     lastName: "Dike",
          //     email: "kachi@cedarcrest.com",
          //     jobTitle: "Medical doctor",
          //     organization: "Cedarcrest",
          //     city: "Gwagwalada",
          //     country: "Nigeria\r\n",
          //     phoneNumber: "015771166822",
          //     whatsappNumber: "89000866",
          //     profilePicture: null,
          //     bio: "I graduated from State University in May 2020. I'm interning as a grant writer and practising research and writing every day.",
          //     x: null,
          //     linkedin: null,
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Standard",
          //     amount: null,
          //     attendeeType: ["attendee", "speaker"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 27,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-25T22:04:53.253+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "Gabriel",
          //     lastName: "Michael",
          //     email: "gabriel@hotmail.com",
          //     jobTitle: "Scientist",
          //     organization: "MTN",
          //     city: "Ikoyi",
          //     country: "Nigeria\r\n",
          //     phoneNumber: "015771166822",
          //     whatsappNumber: "89000866",
          //     profilePicture: null,
          //     bio: "I can help you with all your information technology needs. I'm certified in cybersecurity and networks",
          //     x: null,
          //     linkedin: null,
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Standard",
          //     amount: null,
          //     attendeeType: ["attendee"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 31,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-25T22:12:46.581+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "Fola",
          //     lastName: "Fadare",
          //     email: "folax@hotmail.com",
          //     jobTitle: "Software developer",
          //     organization: "Nichemtex",
          //     city: "Ketu",
          //     country: "Nigeria",
          //     phoneNumber: "015771166822",
          //     whatsappNumber: null,
          //     profilePicture: null,
          //     bio: "I love helping people start their own businesses. I work as a business consultant at Rosewood Consulting",
          //     x: null,
          //     linkedin: null,
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Standard",
          //     amount: null,
          //     attendeeType: ["attendee", "speaker"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 30,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-25T22:08:15.85+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "Fola",
          //     lastName: "Badmus",
          //     email: "fola@hotmail.com",
          //     jobTitle: "Software developer",
          //     organization: "Nichemtex",
          //     city: "Ikeja",
          //     country: "Nigeria",
          //     phoneNumber: "015771166822",
          //     whatsappNumber: "89000866",
          //     profilePicture: null,
          //     bio: "I'm seeking a position as an architect. I have extensive experience in civil engineering and computer-aided design.",
          //     x: null,
          //     linkedin: null,
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Standard",
          //     amount: null,
          //     attendeeType: ["attendee", "sponsor"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 33,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-27T07:49:53.737+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "bilal",
          //     lastName: "Yusuf",
          //     email: "bilalyusufuba@gmail.com",
          //     jobTitle: "Full Stack Developer ",
          //     organization: "Advanced technology Limited",
          //     city: "Ketu",
          //     country: "Nigeria",
          //     phoneNumber: "8029336570",
          //     whatsappNumber: "8029336571",
          //     profilePicture: null,
          //     bio: null,
          //     x: null,
          //     linkedin: "https://www.linkedin.com/in/bilal-yusuf-450871199/",
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Standard",
          //     amount: null,
          //     attendeeType: ["attendee"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 36,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-27T07:49:53.737+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "bilal",
          //     lastName: "Yusuf",
          //     email: "bilalyusufuba443@gmail.com",
          //     jobTitle: "Full Stack Developer ",
          //     organization: "Advanced technology Limited",
          //     city: "Ketu",
          //     country: "Nigeria",
          //     phoneNumber: "+23480293365718029336570",
          //     whatsappNumber: "+2348029336571",
          //     profilePicture: null,
          //     bio: null,
          //     x: null,
          //     linkedin: "https://www.linkedin.com/in/bilal-yusuf-450871199/",
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Late Bird",
          //     amount: null,
          //     attendeeType: ["attendee", "exhibitor", "sponsor"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 37,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-27T07:49:53.737+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "bilal",
          //     lastName: "Yusuf",
          //     email: "bilalyusuf@gmail.com",
          //     jobTitle: "Full Stack Developer ",
          //     organization: "Advanced technology Limited",
          //     city: "Ketu",
          //     country: "Nigeria",
          //     phoneNumber: "+23480293365718029336570",
          //     whatsappNumber: "+2348029336571",
          //     profilePicture: null,
          //     bio: null,
          //     x: null,
          //     linkedin: "https://www.linkedin.com/in/bilal-yusuf-450871199/",
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Late Bird",
          //     amount: null,
          //     attendeeType: ["attendee", "exhibitor", "sponsor", "speaker"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          //   {
          //     id: 26,
          //     eventId: 1234567890,
          //     registrationDate: "2023-12-25T19:36:27.578+00:00",
          //     userEmail: "ubahyusuf484@gmail.com",
          //     firstName: "Afolabi",
          //     lastName: "Michael",
          //     email: "Afolabi@cedarcrest.com",
          //     jobTitle: "Scientist",
          //     organization: "Dangote Cement Nigeria Limited",
          //     city: "Abuja",
          //     country: "Nigeria\r\n",
          //     phoneNumber: "015771166822",
          //     whatsappNumber: "89000866",
          //     profilePicture: null,
          //     bio: "I'm passionate about writing engaging content for businesses. I specialise in topics like technology, travel and food.r",
          //     x: null,
          //     linkedin: null,
          //     instagram: null,
          //     facebook: null,
          //     ticketType: "Late Bird",
          //     amount: null,
          //     attendeeType: ["attendee", "speaker"],
          //     tag: null,
          //     checkin: null,
          //     certificate: true,
          //     badge: null,
          //   },
          // ],
          data,
        },
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

export const dynamic = "force-dynamic";
