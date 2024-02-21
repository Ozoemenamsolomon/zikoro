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
