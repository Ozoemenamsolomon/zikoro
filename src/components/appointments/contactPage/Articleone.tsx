import React from 'react'
import { ContactDummy } from './constants'
import { Copy, Instagram, Linkedin, Mail, PhoneCall, X } from 'lucide-react'
import Link from 'next/link'
import { Whatsapp } from 'styled-icons/fa-brands'
import { format } from 'date-fns'
import EditContact from './EditContact'

const Articleone = ({contact}:{contact:ContactDummy}) => {
    const {name, email, age, phoneNumber, whatsappNumber, created_at, links, instagram, linkedin, tags} = contact

    return (
        <div className="w-full p-6 md:px-2 min-h-screen space-y-5 bg-white relative z-10">
            <div className="border bg-baseBg rounded-md w-full relative">
                <div className="flex flex-col text-center justify-center items-center p-3 py-5 w-full h-full">
                    <div className="h-16 w-16 rounded-full bg-baseLight uppercase font-semibold shrink-0 flex items-center text-2xl justify-center">
                        {name?.slice(0, 2).toUpperCase()}
                    </div>
                    <h6 className="font-medium pt-3 leading-4">{name}</h6>
                    <small>{email}</small>
                    <small>Age: {age} years</small>

                    <div className="pt-4 flex justify-center items-center gap-2">
                        {
                            [
                                {link: `mailto:${email}`, icon: <Mail />},
                                {link: `tel:${phoneNumber}`, icon: <PhoneCall />},
                                {link: `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Hi, ${name}`, icon: <Whatsapp size={24} />}
                            ].map(({link, icon}, idx) => (
                                <Link href={link} target='_blank' key={idx}
                                      className="bg-purple-100 rounded-full h-12 w-12 shrink-0 flex items-center justify-center">
                                    {icon}
                                </Link>
                            ))
                        }
                    </div>
                </div>
                <EditContact contact={contact}/>
            </div>

            <p className="text-center text-sm py-2"><span className='font-semibold'>Contact Added: </span>{format(new Date(created_at), 'MMM dd yyyy, hh:mm a')} </p>

            <div className="  border rounded-md space-y-3">
            <div className="text-center w-full p-4 bg-baseBg border-b font-semibold   rounded-md">Links</div>

            <div className="px-3 space-y-3 pb-4">
                 <button className="p-3 px-2 border rounded-md flex gap-1 justify-between items-center">
                    <Instagram size={20} className='shrink-0 text-slate-500'/>
                    <p className="w-full overflow-clip">{instagram}</p>
                    <Copy size={20} className='shrink-0 text-slate-500' />
                 </button>

                 <button className="p-3 px-2 border rounded-md flex gap-1 justify-between items-center">
                    <Linkedin size={20} className='shrink-0 text-slate-500'/>
                    <p className="w-full overflow-clip">{linkedin}</p>
                    <Copy size={20} className='shrink-0 text-slate-500' />
                 </button>
            </div>

            </div>

            <div className=" border rounded-md space-y-3">
                <div className="text-center w-full p-4 bg-baseBg border-b font-semibold   rounded-md">Tags</div>

                <div className="flex px-3 pt-3 gap-3 flex-wrap w-full">
                {
                    tags?.map((item,idx)=>{
                        return (
                            <button key={idx} 
                            className={`p-3 py-1 min-w-24 text-center bg-red-500/20 ring-1 ring-red-600 text-red-600 relative  rounded-md
                                `}>
                                    {item}
                                    <button type="button" className='border bg-white p-1  rounded-full text-gray-500 absolute -top-2 right-0'>
                                        <X size={12} className='shrink-0'/>
                                    </button>
                            </button>
                            )
                        })
                    }
                </div>

                <div className="flex p-3 gap-3 w-full">
                    <button 
                    className={`p-3 py-2 w-full text-center bg-white ring-1 rounded-md ring-blue-600 relative
                        `}>
                            Crete new tag
                    </button>
                    <button 
                    className={`p-3 w-full bg-basePrimary text-center text-white   rounded-md text-nowrap relative
                        `}>
                            Add existing tag
                    </button>
                </div>

            </div>

            <div className="  border rounded-md space-y-3">
                <div className="text-center  rounded-md w-full p-4 border-b font-semibold bg-baseBg">
                    Delete contact</div>
                <div className="p-3">
                    <p className="pb-2   text-center">Delete this contact from your contact list</p>
                    <button className="text-center rounded-md w-full p-3 bg-red-600 text-white">Delete contact</button>
                </div>
            </div>
        </div>
    )
}

export default Articleone
