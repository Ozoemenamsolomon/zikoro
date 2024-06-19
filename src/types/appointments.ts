export interface AppointmentLink {
    appointmentName?: string;
    category?: any;
    duration?: number;
    loctionType?: string;
    locationDetails?: string;
    timeZone?: string;
    timeDetails?: any;
    curency?: string;
    amount?: number;
    paymentGateway?: string;
    maxBooking?: number;
    sessionBreak?: number;
    statusOn?: boolean;
    note?: string;
  }
  
export interface FormProps {
  formData?: AppointmentLink;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  errors?: any;
  setErrors?: React.Dispatch<React.SetStateAction<any>>;
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange?:  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface DetailItem {
  title: string;
  icon: JSX.Element;
  description: string;
  formComponent: React.FC<FormProps>;
}
