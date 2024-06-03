// "use client";
// import React, { useEffect, useState } from "react";
// import SelectedLocation from "./SelectedLocation";
// import { RightArrow, LocationIcon1 } from "@/constants/icons";
// import { useRouter } from "next/navigation";

// type SelectedEventProps = {
//   searchQuery: string;
// };

// type DBSelectedLocation = {
//   id: number;
//   eventPoster: string;
//   eventTitle: string;
//   eventCategory: string;
//   eventCity: string;
//   eventAlias: string;
//   eventCountry: string;
//   locationType: string;
//   pricing:[];  // Adjust the type according to your pricing data structure
//   pricingCurrency: string;
//   startDateTime: string;
//   expectedParticipants: number;
//   registered: number;
// };

// export default function SelectedLocationList({ searchQuery }: SelectedEventProps) {
//   const router = useRouter();
//   const [eventData, setEventData] = useState<DBSelectedLocation[] | undefined>(undefined);
//   const [currentLocation, setCurrentLocation] = useState<string | null>(null);
//   const [selectedLocation, setSelectedLocation] = useState<string>('');
//   const [error, setError] = useState<string | null>(null);
//   const [allEventCountries, setAllEventCountries] = useState<string[]>([]);

//   // Filter events based on search query and location
//   const filteredEvents = eventData?.filter((event) => {
//     const matchesLocation = selectedLocation ? event.eventCountry === selectedLocation : event.eventCountry === currentLocation;
//     const matchesSearchQuery = event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                                event.eventCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                                event.eventCategory.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesLocation && matchesSearchQuery;
//   });

//   // Fetch event data based on current location
//   useEffect(() => {
//     async function fetchEventFeatured() {
//       try {
//         const response = await fetch(`/api/explore`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         const data = await response.json();
//         setEventData(data.data);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//       }
//     }
//     fetchEventFeatured();
//   }, []);

//   // Get all event countries from the event data
//   useEffect(() => {
//     if (eventData) {
//       const countries = Array.from(new Set(eventData.map((event) => event.eventCountry)));
//       setAllEventCountries(countries);
//     }
//   }, [eventData]);

//   // Fetch user's current location
//   useEffect(() => {
//     const fetchLocation = async () => {
//       if (typeof window !== "undefined" && navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           async (position) => {
//             try {
//               const { latitude, longitude } = position.coords;
//               const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
//               const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
//               const response = await fetch(url);
//               const data = await response.json();
//               if (data.status === "OK") {
//                 const countryComponent = data.results[0].address_components.find((component: { types: string | string[] }) =>
//                   component.types.includes("country")
//                 );
//                 if (countryComponent) {
//                   setCurrentLocation(countryComponent.long_name);
//                 } else {
//                   setError("Country not found in address components");
//                 }
//               } else {
//                 setError(`Geocoding error: ${data.status} - ${data.error_message}`);
//               }
//             } catch (error) {
//               console.error("Error fetching geocoding data:", error);
//               setError("Error fetching location");
//             }
//           },
//           (error) => {
//             console.error("Geolocation error:", error);
//             setError(`Error: ${error.message}`);
//           }
//         );
//       } else {
//         setError("Geolocation is not supported by your browser");
//       }
//     };
//     fetchLocation();
//   }, []);

//   return (
//     <div className="mt-[150px] max-w-6xl mx-auto px-3 lg:px-0">
//       {/* Header */}
//       <div className="flex justify-between">
//         <div className="flex items-center gap-x-1 lg:gap-x-3">
//           <LocationIcon1 />
//           <div className="font-semibold text-[20px] lg:text-[32px]">
//             {currentLocation ? (
//               <select
//                 className="mt-2 p-2 border-none outline-none"
//                 value={selectedLocation}
//                 onChange={(e) => setSelectedLocation(e.target.value)}
//               >
//                 <option value="" disabled>
//                   {currentLocation}
//                 </option>
//                 {allEventCountries.map((country, i) => (
//                   <option key={i} value={country}>
//                     {country}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               "Couldn't Get Location"
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-0 md:gap-x-4 lg:gap-x-4 gap-y-5 lg:gap-y-0 mt-[10px] lg:mt-[50px] bg-white">
//         {filteredEvents?.length ? (
//           filteredEvents.slice(0, 4).map((event) => (
//             <SelectedLocation
//               key={event.id}
//               id={event.id}
//               eventPoster={event.eventPoster}
//               eventTitle={event.eventTitle}
//               eventCity={event.eventCity}
//               eventAlias={event.eventAlias}
//               eventCountry={event.eventCountry}
//               eventCategory={event.eventCategory}
//               locationType={event.locationType}
//               pricing={event.pricing}
//               pricingCurrency={event.pricingCurrency}
//               startDateTime={event.startDateTime}
//               expectedParticipants={event.expectedParticipants}
//               registered={event.registered}
//             />
//           ))
//         ) : (
//           <p>No events found</p>
//         )}
//       </div>
//     </div>
//   );
// }





