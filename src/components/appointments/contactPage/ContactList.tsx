'use client';

import { Heart, Loader2Icon, Search } from 'lucide-react';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BookingsContact,  } from '@/types/appointments';
import { useAppointmentContext } from '../context/AppointmentContext';
import { useRouter } from 'next/navigation';
import EmptyList from '../ui/EmptyList';

type ContactProps = {
  fetchedcontacts: BookingsContact[] | null;
  searchquery?: string
};

const ContactList: React.FC<ContactProps> = ({ fetchedcontacts, searchquery }) => {
  const {replace} = useRouter()
  const { contact, setContact, contacts, setContacts, isfetching, setIsFetching} =useAppointmentContext()
  const [searchTerm, setSearchTerm] = useState(searchquery || '');
 
  const fiterContacts =  useCallback(() => {
    const filteredres = contacts?.filter(item =>
      `${item.firstName} ${item.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setContacts(filteredres!)
  }, [searchTerm, contacts,contact, setContacts]) 

  useEffect(()=> {
    if(searchTerm){
      fiterContacts()
      setIsFetching(false)
    }else {
      setContacts(fetchedcontacts)
      setContact(fetchedcontacts?.[0] || null)
      setIsFetching(false)
    }
  }, [fetchedcontacts, searchTerm])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    replace(`/appointments/contacts/?s=${value}`);
  }, [replace]);


  return (
    <div className="w-full md:w-1/4 p-4 md:px-2 h-full sticky top-0 bg-white">
      {/* Search input */}
      <div className="bg-baseBg rounded-md border p-1 px-2 w-full flex items-center">
        <Search size={20} className="text-slate-400 shrink-0" />
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search..."
          className="w-full outline-none bg-transparent focus:outline-none rounded-md p-2"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>

      {/* Contact List */}
      <div className="divide-y mt-4">
        {
          isfetching ?
          <div className="py-20 flex justify-xenter"><Loader2Icon className='animae-spin text-basePrimary/50'/></div>
          :
        contacts?.length ? (
          contacts?.map(({ firstName, lastName, email }, idx) => (
            <div 
            key={`${firstName}-${lastName}-${idx}`} 
            onClick={()=>setContact(contacts[idx])}
            className="py-2 w-full cursor-pointer">
              <div className={`${contacts[idx]?.id===contact?.id ? 'bg-slate-100' : ''}
                "rounded w-full p-2 hover:bg-slate-50 duration-300 flex gap-2 items-center"`}>
                <div className="h-12 w-12 rounded-full bg-baseLight uppercase font-semibold shrink-0 flex items-center justify-center">
                    {`${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'NA'}
                </div>
                <div className="w-full">
                  <h6 className="font-medium leading-4">{firstName + ' ' + lastName}</h6>
                  <small>{email}</small>
                </div>
                <div className="shrink-0">
                  <Heart size={20} className={'text-basePrimary'} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyList size='34' text='No contacts found' />
        )}
      </div>
    </div>
  );
};

export default React.memo(ContactList);
