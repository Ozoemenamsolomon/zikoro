'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { AppointmentFormData } from '@/types/appointments';
import {  XCircle} from 'lucide-react';
import { ImgaeIcon, } from '@/constants';



export const uploadImage = async (files: File[]) => {
    if(!files?.length) return

    const formDataToSend = new FormData();
    files.forEach(file => {
      formDataToSend.append("file", file);
      formDataToSend.append("upload_preset", "w5xbik6z");
      formDataToSend.append("folder", "ZIKORO");
    });

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/zikoro/image/upload`, {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Image Uploaded");
        return data.url;
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      toast.error(`Error uploading image: ${error}`);
    }
  };

interface UploadImageProps {
    formData: AppointmentFormData;
    setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
    multiple?: boolean;
}

const UploadImage: React.FC<UploadImageProps> = ({ formData, setFormData, multiple = false }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.some(file => !file.type.startsWith('image/'))) {
      toast.error("Only image files are allowed");
      return;
    }
    setFormData( (prev:AppointmentFormData) => {
        return {
            ...prev,
            files: multiple && formData?.files ? [...formData?.files, ...selectedFiles] : selectedFiles
            }
        })
    }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selectedFiles = Array.from(e.dataTransfer.files);
    if (selectedFiles.some(file => !file.type.startsWith('image/'))) {
      toast.error("Only image files are allowed");
      return;
    }
    setFormData( (prev:AppointmentFormData) => {
        return {
            ...prev,
            files: multiple && formData?.files ? [...formData?.files, ...selectedFiles] : selectedFiles
        }
    })
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clear = () => {
    setFormData( (prev:AppointmentFormData) => {
        return {
            ...prev,
            files:null
        }
    })
  }

return (
    <div className="" onDrop={handleDrop} onDragOver={handleDragOver}>
      <input
        type="file"
        onChange={handleImageChange}
        className="hidden"
        multiple={multiple}
        accept="image/*"
        id="upload-input"
      />
      <div className="flex gap-2">
      <label htmlFor="upload-input" className="cursor-pointer flex items-end gap-1 text-">
        <div className=" w-44">
            <p className="pb-4">Logo</p>
            <div className="border-b px-2 flex items-center gap-3 text-gray-500 pb-2">
            <ImgaeIcon/>
            <p>Upload Logo</p>
            </div>
        </div>
        
        <div className=" flex flex-wrap gap-4">
        {formData?.files ? 
          formData?.files?.map((file, index) =>{ 
          return (
          <div key={index} className="relative w-16 h-16 overflow-hidden border rounded-lg">
            <img
              src={file ? URL.createObjectURL(file) : formData?.logo || ''}
              alt={`preview ${index}`}
              className="object-contain w-full h-full"
            />
          </div>
          )})
          :
          <div className="relative w-16 h-16 overflow-hidden border rounded-lg">
            <img
              src={ formData?.logo || ''}
              alt={`preview `}
              className="object-contain w-full h-full"
            />
          </div>
        }
      </div>
      </label>

     {formData?.files?.length ? <div onClick={clear} className="text-red-600"><XCircle size={20} /></div> : null}
      </div>

    </div>
  );
};

export default UploadImage;
