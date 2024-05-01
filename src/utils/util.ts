import { v4 as uuidv4 } from "uuid";

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

export const deploymentUrl = 'https://zikoro-git-integrate-ajax484s-projects.vercel.app'