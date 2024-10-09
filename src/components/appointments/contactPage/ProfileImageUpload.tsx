'use client';
import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'react-toastify';

// Cloudinary upload function
export const uploadImage = async (file: File) => {
  const formDataToSend = new FormData();
  formDataToSend.append("file", file);
  formDataToSend.append("upload_preset", "w5xbik6z");
  formDataToSend.append("folder", "ZIKORO");

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/zikoro/image/upload`, {
      method: "POST",
      body: formDataToSend,
    });

    if (res.ok) {
      const data = await res.json();
      toast.success("Image uploaded successfully!");
      return data.secure_url;
    } else {
      toast.error("Failed to upload image.");
    }
  } catch (error) {
    toast.error(`Error: ${error}`);
  }
};

interface ProfileImageUploadProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ formData, setFormData }) => {
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, profileImg: imageUrl }));
      }
    } else {
      toast.error("Only image files are allowed.");
    }
  };

  return (
    <div className="relative h-20 w-20 rounded-full bg-baseLight uppercase font-semibold shrink-0 flex items-center text-2xl justify-center">
      {formData?.profileImg ? (
        <img
          src={formData?.profileImg || ''}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        formData.name.slice(0, 2).toUpperCase()
      )}

      <label htmlFor="profile-upload" className="border absolute -right-2 bottom-0 rounded-full bg-white p-2 cursor-pointer">
        <Pencil size={16} className="border-b border-black" />
        <input
          id="profile-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
};

export default ProfileImageUpload;
