// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { useRouter, useSearchParams } from "next/navigation";

// type BlogPreviewData = {
//   title: string;
//   category: string;
//   tags: string[];
//   headerImageUrl: string;
//   readingDuration: string;
//   status: string;
//   content: string;
//   created_at: number;
// }

// export default function Preview(): JSX.Element {
//   const [data, setData] = useState<BlogPreviewData | null>(null); // Initialize data as null
//   const [loading, setLoading] = useState(true); // Add loading state

//   // useSearch Params
//   const query = useSearchParams();
//   const blogDetailsString = query.get("blog");

//   useEffect(() => {
//     if (blogDetailsString !== null && typeof blogDetailsString === "string") {
//       try {
//         const blogDetails = JSON.parse(blogDetailsString);
//         setData(blogDetails);
//         setLoading(false); // Set loading to false when data is fetched
//       } catch (error) {
//         console.error("Error parsing JSON:", error);
//         setLoading(false); // Set loading to false in case of error
//       }
//     } else {
//       // Handle the case where blogDetailsString is null or not a string
//       setLoading(false); // Set loading to false if blogDetailsString is not valid
//     }
//   }, [blogDetailsString]); // Ensure useEffect runs when blogDetailsString changes

//   // Render loading state if data is still loading
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Render error state if data couldn't be loaded
//   if (!data) {
//     return <div>Error: Data not found</div>;
//   }

