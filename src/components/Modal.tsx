// // "use client"
// import React from "react";
// import { Fragment, useState, useRef } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { CiCamera } from "react-icons/ci";
// import { usePhotoModalContext } from "../context";
// import { IoClose } from "react-icons/io5";
// import { toast } from "react-toastify";
// import { supabase } from "@/utils/Utils";

// export default function Modal() {
//   const { modalOpen, setModalOpen } = usePhotoModalContext();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [file, setFile] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const filePickerRef = useRef<any>(null);

//   const addImages = (e: any) => {
//     const reader = new FileReader();

//     if (e.target.files[0]) {
//       reader.readAsDataURL(e.target.files[0]);
//       setFile(e.target.files[0]);
//     }

//     reader.onload = (readerEvent: any) => {
//       setSelectedFile(readerEvent.target.result);
//     };
//   };

//   const uploadPictures = async () => {
//     if (loading) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "w5xbik6z");
//     formData.append("folder", "ZIKORO");

//     try {
//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/kachiozo/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (res.ok) {
//         const data = await res.json();

//         // Save the URL and other attributes to Supabase database
//         const { data: imageRecord, error } = await supabase
//           .from("eventPhotos")
//           .upsert([
//             {
//               photoUrl: data.secure_url,
//               eventId: null,
//               eventName: null,
//               userId: null,
//               userEmail: null,
//               photoStatus: "awaiting",
//               likes: 0,
//               likeUsers: null,
//               Reports: null,
//               ReportsUsers: null,
//             },
//           ]);

//         if (error) {
//           toast.error(`Error : ${error}`);
//         } else {
//           setLoading(true);
//           setModalOpen(false);
//           setSelectedFile(null);
//           toast.success("Uploaded Successfully");
//           setLoading(false);
//         }
//       }
//     } catch (error) {
//       toast.error(`Error uploading image: ${error}`);
//     }
//   };

//   return null;

//   return (
//     <>
//       <Transition.Root show={modalOpen} as={Fragment}>
//         <Dialog
//           as="div"
//           className="fixed z-10 inset-0 overflow-y-auto"
//           onClose={() => setModalOpen(false)}
//         >
//           <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <Dialog.Overlay className=" fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//             </Transition.Child>

//             {/* This element is to trick the browser into centering the modal contents */}
//             <span
//               className="hidden sm:inline-block sm:align-middle sm:h-screen"
//               aria-hidden="true"
//             >
//               &#8283;
//             </span>

//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//               enterTo="opacity-100 translate-y-0 sm:scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//               leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//             >
//               <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-0 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
//                 <div>
//                   {selectedFile ? (
//                     <div className="relative">
//                       <img
//                         src={selectedFile}
//                         className="object-contain cursor-pointer mx-auto"
//                         width={433}
//                         height={294}
//                         alt="contentImage"
//                       />

//                       <div className="bg-black rounded-full flex opacity-45 items-center justify-center w-8 h-8 absolute left-72 top-4">
//                         <IoClose
//                           className="cursor-pointer text-white"
//                           onClick={() => setSelectedFile(null)}
//                         />
//                       </div>
//                     </div>
//                   ) : (
//                     <div
//                       onClick={() => filePickerRef.current.click()}
//                       className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-zikoroBlue cursor-pointer"
//                     >
//                       <CiCamera
//                         className="h-6 w-6 text-white"
//                         aria-hidden="true"
//                       />
//                     </div>
//                   )}

//                   <div>
//                     <div className="mt-3 text-center sm:mt-5">
//                       <Dialog.Title
//                         as="h3"
//                         className="text-lg leading-6 font-medium text-gray-900 "
//                       ></Dialog.Title>

//                       <div>
//                         <input
//                           type="file"
//                           ref={filePickerRef}
//                           onChange={addImages}
//                           hidden
//                           // multiple
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-5 sm:mt-6">
//                     <button
//                       type="button"
//                       disabled={!selectedFile}
//                       className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-zikoroBlue text-base font-medium text-white hover:bg-zikoroBlue focus:outline-none focus:ring-2
//                                             focus:ring-offset-2 focus:ring-zikoroBlue  sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
//                       onClick={uploadPictures}
//                     >
//                       {loading ? "Uploading..." : "Post"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </Transition.Child>
//           </div>
//         </Dialog>
//       </Transition.Root>
//     </>
//   );
// }
