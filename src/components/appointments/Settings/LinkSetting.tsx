'use client'
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
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
    <div className="w-full border rounded-md bg-base p-6 pr-3">
      <div className="flex gap-2 items-center ">
        <form className="w-full space-y-4">
            <Input id="linktitle" placeholder="Link Title" className="bg-base focus-within:bg-base focus:bg-base focus:outline-none focus:ring-0" />
            <Input id="linkurl" placeholder="Link Url" className="bg-base focus-within:bg-base focus:bg-base focus:outline-none focus:ring-0"/>
            {/* <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
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
