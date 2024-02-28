"use client"
import React from "react"
import { createContext, useState, useContext } from "react";

const AppContext = createContext<any>(undefined);

export function AppWrapper({ children} : {
    children : React.ReactNode;
}) {
     let [modalOpen, setModalOpen] = useState(false)

     return (
        <AppContext.Provider value={{
            modalOpen,
            setModalOpen,
        }}>
            {children}
        </AppContext.Provider>
     )
}

export function useAppContext() {
    return useContext(AppContext)
}