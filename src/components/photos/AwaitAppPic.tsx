// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { IoIosCheckmarkCircle } from "react-icons/io";
// import { IoClose } from "react-icons/io5";
// import { toast } from "react-toastify";
// import { supabase } from "../../utils/Utils";

// type AwaitAppPicsProps = {
//   url: string;
//   id: number;
// };

// export default function AwaitAppPic({ url, id }: AwaitAppPicsProps) {
//   const approve = async (imageId: number) => {
//     try {
//       const response = await fetch(
//         "/api/photos/awaiting/approve",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ imageId: imageId }),
//         }
//       );

//       if (response.ok) {
//         toast.success("Photo approved");
//       } else {
//         throw new Error("Failed to approve photo");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const reject = async (imageId: number) => {
//     try {
//       const response = await fetch(
//         "/api/photos/awaiting/reject",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ imageId: imageId }),
//         }
//       );

//       if (response.ok) {
//         toast.error("Photo rejected");
//       } else {
//         throw new Error("Failed to reject photo");
//       }
//     } catch (error) {
//       console.log(error);
//     }

//   };

//   return (
//     <div className="relative ">
//       <div className="absolute bg-black rounded-full flex opacity-45 items-center justify-center w-8 h-8 top-4 right-4 cursor-pointer  ">
//         <IoClose onClick={() => reject(id)} className="text-white" />
//       </div>

//       <div
//         onClick={() => approve(id)}
//         className="absolute bottom-2 left-2 flex space-x-2 items-center text-base p-1 bg-white cursor-pointer"
//       >
//         <IoIosCheckmarkCircle fill="#00D685" className="" />
//         <span className=""> Approve </span>
//       </div>

//       <Image
//         className="object-cover h-60 w-full"
//         src={url}
//         alt="picture"
//         width={263.5}
//         height={241}
//       />
//     </div>
//   );
// }
