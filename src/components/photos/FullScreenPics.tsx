// "use client"
// import React, { useEffect, useState } from "react"
// import FullScreenPic from "./FullScreenPic"
// import { supabase } from "../../utils/Utils"

// type FSPics = {
//   id : number,
//   created_at : string,
//   "eventId" : number,
//   "eventName" : string,
//   "userId" : number,
//   "userEmail" : string,
//   "photoStatus" : string,
//   likes : number,
//   photoUrl : string
// }

// export default function ApprovedPics(){
//     const [images, setImages] = useState <FSPics[]|undefined>(undefined);

//     useEffect(() => {
//         async function fetchImageUrls() {
//           fetch('/api/fetchImages/fetchApprovedImages', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json'
//               // You might need additional headers like authorization if required
//             }
//           })
//             .then(response => response.json())
//             .then(data => setImages(data.data))
//             .catch(
//               error => console.error('Error:', error)
//             );
//         }
    
//         fetchImageUrls();
//       }, []);
//     return (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full 2xl:grid-cols-6 gap-0 ">
//                       {images?.length ? (
//                             images.map((image, index) => (
//                                 <FullScreenPic key={index} url={image.photoUrl} />
//                             ))
//                         ) : (
//                             <p className="text-gray-500">Picture Loading...</p>
//                         )}
//                 </div>
//         )
// }