import React, { useState } from 'react';
import { uploadImageToSupabase } from '@/lib/uploadImageToSupabase';
import {Image} from 'lucide-react'

interface ImageUploaderProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ formData, setFormData }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    setUploading(true);
    try {
      const publicUrl = await uploadImageToSupabase(selectedImage);
      setFormData((prev: any) => ({ ...prev, logo: publicUrl }));
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Image className="mx-auto text-3xl text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Upload or drag and drop image</p>
        </label>
      </div>
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Selected" className="w-full h-auto" />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default ImageUploader;


// import React, { useState } from 'react';
// import { uploadImageToSupabase } from '../utils/uploadImage';

// const ImageUpload = ({ formData, setFormData }) => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedImage(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       setSelectedImage(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedImage) return;
//     setLoading(true);
//     try {
//       const publicUrl = await uploadImageToSupabase(selectedImage);
//       setFormData({ ...formData, logo: publicUrl });
//       setLoading(false);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div
//         className="border-dashed border-2 border-gray-300 rounded-md p-4 text-center cursor-pointer"
//         onDrop={handleDrop}
//         onDragOver={(e) => e.preventDefault()}
//       >
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="hidden"
//           id="file-input"
//         />
//         <label htmlFor="file-input" className="block">
//           <span className="text-gray-500">Upload or drag and drop image</span>
//         </label>
//       </div>
//       {previewUrl && (
//         <div className="mt-4">
//           <img src={previewUrl} alt="Selected" className="h-32 w-32 object-cover" />
//         </div>
//       )}
//       <button
//         onClick={handleUpload}
//         disabled={loading}
//         className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
//       >
//         {loading ? 'Uploading...' : 'Upload'}
//       </button>
//     </div>
//   );
// };

// export default ImageUpload;
