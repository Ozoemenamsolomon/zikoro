"use client";
import React from "react";

export default function Test() {
  return (
    <div className="bg-[#F9FAFF] h-screen flex flex-col justify-center items-center px-3">
      <h1>This is test server</h1>
      <iframe
      src="http://localhost:3000/organisation?query=81"
      style={{width: '90%', height: '80%'}}
      title="Organization Page Preview"
      > 
    </iframe>
    </div>
  );
}
