import React from "react"
// import Sidebar from "@/components/Sidebar";
// import Topbar from "@/components/Topbar";
// import {AppWrapper} from "@/context"

import Sidebar from "../../components/Sidebar"
import Topbar from "../../components/Topbar"
import {AppWrapper} from "../../context"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        < >
          <Sidebar></Sidebar>
          <div className="flex-1">
            <Topbar></Topbar>
              <AppWrapper>
                {children}
                <ToastContainer/>
              </AppWrapper>
          </div>
        </>    
  );
}
