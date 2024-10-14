'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { CenterModal,  } from '../ui/CenterModal'
import { Pencil } from 'lucide-react'
import CustomInput from '../ui/CustomInput'
import { DatePicker } from '../ui/DatePicker'
import LinksInput from '../ui/LinksInput'
import ProfileImageUpload from './ProfileImageUpload'
import { BookingsContact,  } from '@/types/appointments'
import toast from 'react-hot-toast'
import { useAppointmentContext } from '../context/AppointmentContext'

// Form validation helper function
const validateForm = (formData: any) => {
    let errors = {}
    if (!formData.firstName) errors = { ...errors, firstName: 'First name is required' }
    if (!formData.lastName) errors = { ...errors, lastName: 'Last name is required' }
    if (!formData.email) errors = { ...errors, email: 'Email is required' }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors = { ...errors, email: 'Invalid email format' }
    return errors
}

const EditContact = ({contact, }:{contact:BookingsContact, }) => {
    const {  setContact, setContacts } = useAppointmentContext()
    const [formData, setFormData] = useState<BookingsContact>({
        ...contact
        // firstName: contact?.firstName || '',
        // lastName: contact?.lastName || '',
        // profileImg: contact?.profileImg || '',
        // email: contact?.email || '',
        // age: contact?.age,
        // phone: contact?.phone || '',
        // whatsapp: contact?.whatsapp || '',
        // created_at: contact?.created_at  ,
        // links: contact?.links,
        // createdBy: contact?.createdBy,
        // id: contact?.id
    })
    const [errors, setErrors] = useState<any>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setErrors((prev:any) => ({ ...prev, [name]: '' }))
    }, [])

    const handleDateChange = (date: Date | undefined) => {
        setFormData(prev => ({
            ...prev,
            created_at: date ? date.toDateString() : '',
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate the form data
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);
    
        // Proceed only if there are no validation errors
        if (Object.values(validationErrors)?.length === 0) {
            setIsSubmitting(true);
    
            try {
                const res = await fetch('/api/appointments/contacts/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                console.log(res);
                if (res.ok) {
                    const { data } = await res.json();
                    setContacts((prevContacts: BookingsContact[] | null) =>
                            prevContacts
                                ? prevContacts.map(contact =>
                                    contact.id === data.id ? data : contact  
                                )
                                : prevContacts  
                    );
                    setContact(data);
                    toast.success('Contact updated');
                }
            } catch (error) {
                toast.error('Error submitting form');
                console.error('Error submitting form:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };
    
    const isFormValid = useMemo(() => Object.keys(errors).length === 0, [errors])

    return (
        <CenterModal
            className='max-w-3xl  max-h-[95vh] overflow-auto no-scrollbar '
            trigger={
                <button className='border absolute right-3 top-3 rounded-full bg-white p-2'>
                    <Pencil size={20} className='border-b border-black'/>
                </button>
            }
        >
                <div className=" w-full rounded-md    pb-6">
                    <div className="bg-baseLight py-8 px-6 w-full text-xl font-semibold border-b">
                        Edit Contact
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 space-y-4">
                        <div className="flex justify-end pt-6 w-full">
                            <button 
                                type='submit' 
                                className={`bg-basePrimary text-white px-3 py-1 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>

                        <div className="border rounded-md p-4 space-y-4">
                            <h6 className="font-medium">Basic Info</h6>

                            <div className="flex py-2 justify-center w-full">
                                <ProfileImageUpload formData={formData} setFormData={setFormData} />
                                
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <CustomInput
                                    label='First name'
                                    type='text'
                                    name='firstName'
                                    value={formData.firstName!}
                                    placeholder='Enter Name'
                                    error={errors?.firstName}
                                    className=''
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Last name'
                                    type='text'
                                    name='lastName'
                                    value={formData.lastName!}
                                    placeholder='Enter Name'
                                    error={errors?.lastName}
                                    className=''
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Email'
                                    type='email'
                                    name='email'
                                    value={formData.email!}
                                    placeholder='Enter Email'
                                    error={errors?.email}
                                    className=''
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Age'
                                    type='number'
                                    name='age'
                                    value={formData.age!}
                                    placeholder='Enter Age'
                                    error={errors?.age}
                                    className=''
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Phone Number'
                                    type='tel'
                                    name='phone'
                                    value={formData.phone!}
                                    placeholder='Enter Phone Number'
                                    error={errors?.phone}
                                    className=''
                                    onChange={handleChange}
                                />
                                <DatePicker
                                    label='Created At'
                                    name='created_at'
                                    value={formData.created_at}
                                    onChange={handleDateChange}
                                    disabled={false} // Disable or enable as needed
                                />
                            </div>
                        </div>

                        <div className="border rounded-md p-4 space-y-4">
                            <h6 className="font-medium ">Contact Links</h6>

                            <LinksInput 
                                formlinks={formData?.links!} 
                                updateFormLinks={(updatedLinks) => setFormData(prev => ({
                                    ...prev,
                                    links: updatedLinks
                                }))}
                            />
                            
                        </div>
                    </form>
                </div>
        </CenterModal>
    )
}

export default EditContact
