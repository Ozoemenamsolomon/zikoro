'use client'
import { Input } from '@/components/ui/input'
import { BlueCircleIcon,   } from '@/constants'
import { User } from 'lucide-react'
import React from 'react'

const ProfileSettings = () => {
  return (
    <div className='py-6 space-y-6 max-w-lg'>
        <div className="flex flex-col">
            <h2 className="  font-medium pb-2">Profile name</h2>
            <Input
                value={'Emmanuel Udeji'}
                name='name'
                disabled={true}
            />
            <small>This can either be your business name or personal name</small>
        </div>

        <div className="">
            <h2 className="  font-medium pb-2">Profile photo</h2>
            <div className="relative w-28 h-28 ">
                {
                    false ?
                    <></>
                    :
                    <div className='h-full w-full bg-slate-200 flex justify-center rounded-full items-center text-gray-400'>
                        <User/>
                    </div>
                }
                <div className="absolute right-0 bottom-0">
                    <BlueCircleIcon/>
                </div>
            </div>
            <small>This can either be your business logo or personal photo</small>
        </div>
        
        <div className="">
        <h2 className="  font-medium pb-2">Bio</h2>

        <textarea name="bio" value={'Write a short bio'} id="bio" rows={6} 
        className='border w-full p-4 rounded-md'></textarea>
        </div>
    </div>
  )
}

export default ProfileSettings