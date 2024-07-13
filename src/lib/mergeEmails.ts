export function mergeEmailLists(emailString: string, emailArray: string[]): string[] {
    const splitEmailArray = emailString.split(',').map(email => email.trim());
    const combinedEmailArray = [...splitEmailArray, ...emailArray];
  
    // Remove duplicates
    const seen: { [key: string]: boolean } = {};
    const uniqueEmailArray = combinedEmailArray.filter(email => {
      if (seen[email]) {
        return false;
      } else {
        seen[email] = true;
        return true;
      }
    });
  
    return uniqueEmailArray;
  }