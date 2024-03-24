// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { BsThreeDots } from "react-icons/bs";
// import { AiFillLike } from "react-icons/ai";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { supabase } from "../../utils/Utils";
// import { toast } from "react-toastify";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "../ui/alert-dialog";
// import { TiWarningOutline } from "react-icons/ti";
// import FileSaver from "file-saver";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";

// type ApprvPicProps = {
//   url: string;
//   id: number;
//   like: number;
// };

// export default function ApprvPic({ url, id, like }: ApprvPicProps) {
//   const [open, setOpen] = useState(false);
//   const [liked, setLiked] = useState(false);
//   const [likes, setLikes] = useState(0);
//   const [textareaValue, setTextareaValue] = useState("");

//   //download function
//   const download = (imgUrl: string) => {
//     FileSaver.saveAs(imgUrl, `${id}`);
//     //close menu function
//     setOpen(false);
//   };

//   //delete function
//   const del = async (imageId: number) => {
//     try {
//       const response = await fetch(
//         "/api/fetchImages/fetchApprovedImages/deleteImage",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ imageId: imageId }),
//         }
//       );

//       if (response.ok) {
//         //close menu function
//         setOpen(!open);
//         toast.success("Photo deleted");
//       } else {
//         throw new Error("Failed to delete photo");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   //like functionality
//   const likeFunc = async (imageId: number) => {
//     try {
//       const response = await fetch(
//         "/api/fetchImages/fetchApprovedImages/likeImage",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ imageId: imageId, like: like }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setLikes(like + 1);
//       } else {
//         throw new Error("Failed to update likes");
//       }
//     } catch (error) {
//       console.log(`Error Liking Photo`);
//     }

//     setLiked(true);
//   };

//   const handleTextareaChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
//     event
//   ) => {
//     setTextareaValue(event.target.value);
//   };

//   //Report Functionality
//   const reportImage = async (imageId: number) => {
//     try {
//       const response = await fetch(
//         "/api/fetchImages/fetchApprovedImages/reportImage",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ imgId: imageId, comment: textareaValue }),
//         }
//       );

//       if (response.ok) {
//         setOpen(!open);
//         toast.success("Photo reported");
//       } else {
//         throw new Error("Failed to report photo");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [admin, setAdmin] = useState(!false);
//   const [hoverActive, setHoverActive] = useState(false);

//   useEffect(() => {});

//   return (
//     <div
//       className="relative"
//       onMouseOver={() => setHoverActive(true)}
//       onMouseOut={() => setHoverActive(false)}
//     >
//       <div className="absolute right-4 top-4 ">
//         {hoverActive && (
//           <Popover>
//             <PopoverTrigger className="bg-black rounded-full flex opacity-45 items-center justify-center w-8 h-8 ">
//               <BsThreeDots
//                 className="cursor-pointer text-white "
//                 onClick={() => setOpen(!open)}
//               />
//             </PopoverTrigger>

//             <PopoverContent className="w-22">
//               <ul className="">
//                 <li
//                   onClick={() => download(url)}
//                   className="py-1 text-xs cursor-pointer hover:bg-gray-300"
//                 >
//                   Download
//                 </li>
//                 {admin && (
//                   <li className="py-1 text-xs cursor-pointer rounded hover:bg-gray-300">
//                     <AlertDialog>
//                       <AlertDialogTrigger>Delete</AlertDialogTrigger>
//                       <AlertDialogContent>
//                         <AlertDialogHeader>
//                           <AlertDialogTitle className="mx-auto mb-2">
//                             <TiWarningOutline className="text-7xl items-center text-zikoroBlue" />{" "}
//                           </AlertDialogTitle>
//                           <AlertDialogDescription className="text-center">
//                             Are you absolutely sure you want to delete this
//                             event picture?
//                           </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                           <AlertDialogCancel>Cancel</AlertDialogCancel>
//                           <AlertDialogAction
//                             className="text-white bg-zikoroBlue"
//                             onClick={() => del(id)}
//                           >
//                             Delete
//                           </AlertDialogAction>
//                         </AlertDialogFooter>
//                       </AlertDialogContent>
//                     </AlertDialog>
//                   </li>
//                 )}

//                 <li className=" py-1 text-xs cursor-pointer hover:bg-gray-300">
//                   <Dialog>
//                     <DialogTrigger> Report</DialogTrigger>
//                     <DialogContent className="">
//                       <DialogHeader>
//                         <DialogTitle className="text-2xl font-medium">
//                           Report Image
//                         </DialogTitle>

//                         <DialogDescription>
//                           <div className="relative  mt-8 ">
//                             <div className="flex items-center space-x-4 rounded-lg cursor-pointer ">
//                               <textarea
//                                 id="message"
//                                 rows={5}
//                                 className="block p-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 focus:outline-none  dark:bg-gray-700"
//                                 placeholder="Write your thoughts here..."
//                                 required
//                                 onChange={handleTextareaChange}
//                               ></textarea>
//                             </div>
//                             <p className="absolute right-4 -top-2 px-1 bg-white font-light text-sm">
//                               Comment
//                             </p>
//                           </div>

//                           <DialogClose asChild>
//                             <button
//                               onClick={() => reportImage(id)}
//                               className="w-full bg-zikoroBlue py-2 mt-4 rounded-md text-white"
//                             >
//                               {" "}
//                               Submit
//                             </button>
//                           </DialogClose>
//                         </DialogDescription>
//                       </DialogHeader>
//                       <div></div>
//                     </DialogContent>
//                   </Dialog>
//                 </li>
//               </ul>
//             </PopoverContent>
//           </Popover>
//         )}
//       </div>

//       <div
//         onClick={() => likeFunc(id)}
//         className="absolute bottom-2 left-2 flex space-x-2 items-center text-base p-1 bg-white cursor-pointer "
//       >
//         {liked ? <AiFillLike fill="#001FCC" /> : <AiFillLike />}
//         {liked ? (
//           <span className="text-zikoroBlue"> {likes} </span>
//         ) : (
//           <span> {like} </span>
//         )}
//       </div>

//       <Image
//         className="object-cover h-56 w-full "
//         src={url}
//         alt="picture"
//         width={263.5}
//         height={241}
//       />
//     </div>
//   );
// }
