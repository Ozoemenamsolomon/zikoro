'use client'
import * as React from "react"

import { Input } from "@/components/ui/input"
import SwitchToggler from "../ui/SwitchToggler"
import { DeletIcon, DotsIcon } from "@/constants"

export default function LinkSetting() {
  return (
    <div className='py-6 space-y-6 max-w-lg'>
        {
            [...Array(2)].map((_,idx)=>
                <CardWithForm key={idx}/>
            )
        }
    </div>
  )
}


export function CardWithForm() {
  return (
    <div className="w-full border rounded-md bg-baseBg p-6 pr-3">
      <div className="flex gap-2 items-center ">
        <form className="w-full space-y-4">
            <Input id="linktitle" placeholder="Link Title" className="bg-baseBg focus-within:bg-baseBg focus:bg-baseBg focus:outline-none focus:ring-0" />
            <Input id="linkurl" placeholder="Link Url" className="bg-baseBg focus-within:bg-baseBg focus:bg-baseBg focus:outline-none focus:ring-0"/>
            
        </form>
        <button className="shrink-0"><DotsIcon/></button>
      </div>
      <div className="flex justify-center gap-3 pt-4 items-center">
        <SwitchToggler/>
        <DeletIcon/> 
      </div>
    </div>
  )
}
