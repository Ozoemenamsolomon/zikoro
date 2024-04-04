// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { CiCirclePlus } from "react-icons/ci";
// // import {MdOutlineFullscreen} from "react-icons/md"
// import ApprovedPics from "@/components/photos/ApprovedPics";
// import AwaitAppPics from "@/components/photos/AwaitAppPics";
// import UnAppPics from "@/components/photos/UnAppPics";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { useAppContext } from "@/context";
// import Modal from "@/components/Modal";
// import { IoSettingsOutline } from "react-icons/io5";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { FullScreen, useFullScreenHandle } from "react-full-screen";
// import FullScreenIcon from "@/components/svg/Fullscreen";
// import Image from "next/image";
// import FullScreenPics from "@/components/photos/FullScreenPics";
// import Toggler from "@/components/svg/Toggler";
// import TogglerBlue from "@/components/svg/TogglerBlue";
// import { BiExitFullscreen } from "react-icons/bi";
// import { FiFile } from "react-icons/fi";
// import { supabase } from "@/utils/Utils";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import { MobileBottomNav } from "@/components/MobileBottomNav";

// export default function Photos() {
//   const links = [
//     {
//       name: "Photos",
//       href: "/interactions/photos",
//     },

//     {
//       name: "Discussions",
//       href: "/interactions/discussions",
//     },

//     {
//       name: "Social Wall",
//       href: "/interactions/social",
//     },

//     {
//       name: "StampIT",
//       href: "/interactions/stamp",
//     },

//     {
//       name: "Leaderboard",
//       href: "/interactions/leaderboard",
//     },
//   ];

//   const { modalOpen, setModalOpen } = useAppContext();
//   const handle = useFullScreenHandle();
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const pathname = usePathname();
//   const [admin, setAdmin] = useState(!false);
//   const filePickerRef = useRef<any>(null);
//   const [file, setFile] = useState<any>(null);
//   const [zikoroText, setZikoroText] = useState(true);
//   const [defaultBanner, setDefaultBanner] = useState(true);
//   const [fullScreenDetails, setFullScreenDetails] = useState<any>(null);

//   const openModal = () => {
//     setModalOpen(true);
//   };

//   const bannerToggler = () => {
//     setDefaultBanner(!defaultBanner);
//   };

//   const zikoroTextOnToggler = () => {
//     setZikoroText(true);
//   };

//   const zikoroTextOffToggler = () => {
//     setZikoroText(false);
//   };

//   const open = () => {
//     setIsFullscreen(true);
//     handle.enter();
//   };

//   const close = () => {
//     setIsFullscreen(false);
//     handle.exit();
//   };

//   const addImage = (e: any) => {
//     if (e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   //Banner Upload

//   const uploadBanner = async (file: File) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "w5xbik6z");
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
//         return data.secure_url;
//       }
//     } catch (error) {
//       toast.error(`Error uploading image: ${error}`);
//       console.log(error);
//     }
//   };
//   const uploadToSupabase = async (eventId: number) => {
//     try {
//       let image = null;
//       if (file) {
//         image = await uploadBanner(file);
//       } else {
//         setDefaultBanner(true);
//       }
//       const { error } = await supabase
//         .from("events")
//         .update({
//           photoBannerUrl: image,
//           showPhotoBanner: defaultBanner,
//           poweredByZikoro: zikoroText,
//         })
//         .eq("id", eventId);
//       setFile(null);

//       if (error) {
//         toast.error(`Error : ${error}`);
//         console.log(error);
//       }
//       toast.success("Banner Uploaded Successfully");
//     } catch (error) {}
//   };

//   //useEffect

//   useEffect(() => {
//     const fetchDetails = async (eventId: Number) => {
//       try {
//         // Fetch the URLs from Supabase based on parameters
//         const { data, error } = await supabase
//           .from("events")
//           .select()
//           .eq("id", eventId);

//         if (error) {
//           throw error;
//         }
//         if (data) {
//           setFullScreenDetails(data[0]);
//         }
//       } catch (error) {}
//     };

//     fetchDetails(24);
//     console.log(fullScreenDetails);
//   }, []);

//   return (
//     <div className="font-heebo ">
//       {modalOpen ? (
//         <Modal />
//       ) : (
//         <div className="mb-20  ">
//           {/* sub menu */}
//           <div className="bg-white pt-4 border-y-[1px] border-gray-100 mt-2">
//             <div className="hidden lg:block justify-between p-2  ">
//               <div className="flex gap-12 text-gray-500 sticky top-0 pb-2 ">
//                 {links.map(({ name, href }) => {
//                   return (
//                     <Link
//                       href={href}
//                       className={` ${
//                         pathname === href ? "text-zikoroBlue" : ""
//                       }`}
//                     >
//                       {name}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           <div className="mt-2 flex justify-end space-x-4 gap-x-4 items-center mr-0 lg:mr-10 mb-10">
//             <div
//               onClick={openModal}
//               className="flex bg-zikoroBlue items-center justify-center space-x-2  text-white py-1 px-2 rounded-md cursor-pointer "
//             >
//               <CiCirclePlus className="w-5 h-5" />
//               <p className=" text-base">Photos</p>
//             </div>

