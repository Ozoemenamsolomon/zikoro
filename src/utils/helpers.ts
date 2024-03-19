import { TAttendee } from "@/types/attendee";
import { TEvent } from "@/types/events";
import { TOrganization } from "@/types/organization";
import * as crypto from "crypto";

export function extractUniqueTypes<T>(
  arr: T[],
  ppty: keyof T
): { label: string; value: string }[] {
  const uniqueTypesSet = new Set<string>(
    arr.flatMap((obj) => {
      const value = obj[ppty];
      return value != null ? (Array.isArray(value) ? value : [value]) : [];
    })
  );

  return Array.from(uniqueTypesSet).map((value) => ({
    label: value,
    value,
  }));
}

type CamelCaseObject = { [key: string]: any };

export function convertCamelToNormal<T extends CamelCaseObject>(
  data: T[],
  separator: "-" | "_" | " "
): T[] {
  return data.map((item) => {
    const convertedItem: CamelCaseObject = {};

    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const newKey = key
          .replace(/([a-z])([A-Z])/g, `$1${separator}$2`)
          .toLowerCase();

        convertedItem[newKey] = item[key];
      }
    }

    return convertedItem as T;
  });
}

export function calculateAndSetMaxHeight(
  divRef: React.RefObject<HTMLDivElement>
) {
  const div = divRef.current;

  if (div) {
    // Get the distance from the top of the div to the bottom of the screen
    const distanceToBottom = window.innerHeight - div.offsetTop;

    // Set the maximum height of the div
    div.style.maxHeight = `${distanceToBottom}px`;
  }
}

export function generateAlphanumericHash(length?: number): string {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const hashLength = length || 18;
  let hash = "";

  for (let i = 0; i < hashLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    hash += characters.charAt(randomIndex);
  }

  return hash;
}

export function createHash(data: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

export function getProperty<T>(obj: T, key: keyof T): any {
  if (typeof obj === "object" && obj !== null && key in obj) {
    return (obj as Record<keyof T, any>)[key];
  }
  return null; // Handle the case where the key is not present
}

export function areAllPropertiesSet(obj: Record<string, any>): boolean {
  for (const key in obj) {
    if (
      (obj.hasOwnProperty(key) && obj[key] === undefined) ||
      obj[key] === null ||
      obj[key] === ""
    ) {
      return false;
    }
  }
  return true;
}

export function findKeysWithSharedValue(
  map: Map<any, any>
): Map<string, any[]> {
  const encounteredValues: Map<string, any[]> = new Map();

  for (let [key, value] of Array.from(map)) {
    if (encounteredValues.has(value) && value) {
      encounteredValues.get(value)!.push(key);
    } else {
      encounteredValues.set(value, [key]);
    }
  }

  // Filter and return only entries where multiple keys share the same value
  return new Map(
    Array.from(encounteredValues.entries()).filter(
      ([value, keys]) => keys.length > 1
    )
  );
}

export async function uploadFiles(files: File[]) {
  const url =
    "https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/image/upload";

  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    try {
      let file = files[i];
      formData.append("file", file);
      // formData.append("upload_preset", "docs_upload_example_us_preset");
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.text();
        alert("Files uploaded successfully");
      } else {
        throw new Error("Failed to upload files");
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export async function uploadFile(
  file: File | string,
  type: string
): Promise<{ url: string | null; error: any | null }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("cloud_name", "kachiozo");
  formData.append("upload_preset", "w5xbik6z");
  formData.append("folder", "ZIKORO");
  type === "video" && formData.append("resource_type", "video");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/kachiozo/${type}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();

      return { url: data.url, error: null };
    } else {
      throw "failed to upload file";
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return { url: null, error };
  }
}

export function base64ToFile(base64Data: string, fileName: string): File {
  const byteCharacters = atob(base64Data.split(",")[1]);
  const byteNumbers = new Array<number>(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/png" });

  return new File([blob], fileName, { type: "image/png" });
}

type Context = {
  attendee: TAttendee;
  event: TEvent;
  organization: TOrganization;
};

export function replaceSpecialText(obj: any, context: Context): any {
  console.log("replace func");
  if (typeof obj === "string") {
    console.log("string");
    return obj.replaceAll(/#{(.*?)#}/g, (match) => {
      const value = match.slice(2, -2);
      console.log(value, "the value");
      switch (value.trim()) {
        case "first_name":
          console.log(context.attendee.firstName);
          return context.attendee.firstName;
        case "last_name":
          console.log(context.attendee.lastName);
          return context.attendee.lastName;
        case "attendee_email":
          console.log(context.attendee.email);
          return context.attendee.email;
        case "attendee_job":
          console.log(context.attendee.jobTitle);
          return context.attendee.jobTitle || "";
        case "attendee_position":
          console.log(context.attendee.organization);
          return context.attendee.organization || "";
        case "attendee_id":
          console.log(context.attendee.id);
          return String(context.attendee.id);
        case "event_name":
          console.log(context.event.eventTitle);
          return context.event.eventTitle;
        case "city":
          console.log(context.event.eventCity)
          return context.event.eventCity || "";
        case "country":
          console.log(context.event.eventCountry)
          return context.event.eventCountry || "";
        case "start_date":
          return context.event.startDateTime?.toLocaleDateString() || "";
        case "end_date":
          return context.event.endDateTime?.toLocaleDateString() || "";
        case "organization_name":
          return context.organization.organizationName;
        case "organisation_logo":
          return context.organization.organizationLogo || "";
        default:
          return match; // Return the original string if no matching value found
      }
    });
  } else if (Array.isArray(obj)) {
    console.log("arr");
    return obj.map((item) => replaceSpecialText(item, context));
  } else if (typeof obj === "object" && obj !== null) {
    console.log("obj");
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = replaceSpecialText(obj[key], context);
    }
    return newObj;
  } else {
    return obj;
  }
}
