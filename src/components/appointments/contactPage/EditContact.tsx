'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { CenterModal } from '../ui/CenterModal'
import { Pencil } from 'lucide-react'
import { ContactDummy } from './constants'
import CustomInput from '../ui/CustomInput'
import { DatePicker } from '../ui/DatePicker'
import LinksInput from '../ui/LinksInput'
import ProfileImageUpload from './ProfileImageUpload'

// Form validation helper function
const validateForm = (formData: any) => {
    let errors = {}
    if (!formData.name) errors = { ...errors, name: 'Name is required' }
    if (!formData.email) errors = { ...errors, email: 'Email is required' }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors = { ...errors, email: 'Invalid email format' }
    if (formData.age && (formData.age <= 0 || formData.age > 120)) errors = { ...errors, age: 'Invalid age' }
    if (!formData.phoneNumber) errors = { ...errors, phoneNumber: 'Phone number is required' }
    return errors
}

const EditContact = ({ contact }: { contact?: ContactDummy }) => {
    const [formData, setFormData] = useState({
        name: contact?.name || '',
        profileImg: contact?.profileImg || '',
        email: contact?.email || '',
        age: contact?.age || '',
        phoneNumber: contact?.phoneNumber || '',
        whatsappNumber: contact?.whatsappNumber || '',
        created_at: contact?.created_at || new Date().toDateString(),
        instagram: contact?.instagram || '',
        linkedin: contact?.linkedin || '',
        links: contact?.links || { website: '' },
        linkss: contact?.linkss || [{title: '', url: ""},{title: '', url: ""}]
    })
    const [errors, setErrors] = useState<any>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleDateChange = (date: Date | undefined) => {
        setFormData(prev => ({
            ...prev,
            created_at: date ? date.toDateString() : '',
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationErrors = validateForm(formData)
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true)
            setIsLoading(true)
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000))
                console.log('Form submitted successfully', formData)
                setIsSubmitting(false)
            } catch (error) {
                console.error('Error submitting form:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

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
                                disabled={isSubmitting || !isFormValid}
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>

                        <div className="border rounded-md p-4 space-y-4">
                            <h6 className="font-medium">Basic Info</h6>

                            <div className="flex py-2 justify-center w-full">
                                <ProfileImageUpload formData={formData} setFormData={setFormData} />
                                
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <CustomInput
                                    label='Name'
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    placeholder='Enter Name'
                                    error={errors?.name}
                                    className=''
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Email'
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    placeholder='Enter Email'
                                    error={errors?.email}
                                    className=''
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Age'
                                    type='number'
                                    name='age'
                                    value={formData.age}
                                    placeholder='Enter Age'
                                    error={errors?.age}
                                    className=''
                                    onChange={handleChange}
                                />
                                <CustomInput
                                    label='Phone Number'
                                    type='tel'
                                    name='phoneNumber'
                                    value={formData.phoneNumber}
                                    placeholder='Enter Phone Number'
                                    error={errors?.phoneNumber}
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
                                formlinks={formData?.linkss} 
                                updateFormLinks={(updatedLinks) => setFormData(prev => ({
                                    ...prev,
                                    linkss: updatedLinks
                                }))}
                            />
                            
                        </div>
                    </form>
                </div>
        </CenterModal>
    )
}

export default EditContact
