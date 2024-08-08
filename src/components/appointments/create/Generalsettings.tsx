import React, { useState } from 'react';
import { AppointmentFormData, FormProps } from '@/types/appointments';
import { InputCustom } from '@/components/ui/input-custom';
import { SelectInput } from '../ui/CustomSelect';
import { PlusCircle } from 'lucide-react';

const Generalsettings: React.FC<FormProps> = ({
  formData,
  setFormData,
  setErrors,
  errors,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  const addTeamMember = () => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length > 0 && pattern.test(email)) {
      const newTeamMembers = formData?.teamMembers
        ? `${formData.teamMembers}, ${email}`
        : email;
        setFormData && setFormData((prev:AppointmentFormData)=>{
          return {...prev,
            teamMembers: newTeamMembers,}
          });
      setEmail('');
      setError(false);
    } else {
      setError(true);
    }
  };

  const removeEmail = (selected: string) => {
    const newTeamList = formData?.teamMembers
      ?.split(', ')
      .filter((item) => item !== selected)
      .join(', ');

      setFormData && setFormData((prev:AppointmentFormData)=>{
        return {...prev,
          teamMembers: newTeamList || '',}
        });

  };

  return (
    <div className="space-y-4">
      <div className="">
        <p className="pb-2">Add Team members email</p>
        <div className={`${error ? 'ring-2 ring-red-600' : ''} flex rounded-md gap-2 items-center border p-1`}>
          <InputCustom
            type="email"
            name="email"
            value={email}
            placeholder="Enter Team member Email"
            className="border-none pt-0"
            onChange={(e) => {
              setError(false);
              setEmail(e.target.value);
            }}
          />
          <div onClick={addTeamMember} className="cursor-pointer rounded-md flex-shrink-0 text-white bg-basePrimary py-2 px-6">
            Invite
          </div>
        </div>
        {formData?.teamMembers ? (
          <div className="space-y-2 pt-2">
            {formData.teamMembers.split(', ').map((item, idx) => (
              <div key={idx} className="flex max-w-lg justify-between gap-6 items-center h-12 py-1 px-2 border rounded bg-gray-300/10">
                <p>{item}</p>
                <p onClick={() => removeEmail(item)} className="text-red-600 text-sm cursor-pointer">Remove</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="">
        <p className="pb-2">Maximum bookings per session</p>
        <SelectInput
          name="maxBooking"
          value={formData?.maxBooking || ''}
          options={[
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
            { label: '5', value: 5 },
            { label: '10', value: 10 },
          ]}
          setFormData={setFormData!}
          className="w-32 z-50"
          type='number'
          error={errors?.maxBooking}
          setError={setErrors}
          pattern="\d+"
        />
      </div>

      <div className="">
        <label htmlFor="sessionBreak" className="pb-2">Break between sessions in minutes</label>
        <SelectInput
          name="sessionBreak"
          value={formData?.sessionBreak || ''}
          options={[
            { label: '0', value: 0 },
            { label: '5', value: 5 },
            { label: '10', value: 10 },
            { label: '15', value: 15 },
            { label: '20', value: 20 },
          ]}
          setFormData={setFormData!}
          className="w-32"
          type='number'
          setError={setErrors}
          error={errors?.sessionBreak}
          pattern="\d+"
        />
      </div>

      
    </div>
  );
};

export default Generalsettings;
