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
  
  const industryType = [
    "Medical",
    "Technology",
    "Business",
    "Marketing",
    "Training & Education",
    "Entertainment & media",
    "Science & Research",
    "Wellness, Health and Fitness",
    "Banking & Finance",
    "Engineering",
    "Building & Construction",
    "Animals & Pets",
    "Hospitality",
    "Food & Beverages",
    "Arts & Crafts",
    "Agriculture & Forestry",
    "Energy",
    "Beauty & Fashion",
    "Environment & Waste",
    "Logistics & Transportation",
    "Home & Office",
    "Security & Defense",
    "Travel & Tourism",
    "Telecommunication",
    "Others",
  ];
  
  export const industryArray = industryType.map((v) => {
    return {
      value: v,
      label: v,
    };
  });
  
  const categoryOptions = [
    "Conferences",
    "Tradeshows & Exhibition",
    "Seminar & Workshops",
    "Networking",
    "Cultural & Arts",
    "Celebrations",
    "Sports",
    "Job Fairs",
    "Festivals",
    "Charity",
  ];
  
  export const categories = categoryOptions.map((v) => {
    return {
      value: v,
      label: v,
    };
  });
  
  export const locationType = [
    { value: "Onsite", label: "Onsite" },
    { value: "Virtual", label: "Virtual" },
    { value: "Hybrid", label: "Hybrid" },
  ];
  export const pricingCurrency = [
    { value: "USD", label: "USD" },
    { value: "NGN", label: "NGN" },
    { value: "GHC", label: "GHC" },
    { value: "ZAR", label: "ZAR" },
    { value: "KES", label: "KES" },
  ];
  