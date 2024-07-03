import { v4 as uuidv4 } from 'uuid';

export const generateSlug = (name: string): string => {
  // const slug = name.toLowerCase()
  //   .replace(/\s+/g, '-')
  //   .replace(/[^a-z0-9\-]/g, '');

  const uniqueIdentifier = uuidv4();

  return `${uniqueIdentifier}`;
};
