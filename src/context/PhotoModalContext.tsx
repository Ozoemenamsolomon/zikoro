// "use client"
// import React from "react"
// import { createContext, useState, useContext } from "react";

// const photoModalContext = createContext<any>(undefined);

// export function PhotoModalWrapper({ children} : {
//     children : React.ReactNode;
// }) {
//      let [modalOpen, setModalOpen] = useState(false)

//      return (
//         <photoModalContext.Provider value={{
//             modalOpen,
//             setModalOpen,
//         }}>
//             {children}
//         </photoModalContext.Provider>
//      )
// }

// export function usePhotoModalContext() {
//     return useContext(photoModalContext)
// }