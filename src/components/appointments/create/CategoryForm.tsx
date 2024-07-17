import React, { useEffect, useState } from 'react';
import { AppointmentFormData, AppointmentLink } from "@/types/appointments";
import { InputCustom } from '@/components/ui/input-custom';
import { SelectInput } from '../ui/CustomSelect';
import { PlusCircle } from 'lucide-react';
import { useAppointmentContext } from '../context/AppointmentContext';

export interface Category {
  name?: string;
  note?: string;
  isPaidAppointment?: boolean;
  curency?: string;
  amount?: number;
}

interface CategoryFormProps {
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  errors: any;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ setFormData, setErrors, formData, errors }) => {
  const [categories, setCategories] = useState<Category[]|any>([{
    name: '', note: '',}]);
  const {selectedType} = useAppointmentContext()

  useEffect(() => {
    if(selectedType==='multiple') {
        // setCategories(formData?.category!)
        setCategories([...formData?.category, ...categories])
    }
  }, [selectedType])

  const handleCategoryChange = (index: number, field: string, value: any) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    setCategories(updatedCategories);
    setFormData((prev: AppointmentFormData) => ({ ...prev, category: updatedCategories }));
  };

  const addNewCategory = () => {
    if (!categories[categories.length - 1]?.name) {
      setErrors((prev: AppointmentFormData) => ({ ...prev, category: 'Please fill out the current category before adding a new one.' }));
      return;
    }
    setCategories([...categories, {}]);
    setErrors((prev: AppointmentFormData) => ({ ...prev, category: '' }));
  };
console.log({categories})
  return (
    <>
      {Array.isArray(categories) && categories.length && categories?.map((category:Category, index:number) => (
        <div key={index} className="rounded-md space-y-4 bg-slate-50 border relative p-4 pt-6">
          <h5 className="label px-1 bg-slate-50 absolute -top-3 left-3">Appointment Type {index + 1}</h5>

          <InputCustom
            label="Create appointment category (optional)"
            type="text"
            error={errors?.category}
            name={`category-${index}`}
            value={category.name || ''}
            placeholder="Enter category name"
            className="py-6"
            onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
          />

          <div className="pb-2 gap-2 items-center">
            <InputCustom
              type="text"
              label="Appointment Description (optional)"
              error={errors?.note}
              name={`note-${index}`}
              value={category.note || ''}
              placeholder="Add notes for appointment here"
              className="py-6 w-full"
              onChange={(e) => handleCategoryChange(index, 'note', e.target.value)}
            />
          </div>

          <div className="flex gap-4 justify-between items-center">
            <div className="flex-1">
              <h5 className="text-lg font-medium">Make this a paid appointment</h5>
              <p className="text-sm text-gray-600">Guests will be charged to book this appointment</p>
            </div>
            <div
              className={`flex-shrink-0 ${category.isPaidAppointment ? 'bg-blue-600 ring-blue-600 ring-2' : 'bg-gray-300 ring-2 ring-gray-300'} w-14 h-6 p-1.5 relative flex items-center rounded-full cursor-pointer`}
              onClick={() => handleCategoryChange(index, 'isPaidAppointment', !category.isPaidAppointment)}
            >
              <div className="flex w-full justify-between font-semibold text-[9px] text-gray-50">
                <p>ON</p>
                <p>OFF</p>
              </div>
              <div className={`bg-white absolute inset-0 w-7 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform ${category.isPaidAppointment ? 'translate-x-7' : ''}`}></div>
            </div>
          </div>

          {category.isPaidAppointment && (
            <div className="max-h-screen visible transform relative z-10 transition-all duration-300 pb-">
              <p className="pb-2">Set currency and pricing</p>
              <div className="flex gap-8 items-center">
                <SelectInput
                  name="curency"
                  value={category.curency || ''}
                  options={[
                    { label: 'USD', value: 'USD' },
                    { label: 'CAD', value: 'CAD' },
                    { label: 'EUR', value: 'EUR' },
                    { label: 'NGN', value: 'NGN' },
                    { label: 'AUD', value: 'AUD' },
                  ]}
                  setFormData={(data: any) => handleCategoryChange(index, 'curency', data)}
                  placeholder="select"
                  className="w-40 z-50"
                  setError={() => {}}
                  error={errors?.curency}                  
                  onChange={(name, value) => handleCategoryChange(index, name, value)}

                />
                <SelectInput
                  name="amount"
                  value={category.amount || ''}
                  options={[
                    { label: '20', value: 20 },
                    { label: '40', value: 40 },
                    { label: '60', value: 60 },
                    { label: '80', value: 80 },
                    { label: '100', value: 100 },
                  ]}
                  setFormData={(data: any) => handleCategoryChange(index, 'amount', data)}
                  setError={() => {}}
                  placeholder="select"
                  className="w-40 z-50"
                  error={errors?.amount}
                  onChange={(name, value) => handleCategoryChange(index, name, value)}

                />
              </div>
            </div>
          )}
        </div>
      ))}

      <div onClick={addNewCategory} className="text-zikoroBlue cursor-pointer flex gap-2 pt-2 items-center">
        <PlusCircle size={14} />
        <p>Create Appointment Category</p>
      </div>
    </>
  );
};

export default CategoryForm;
