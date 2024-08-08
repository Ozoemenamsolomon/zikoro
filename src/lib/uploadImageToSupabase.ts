import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const uploadImageToSupabase = async (file: File) => {
  const filePath = `images/${file.name}`;

  const { data, error } = await supabase.storage
    .from('public')
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { publicURL, error: urlError } = supabase.storage
    .from('public')
    .getPublicUrl(filePath);

  if (urlError) {
    throw urlError;
  }

  return publicURL;
};
