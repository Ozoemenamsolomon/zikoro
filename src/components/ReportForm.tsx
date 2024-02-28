"use client"
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "../utils/Utils"



export default function Polls() {

    const reportImage = () => {

    }
    return (
        <Dialog>
            <DialogTrigger> hey
            </DialogTrigger>
                <DialogContent className=''>
                    <DialogHeader >
                        <DialogTitle className='text-2xl font-medium'>Report Image</DialogTitle>
                        
                        <DialogDescription>
                    
                        <div className='relative  mt-8 '>
                            <div className='flex items-center space-x-4 rounded-lg cursor-pointer '>            
                                <textarea id="message" rows="8" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>
                            </div>
                            <p className='absolute right-4 -top-3 z-12 font-light text-sm'>Comment</p>
                        </div>

                        <button onClick={reportImage} className='w-full bg-zikoroBlue py-2 mt-4 rounded-md text-white'> Submit</button>
                        
                        </DialogDescription>
                    </DialogHeader>
                    <div>

                    </div>
                    {/* <DialogFooter className=''>
                        <button type="submit" className='w-full bg-zikoroBlue py-2 rounded-md text-white'> Done</button>
                    </DialogFooter> */}
                </DialogContent>
    </Dialog>
    )
}