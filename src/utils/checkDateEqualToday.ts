const checkDateEqualToday = (dateString: string | null): boolean => {
  if (!dateString) {
    return false; // Return false if dateString is null or undefined
  }

  const today = new Date();
  const date = new Date(dateString);

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

export default checkDateEqualToday;
