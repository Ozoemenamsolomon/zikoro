
export async function uploadFile(file: File | string, type:string) {

  const formData = new FormData();
  formData.append("file", file);
  formData.append("cloud_name", "kachiozo");
  formData.append("upload_preset", "w5xbik6z" );
  formData.append( "folder", "ZIKORO" );
  type === "video" && formData.append("resource_type", "video");


  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/kachiozo/${type}/upload`,
      {
        method: "POST",
        body: formData,
      } 
    );

    if (response.ok) {
      const data = await response.json();
     
      return data.url
    } else {
      console.error("Failed to upload image");
      return null;
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}
