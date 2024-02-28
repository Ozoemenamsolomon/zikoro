"use client"
import React, {useEffect, useState } from "react"
import Image from "next/image"

export default function ApprvPic({url}){

        return (
                <div className="" >
                            <Image className="object-cover h-56" src={url} alt="picture" width={280.5} height={241} />
                </div>
        )
}