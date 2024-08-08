export async function uploadFile(file: File | string, type: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("cloud_name", "zikoro");
  formData.append("upload_preset", "w5xbik6z");
  formData.append("folder", "ZIKORO");
  if (type === "video") {
    formData.append("resource_type", "video");
  } else if (type === "pdf") {
    formData.append("resource_type", "raw");
  //  formData.append("format", "pdf");
  } else {
    formData.append("resource_type", "image");
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/zikoro/${
        type === "pdf" ? "raw" : type
      }/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();

      return data.secure_url;
    } else {
      console.error("Failed to upload image");
      return null;
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}
