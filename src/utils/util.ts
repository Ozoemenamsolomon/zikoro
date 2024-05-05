import { v4 as uuidv4 } from "uuid";
import axios from "axios"
// call phone
export function phoneCall(number?: string) {
  window.open(`tel:${number}`, "_blank");
}
// chat on whatsapp
export function whatsapp(number?: string, message?: string) {
  let url = `https://wa.me/${number}`;
  if (message) {
    // Encode the message to be included in the URL
    const encodedMessage = encodeURIComponent(message);
    url += `?text=${encodedMessage}`;
  }
  window.open(url, "_blank");
}

// send mail
export function sendMail(mail?: string) {
  window.open(`mailto:${mail}`, "_blank");
}


export function isEventLive(startTime: string, endTime: string): boolean {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  const currentDate = new Date();

  const isLive = currentDate >= startDate && currentDate <= endDate;

  return isLive;
}


export function generateAlias():string {
const alias = uuidv4().replace(/-/g, "").substring(0, 20);

  return alias
} 

export const formatReviewNumber = (number: number):string => {
  if (number === 0) {
    return "0";
  }
  const suffixes = ["", "k", "M", "B", "T"];
  const suffixNum = Math.floor(Math.log10(number) / 3);

  if (suffixNum === 0) {
    return number.toString();
  }

  const shortValue = (number / Math.pow(1000, suffixNum)).toFixed(1);
  return shortValue + suffixes[suffixNum];
};


interface GeocodeResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  status: string;
}


export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; 

  const response = await axios.get<GeocodeResponse>(
    `https://maps.googleapis.com/maps/api/geocode/json`,
    {
      params: {
        address,
        key: googleMapsApiKey,
      },
    }
  );

  if (response.data.status !== "OK") {
    throw new Error("Failed to geocode address");
  }

  const { lat, lng } = response.data.results[0].geometry.location;
  return { lat, lng };
};


export const deploymentUrl = 'https://www.zikoro.com'


