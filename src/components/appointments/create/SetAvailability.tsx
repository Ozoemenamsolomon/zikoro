import React, { useState } from 'react';
import { FormProps } from '../types';

const SetAvailability: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  setLoading,
}) => {

  return (
    <div className="p-4">
      SetAvailability forms
    </div>
  );
};

export default SetAvailability;