"use client";
import React, { useEffect, useState } from "react";
import SelectedLocation from "./SelectedLocation";
import { RightArrow, LocationIcon1 } from "@/constants/icons";
import { useRouter } from "next/navigation";

type SelectedEventProps = {
  searchQuery: string;
};

type DBSelectedLocation = {
  id: number;
  eventPoster: string;
  eventTitle: string;
  eventCategory: string;
  eventCity: string;
  eventAlias: string;
  eventCountry: string;
  locationType: string;
  pricing: []; // Adjust the type according to your pricing data structure
  pricingCurrency: string;
  startDateTime: string;
  expectedParticipants: number;
  registered: number;
};

export default function SelectedLocationList({ searchQuery }: SelectedEventProps) {
  const router = useRouter();
  const [eventData, setEventData] = useState<DBSelectedLocation[] | undefined>(undefined);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [allEventCountries, setAllEventCountries] = useState<string[]>([]);

  // Filter events based on search query and location
  const filteredEvents = eventData?.filter((event) => {
    const matchesLocation = selectedLocation ? event.eventCountry === selectedLocation : event.eventCountry === currentLocation;
    const matchesSearchQuery = event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               event.eventCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               event.eventCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesSearchQuery;
  });

  // Fetch event data
  useEffect(() => {
    async function fetchEventFeatured() {
      try {
        const response = await fetch(`/api/explore`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setEventData(data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchEventFeatured();
  }, []);

  // Get all event countries from the event data
  useEffect(() => {
    if (eventData) {
      const countries = Array.from(new Set(eventData.map((event) => event.eventCountry)));
      setAllEventCountries(countries);
    }
  }, [eventData]);

  // Fetch user's current location
  useEffect(() => {
    const fetchLocation = async () => {
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
              const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
              const response = await fetch(url);
              const data = await response.json();
              if (data.status === "OK") {
                const countryComponent = data.results[0].address_components.find((component: { types: string | string[] }) =>
                  component.types.includes("country")
                );
                if (countryComponent) {
                  setCurrentLocation(countryComponent.long_name);
                } else {
                  setError("Country not found in address components");
                }
              } else {
                setError(`Geocoding error: ${data.status} - ${data.error_message}`);
              }
            } catch (error) {
              console.error("Error fetching geocoding data:", error);
              setError("Error fetching location");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setError(`Error: ${error.message}`);
          }
        );
      } else {
        setError("Geolocation is not supported by your browser");
      }
    };
    fetchLocation();
  }, []);

  // Set default location to Nigeria if no events found for current location
  useEffect(() => {
    if (eventData && currentLocation && !filteredEvents?.length) {
      setSelectedLocation("Nigeria");
    }
  }, [eventData, currentLocation, filteredEvents]);

  return (
    <div className="mt-[150px] max-w-6xl mx-auto px-3 lg:px-0">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex items-center gap-x-1 lg:gap-x-2">
          <LocationIcon1 />
          <div className="font-semibold text-[20px] lg:text-[26px]">
            {currentLocation ? (
              <select
                className="mt-2 p-2 border-none outline-none"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="" disabled>
                  {currentLocation}
                </option>
                {allEventCountries.map((country, i) => (
                  <option key={i} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            ) : (
              "Couldn't Get Location"
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-0 md:gap-x-4 lg:gap-x-4 gap-y-5 lg:gap-y-0 mt-[10px] lg:mt-[50px] bg-white">
        {filteredEvents?.length ? (
          filteredEvents.slice(0, 4).map((event) => (
            <SelectedLocation
              key={event.id}
              id={event.id}
              eventPoster={event.eventPoster}
              eventTitle={event.eventTitle}
              eventCity={event.eventCity}
              eventAlias={event.eventAlias}
              eventCountry={event.eventCountry}
              eventCategory={event.eventCategory}
              locationType={event.locationType}
              pricing={event.pricing}
              pricingCurrency={event.pricingCurrency}
              startDateTime={event.startDateTime}
              expectedParticipants={event.expectedParticipants}
              registered={event.registered}
            />
          ))
        ) : (
          <p>No events found</p>
        )}
      </div>
    </div>
  );
}
