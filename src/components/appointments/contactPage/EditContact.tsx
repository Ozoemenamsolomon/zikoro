'use client'

import React from 'react'
import { CenterModal } from '../ui/CenterModal'
import { Pencil } from 'lucide-react'
import { ContactDummy } from './constants'

const EditContact =  ({contact}: {contact?: ContactDummy}) => {
    const { name = '', email = '', age = '', phoneNumber = '', whatsappNumber = '', created_at = new Date().toDateString(), links = {}, instagram = '', linkedin = '', tags = [] } = contact || {}

    const handleSubmit = () => {
        // Handle form submission
    }

    return (
        <CenterModal
            className='max-w-2xl'
            trigger={
                <button className='border absolute right-3 top-3 rounded-full bg-white p-2'>
                    <Pencil size={20} className='border-b border-black'/>
                </button>
            }
        >
            <div className="bg-white w-full rounded-md border overflow-auto hide-scrollbar h-[40rem] ">
                <div className="bg-baseLight py-8 px-6 w-full text-xl font-semibold border-b">
                    Edit Contact
                </div>

                <form onSubmit={handleSubmit} className="px-6">
                    <div className="flex justify-end py-6 w-full">
                        <button type='submit' className="bg-basePrimary text-white px-3 py-1 rounded-md">Save</button>
                    </div>

                    <div className="border rounded-md p-4 space-y-4">
                        <h6 className="font-medium">Basic Info</h6>

                        <div className="justify-center w-full">
                            <div className="h-16 w-16 rounded-full bg-baseLight uppercase font-semibold shrink-0 flex items-center text-2xl justify-center relative">
                                {name?.slice(0, 2).toUpperCase()}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <input type="text" value={name} placeholder="Name" />
                            <input type="email" value={email} placeholder="Email" />
                            <input type="number" value={age} placeholder="Age" />
                            <input type="tel" value={phoneNumber} placeholder="Phone Number" />
                            <input type="date" value={created_at} placeholder="Created At" />
                        </div>

                        <div className="border rounded-md p-3">
                            <h6 className="font-medium pb-8">Contact Links</h6>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <input type="url" value={instagram} placeholder="Instagram" />
                                <input type="url" value={linkedin} placeholder="LinkedIn" />
                                <input type="url" value={whatsappNumber} placeholder="WhatsApp" />
                                <input type="url" value={links.website} placeholder="Website" />
                                <div className="w-full">
                                <button type='button' className="bg-basePrimary text-white px-3 py-1 rounded-md">Add link +</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </CenterModal>
    )
}

export default EditContact