//   // Extracting the date only
//   function extractAndFormatDate(dateTimeString: any): any {
//     try {
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) {
//         // throw new Error("Invalid date");
//       }
//       const formattedDate: string = formatDate(date);
//       return formattedDate;
//     } catch (error) {
//       console.error("Error extracting date:", error);
//       return "Invalid Date";
//     }
//   }

//   function formatDate(date: Date): string {
//     const year: number = date.getFullYear();
//     const month: number = date.getMonth() + 1; // Month is zero-based, so add 1
//     const day: number = date.getDate();

//     const monthNames: string[] = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];

//     const formattedDate: string = `${day} ${monthNames[month - 1]} ${year}`;
//     return formattedDate;
//   }

//   return (
//     <>
//       {data && (
//         <div className="mt-[120px] lg:mt-[200px] px-3 lg:px-0 ">
//           {/* header section */}
//           <div className="mzx-w-full lg:max-w-[982px] mx-auto flex flex-col gap-y-6 lg:gap-y-10 ">
//             <div className="max-w-full lg:max-w-2xl lg:mx-auto flex flex-col gap-y-2 text-center ">
//               <p className="text-indigo-600 text-[12px] lg:text-[15px] font-medium uppercase">
//                 {data?.category}
//               </p>
//               <p className="capitalize text-2xl font-semibold lg:text-4xl ">
//                 {data?.title}
//               </p>
//               <p className="uppercase text-gray-400">
//                 {extractAndFormatDate(data?.created_at)} -{" "}
//                 <span>{data?.readingDuration} mins read </span>
//               </p>
//             </div>
//             <Image
//               src={
//                 data?.headerImageUrl ? data?.headerImageUrl : "/postImage2.png"
//               }
//               alt=""
//               width={982}
//               height={450}
//               className="w-[982px] h-[450px] object-cover hidden lg:block"
//             />
//             <Image
//               src={
//                 data?.headerImageUrl ? data?.headerImageUrl : "/postImage2.png"
//               }
//               alt=""
//               width={335}
//               height={160}
//               className="w-full h-[160px] object-cover block lg:hidden"
//             />
//           </div>

//           {/* body section */}
//           <div className="max-w-full lg:max-w-6xl lg:mx-auto flex gap-x-0 lg:gap-x-28 mt-5 mb-10 lg:mt-28 lg:mb-20 ">
//             {/* Left */}
//             <div className="hidden lg:inline h-full pb-12 w-full flex-col  lg:w-3/12">
//               {/* section links */}
//               <div className="flex-col">
//                 {/* Top */}
//                 <p className="text-xl font-semibold">On This Page</p>
//               </div>
//             </div>

//             <div className=" h-fit lg:h-fit overflow-y-hidden lg:overflow-y-auto  w-full lg:w-9/12  flex-col  pb-0 lg:pb-[50px]">
//               <div dangerouslySetInnerHTML={{ __html: data?.content ?? "" }} />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

type BlogPreviewData = {
  title: string;
  category: string;
  tags: string[];
  headerImageUrl: string;
  readingDuration: string;
  status: string;
  content: string;
  created_at: number;
};

export default function Preview(): JSX.Element {
  const [data, setData] = useState<BlogPreviewData | null>(null); // Initialize data as null
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const blogDataString = localStorage.getItem("blogPreviewData");

    if (blogDataString) {
      try {
        const parsedBlogData: BlogPreviewData = JSON.parse(blogDataString);
        setData(parsedBlogData);
        // Optionally, clear the local storage
        localStorage.removeItem("blogPreviewData");
      } catch (error) {
        console.error("Error parsing blog preview data:", error);
      }
    } else {
      console.error("No preview data found");
    }
  }, []);

  // Render error state if data couldn't be loaded
  if (!data) {
    return <div>Loading...</div>;
  }

  // Extracting the date only
  function extractAndFormatDate(dateTimeString: any): any {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        // throw new Error("Invalid date");
      }
      const formattedDate: string = formatDate(date);
      return formattedDate;
    } catch (error) {
      console.error("Error extracting date:", error);
      return "Invalid Date";
    }
  }

  function formatDate(date: Date): string {
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Month is zero-based, so add 1
    const day: number = date.getDate();

    const monthNames: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedDate: string = `${day} ${monthNames[month - 1]} ${year}`;
    return formattedDate;
  }

  return (
    <>
      {data && (
        <div className="mt-[120px] lg:mt-[200px] px-3 lg:px-0 ">
          {/* header section */}
          <div className="mzx-w-full lg:max-w-[982px] mx-auto flex flex-col gap-y-6 lg:gap-y-10 ">
            <div className="max-w-full lg:max-w-2xl lg:mx-auto flex flex-col gap-y-2 text-center ">
              <p className="text-indigo-600 text-[12px] lg:text-[15px] font-medium uppercase">
                {data?.category}
              </p>
              <p className="capitalize text-2xl font-semibold lg:text-4xl ">
                {data?.title}
              </p>
              <p className="uppercase text-gray-400">
                {extractAndFormatDate(data?.created_at)} -{" "}
                <span>{data?.readingDuration} mins read </span>
              </p>
            </div>
            <Image
              src={
                data?.headerImageUrl ? data?.headerImageUrl : "/postImage2.png"
              }
              alt=""
              width={982}
              height={450}
              className="w-[982px] h-[450px] object-cover hidden lg:block"
            />
            <Image
              src={
                data?.headerImageUrl ? data?.headerImageUrl : "/postImage2.png"
              }
              alt=""
              width={335}
              height={160}
              className="w-full h-[160px] object-cover block lg:hidden"
            />
          </div>

          {/* body section */}
          <div className="max-w-full lg:max-w-6xl lg:mx-auto flex gap-x-0 lg:gap-x-28 mt-5 mb-10 lg:mt-28 lg:mb-20 ">
            {/* Left */}
            <div className="hidden lg:inline h-full pb-12 w-full flex-col  lg:w-3/12">
              {/* section links */}
              <div className="flex-col">
                {/* Top */}
                <p className="text-xl font-semibold">On This Page</p>
              </div>
            </div>

            <div className=" h-fit lg:h-fit overflow-y-hidden lg:overflow-y-auto  w-full lg:w-9/12  flex-col  pb-0 lg:pb-[50px]">
              <div dangerouslySetInnerHTML={{ __html: data?.content ?? "" }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
