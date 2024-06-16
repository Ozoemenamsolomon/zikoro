import React, { useState } from 'react';
import { FormProps } from '../types';

const Payment: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  setLoading,
}) => {

  return (
    <div className="p-4">
      Payment forms
    </div>
  );
};

export default Payment;