//             {admin && (
//               <div className=" cursor-pointer hidden lg:inline">
//                 <div onClick={open}>
//                   <FullScreenIcon />
//                 </div>
//                 {/* Fullscreen */}

//                 <FullScreen handle={handle} className="bg-white w-10">
//                   {isFullscreen && (
//                     <div className="flex space-x-0">
//                       {/* left */}
//                       <div className=" flex flex-col w-3/12 h-screen">
//                         {fullScreenDetails?.photoBannerUrl !== null ? (
//                           <Image
//                             src={fullScreenDetails?.photoBannerUrl}
//                             className="h-full object-cover"
//                             alt=""
//                             height={800}
//                             width={360}
//                           />
//                         ) : (
//                           <Image
//                             src="/sample.png"
//                             className="h-full object-cover"
//                             alt=""
//                             height={800}
//                             width={360}
//                           />
//                         )}

//                         {fullScreenDetails?.poweredByZikoro && (
//                           <div className="flex flex-col h-36 mt-8 ml-4">
//                             <p>Powered By:</p>
//                             <Image
//                               src="/zikoro.png"
//                               className=""
//                               alt=""
//                               width={171}
//                               height={47}
//                             />
//                           </div>
//                         )}
//                       </div>
//                       {/* right */}
//                       <div className=" relative w-9/12 h-screen  ">
//                         <motion.div
//                           initial={{ y: "100vh" }}
//                           animate={{ y: 0 }}
//                           transition={{ duration: 1 }}
//                         >
//                           <AnimatePresence>
//                             <FullScreenPics />
//                           </AnimatePresence>
//                         </motion.div>

//                         <div
//                           className="bg-black absolute rounded-full flex opacity-45 items-center justify-center w-8 h-8 top-4 right-8"
//                           onClick={close}
//                         >
//                           <BiExitFullscreen
//                             fill="#ffffff"
//                             className="text-white"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </FullScreen>
//               </div>
//             )}

//             {admin && (
//               <Dialog>
//                 <DialogTrigger>
//                   <IoSettingsOutline className="w-6 h-6 cursor-pointer hidden lg:inline" />
//                 </DialogTrigger>
//                 <DialogContent className="">
//                   <DialogHeader>
//                     <DialogTitle className="text-2xl font-medium">
//                       Photo Settings
//                     </DialogTitle>

//                     <DialogDescription>
//                       {/* <p className='text-sm font-semibold mt-8'>Approved Photo</p> */}
//                       <div className="flex justify-between items-center mt-4 mr-4">
//                         <p className="text-sm font-light ">
//                           Show Default Banner
//                         </p>
//                         {defaultBanner ? (
//                           <div
//                             className="cursor-pointer"
//                             onClick={bannerToggler}
//                           >
//                             <TogglerBlue />
//                           </div>
//                         ) : (
//                           <div
//                             className="cursor-pointer"
//                             onClick={bannerToggler}
//                           >
//                             <Toggler />
//                           </div>
//                         )}
//                       </div>

//                       <div className="relative border border-gray-200 rounded-md mt-8 ">
//                         <div
//                           onClick={() => filePickerRef.current.click()}
//                           className="flex items-center space-x-4 py-6 px-4 rounded-lg cursor-pointer "
//                         >
//                           <FiFile />
//                           <input
//                             type="file"
//                             ref={filePickerRef}
//                             disabled={defaultBanner}
//                             onChange={() => addImage}
//                             hidden
//                           />
//                           {file && (
//                             <p className="font-extralight text-xs">
//                               {file.name}{" "}
//                             </p>
//                           )}
//                         </div>
//                         <p className="absolute right-4 -top-3 bg-white px-1  text-sm">
//                           Banner
//                         </p>
//                       </div>

//                       <div className="mt-2">
//                         <p className="font-extralight text-xs">
//                           Image size should be in 580px by 3050px (Vertical
//                           banner size){" "}
//                         </p>
//                       </div>

//                       <div className="flex font-medium space-x-2 items-center mt-8 mb-4">
//                         <p className="text-sm font-light ">
//                           Show Powered By Zikoro
//                         </p>
//                         {zikoroText ? (
//                           <div
//                             className="cursor-pointer"
//                             onClick={zikoroTextOffToggler}
//                           >
//                             <TogglerBlue />
//                           </div>
//                         ) : (
//                           <div
//                             className="cursor-pointer"
//                             onClick={zikoroTextOnToggler}
//                           >
//                             <Toggler />
//                           </div>
//                         )}
//                       </div>
//                     </DialogDescription>
//                     <DialogClose asChild>
//                       <button
//                         onClick={() => uploadToSupabase(24)}
//                         className="w-full bg-zikoroBlue py-2 rounded-md text-white"
//                       >
//                         {" "}
//                         Done
//                       </button>
//                     </DialogClose>
//                   </DialogHeader>
//                   <div></div>
//                 </DialogContent>
//               </Dialog>
//             )}
//           </div>

//           {/* Body */}
//           <div className="mx-6 ">
//             <ApprovedPics />
//             {admin && (
//               <div>
//                 <AwaitAppPics />
//                 <UnAppPics />
//               </div>
//             )}
//           </div>
//           <MobileBottomNav />
//         </div>
//       )}
//     </div>
//   );
// }
