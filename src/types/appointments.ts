export interface AppointmentLink {
    id?:number;
    appointmentName?: string;
    category?: any;
    duration?: number | null;
    loctionType?: string;
    locationDetails?: string;
    timeZone?: string;
    timeDetails?: any;
    curency?: string;
    amount?: number | null;
    paymentGateway?: string;
    maxBooking?: number | null;
    sessionBreak?: number | null;
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
