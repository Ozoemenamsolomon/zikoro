// Function to share on Facebook
export const shareOnFacebook = (url: string) => {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  window.open(shareUrl, "_blank", "width=600,height=400");
};

// Function to share on Twitter
export const shareOnTwitter = (url: string, postId?: string) => {
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=Check%20out%20this%20article%20on%20Twitter`;
  window.open(shareUrl, "_blank", "width=600,height=400");
};

// Function to share on Instagram
export const shareOnInstagram = () => {
  // Instagram sharing is not directly supported via URL,
  // you may need to use a library or SDK to integrate it.
};

// Function to share on LinkedIn
export const shareOnLinkedin = (url: string, postId?: string) => {
  const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
    url
  )}&title=Check%20out%20this%20article`;
  window.open(shareUrl, "_blank", "width=600,height=400");
};
