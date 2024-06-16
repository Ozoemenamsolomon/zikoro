import React, { useState } from 'react';
import { FormProps } from '../types';

const Generalsettings: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  loading,
  setLoading,
}) => {

  return (
    <div className="p-4">
      Generalsettings forms
    </div>
  );
};

export default Generalsettings;
