// components/Modal.tsx
import { X } from 'lucide-react';
import React from 'react';
import { useAppointmentContext } from '../context/AppointmentContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelectType: React.FC<ModalProps> = ({ isOpen, onClose,  }) => {
    const {setselectedType} = useAppointmentContext()
  return (
    <div
      className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-transform duration-300 ${
        isOpen ? 'scale-100' : 'scale-0'
      }`}
    >
      <X size={20} onClick={onClose}  className="absolute top-6 right-6 text-gray-500 hover:text-gray-600"/>
      <div className="bg-white grid text-center gap-4 sm:flex max-w-2xl">
        <div className="h- w-full p-4 rounded-lg shadow-md space-y-4">
            <div className="rounded-lg bg-[#D9D9D9] w-full h-40"></div>
            <div className="flex flex-col h-44 justify-between gap-4">
            <div>
                <h4 className="text-xl font-semibold pb-2">Simple schedule</h4>
                <p className="pb-2">
                Create a simple schedule with just one appointment type.
                </p>
            </div>
            <button
                onClick={()=>{
                    onClose()
                    setselectedType('single')}}
                type="button"
                className="bg-basePrimary py-2 text-center px-4 rounded-md text-white hover:-translate-y-0.5 duration-100 transition-transform transform"
            >
                Proceed
            </button>
            </div>
        </div>

        <div className="h- w-full p-4 rounded-lg shadow-md space-y-4">
            <div className="rounded-lg bg-[#D9D9D9] w-full h-40"></div>
            <div className="flex flex-col h-44 justify-between gap-4">
            <div>
                <h4 className="text-xl font-semibold pb-2">Multi schedule</h4>
                <p className="pb-2">
                Create a schedule for different appointment types. Manage multi
                schedules with just one link.
                </p>
            </div>
            <button
                onClick={()=>{
                    onClose()
                    setselectedType('multiple')}}
                type="button"
                className="bg-basePrimary py-2 text-center px-4 rounded-md text-white hover:-translate-y-0.5 duration-100 transition-transform transform"
            >
                Proceed
            </button>
            </div>
        </div>
        </div>

    </div>
  );
};

export default SelectType;
