interface Attendee {
    fullName: string;
    job: string;
    date: string | null; 
    time: string | null; 
    role1: string;
    role2: string | null; 
    id: number;
  }
  
  const AttendeesData: Attendee[] = [
    {
      fullName: "Abdur-rasheed Idris",
      job: "Data Analyst, MTN",
      date: null,
      time: null,
      role1: "Attendee",
      role2: null,
      id: 1,
    },
    {
      fullName: "Cyril Ogoh",
      job: "Social Media manager, Cowrywise",
      date: "29 Oct 2023",
      time: "09:50 AM",
      role1: "Speaker",
      role2: "Sponsor",
      id: 2,
    },
    {
      fullName: "Saviour Usman",
      job: "Growth Marketer, Payday",
      date: null,
      time: null,
      role1: "Sponsor",
      role2: "Exhibitor",
      id: 3,
    },
    {
      fullName: "Adegoke Olaoye",
      job: "Customer care representative, UBA",
      date: "25 Sept 2023",
      time: "11:00 AM",
      role1: "Attendee",
      role2: null,
      id: 4,
    },
    {
      fullName: "Umar Idris",
      job: "Graphics Designer, Paystack",
      date: "20 Sept 2023",
      time: "11:00 AM",
      role1: "Sponsor",
      role2: "Exhibitor",
      id: 5,
    },
    {
      fullName: "Victor Onuche",
      job: "Data Analyst, MTN",
      date: "01 Sept 2023",
      time: "09:00 AM",
      role1: "Speaker",
      role2: "Sponsor",
      id: 6,
    },
  ];
  
  export default AttendeesData;
  