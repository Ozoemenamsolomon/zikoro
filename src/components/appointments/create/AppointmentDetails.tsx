import React from 'react';
import { FormProps } from '../types'; 

const AppointmentDetails: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  setLoading,
}) => {
  return (
    <div className="p-4">
      <p>Form Component for Appointment Details</p>
    </div>
  );
};

export default AppointmentDetails;
