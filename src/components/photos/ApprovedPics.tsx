// "use client"
// import React, { useEffect, useState } from "react"
// import Picture from "./ApprvPic"


// type DBEventPhoto = {
//   id : number,
//   created_at : string,
//   "eventId" : number,
//   "eventName" : string,
//   "userId" : number,
//   "userEmail" : string,
//   "photoStatus" : string,
//   likes : number,
//   photoUrl : string,
//   likeUsers: number,
//   Reports: number,
//   ReportsUsers: JSON,
// // photo text null
// }


// export default function ApprovedPics(){
//     const [images, setImages] = useState<DBEventPhoto[]|undefined>(undefined);

//     async function fetchImageUrls() {

//       fetch('/api/photos/approved', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//         .then(response => response.json())
//         .then(data => setImages(data.data))
//         .catch(
//           error => console.error('Error:', error)
//         );
//     }

//     useEffect(() => {
//         fetchImageUrls();
//       }, []);

//     return (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
//                       {images?.length ? (
//                             images?.map((image, index) => (
//                                 <Picture key={index} id={image.id} url={image.photoUrl} like={image.likes} />
//                             ))
//                         ) : (
//                             <p className="text-gray-500">No Pictures Available</p>
//                         )}
//                 </div>
//         )
// }
