"use server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function addEvent(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const eventTitle = formData.get("eventTitle");
  const industry = formData.get("industry");
  const eventCategory = formData.get("eventCategory");
  const expectedParticipants = formData.get("noOfParticipants");
  const eventVisibility = formData.get("eventVisibility");
  const startDateTime = formData.get("startDateAndTime");
  const endDateTime = formData.get("endDateAndTime");
  const locationType = formData.get("locationType");
  const description = formData.get("eventDesc");
  const eventAddress = formData.get("eventAddress");
  const eventCountry = formData.get("eventCountry");
  const eventPoster = [
    {
      url: formData.get("eventPoster"),
    },
  ];
  const organisationLogo = [
    {
      url: formData.get("organisationLogo"),
    },
  ];
  const prerequisites = formData.get("prerequisites");
  const benefits = formData.get("benefits");
  const pricingCurrency = formData.get("pricingCurrency");
  const pricing = [
    {
      earlyBird: formData.get("earlyBird"),
      validity: formData.get("earlyBirdValidity"),
    },
    {
      standard: formData.get("standard"),
      validity: formData.get("standardValidity"),
    },
    {
      lateBird: formData.get("lateBird"),
      validity: formData.get("lateBirdValidity"),
    },
  ];

  const { error }: any = await supabase.from("events").insert([
    {
      organisationId: Math.floor(Math.random() * 1000000),
      createdBy: "blessing@gmail.com",
      published: false,
      eventTitle,
      industry,
      eventCategory,
      expectedParticipants,
      eventVisibility,
      startDateTime,
      endDateTime,
      locationType,
      description,
      eventAddress,
      eventCountry,
      eventPoster,
      organisationLogo,
      prerequisites,
      benefits,
      pricingCurrency,
      pricing,
    },
  ]);

  if (error) {
    console.log(error);
  }
  // console.log(data?.organisationId);
  return { message: "success" };
}

// "createdAt" timestamp with time zone DEFAULT now(),
// "organisationId" text COLLATE pg_catalog."default" NOT NULL,
// "createdBy" text COLLATE pg_catalog."default" NOT NULL,
// "eventTitle" text COLLATE pg_catalog."default" NOT NULL,
// published boolean NOT NULL,
// "startDateTime" timestamp without time zone,
// "endDateTime" timestamp without time zone,
// "eventVisibility" text COLLATE pg_catalog."default",
// industry text COLLATE pg_catalog."default" NOT NULL,
// "eventCategory" text COLLATE pg_catalog."default" NOT NULL,
// "expectedParticipants" bigint,
// "bookedSpot" bigint,
// "locationType" text COLLATE pg_catalog."default",
// "eventAddress" text COLLATE pg_catalog."default",
// "eventCity" text COLLATE pg_catalog."default",
// "eventPoster" json,
// "organisationLogo" text COLLATE pg_catalog."default",
// description character varying COLLATE pg_catalog."default",
// prerequisites text COLLATE pg_catalog."default",
// benefits json,
// "pricingCurrency" text COLLATE pg_catalog."default",
// pricing json,
// "organisationName" text COLLATE pg_catalog."default",
// country text COLLATE pg_catalog."default",
// "phoneNumber" text COLLATE pg_catalog."default",
// "whatsappNumber" text COLLATE pg_catalog."default",
// email text COLLATE pg_catalog."default",
// x text COLLATE pg_catalog."default",
// linkedin text COLLATE pg_catalog."default",
// instagram text COLLATE pg_catalog."default",
// facebook text COLLATE pg_catalog."default",
// "trainingDuration" bigint,
// "badgeColour" text COLLATE pg_catalog."default",
// "badgeHeader" text COLLATE pg_catalog."default",
// "badgeAvatar" text COLLATE pg_catalog."default",
// "badgeName" text COLLATE pg_catalog."default",
// "badgeJobTitle" text COLLATE pg_catalog."default",
// "badgeOrganizationName" text COLLATE pg_catalog."default",
// "badgeAttendeeType" text COLLATE pg_catalog."default",
// CONSTRAINT training_pkey PRIMARY KEY (id)
