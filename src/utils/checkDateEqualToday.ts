const checkDateEqualToday = (dateString: string | null): boolean => {
  if (!dateString) {
    return false; // Return false if dateString is null or undefined
  }

  const today = new Date();
  const dateOnlyString = dateString.split('T')[0]; // Extracting date portion only
  const date = new Date(dateOnlyString);

  // Compare the provided date with today's date
  return date <= today;
};

export default checkDateEqualToday;