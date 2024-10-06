import { Heart, Search } from 'lucide-react'
import React, { Suspense } from 'react'
import { ContactDummy } from './constants'

type ContactProps = {
    contacts: ContactDummy[]
  }

const ContactList: React.FC<ContactProps> = ({ contacts }) => {
  return (
    <div className="w-full md:w-1/4 p-4 md:px-2 h-full sticky top-0 bg-white ">
                
                <div className="bg-baseBg rounded-md border p-1 px-2 w-full flex items-center ">
                    <Search size={20} className='text-slate-400 shrink-0' />
                    <input type="search" name="search" id="search" placeholder='Search...' className='w-full outline-none bg-transparent focus:outline-none focus:bg-transparent rounded-md p-2'/>
                </div>

                <Suspense fallback={
                    [...Array(5)].map((_, idx) => (
                        <div key={idx} className="bg-slate-300 animate-pulse rounded-md h-14 w-full"></div>
                    ))
                }>
                    <div className="divide-y  ">
                    {
                        contacts?.map(({ name, email, favorite }, idx) => (
                            <div key={idx} className="py-2 w-full">
                                <div  className=" rounded-md w-full p-2  hover:bg-slate-100 duration-300 flex gap-2 items-center">
                                    <div className="h-12 w-12 rounded-full bg-baseLight uppercase font-semibold shrink-0 flex items-center justify-center">
                                    {name?.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="w-full">
                                        <h6 className="font-medium leading-4">{name}</h6>
                                        <small>{email}</small>
                                    </div>
                                    <div className="shrink-0">
                                        <Heart size={20} className={favorite ? 'text-basePrimary' : 'text-gray-800'} />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                </Suspense>
          </div>
  )
}

export default ContactList