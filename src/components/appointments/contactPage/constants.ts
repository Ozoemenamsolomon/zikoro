export type ContactDummy = {
    name: string;
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    created_at: Date;
    tags: string[];
    links: {
      website?: string;
      github?: string;
    };
    instagram: string;
    linkedin: string;
    favorite: boolean;
    age: number;
  };
  
  const contacts: ContactDummy[] = [
    {
      name: "John Doe",
      email: "john.doe@email.com",
      phoneNumber: "+12345678901",
      whatsappNumber: "+12345678901",
      created_at: new Date("2023-01-15T09:00:00"),
      tags: ["business", "networking", "startup"],
      links: {
        website: "https://johndoe.com",
        github: "https://github.com/johndoe"
      },
      instagram: "https://instagram.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      favorite: true,
      age: 29,
    },
    {
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phoneNumber: "+19876543210",
      whatsappNumber: "+19876543210",
      created_at: new Date("2022-11-22T12:30:00"),
      tags: ["developer", "design", "marketing"],
      links: {
        website: "https://janesmith.dev",
        github: "https://github.com/janesmith"
      },
      instagram: "https://instagram.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
      favorite: false,
      age: 34,
    },
    {
      name: "Michael Johnson",
      email: "michael.johnson@email.com",
      phoneNumber: "+2349876543210",
      whatsappNumber: "+2349876543210",
      created_at: new Date("2023-05-10T15:45:00"),
      tags: ["freelancer", "consultant", "finance"],
      links: {
        website: "https://michaeljohnson.com"
      },
      instagram: "https://instagram.com/michaeljohnson",
      linkedin: "https://linkedin.com/in/michaeljohnson",
      favorite: true,
      age: 40,
    },
    {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phoneNumber: "+447123456789",
      whatsappNumber: "+447123456789",
      created_at: new Date("2023-07-05T10:15:00"),
      tags: ["education", "technology", "teacher"],
      links: {
        github: "https://github.com/emilydavis"
      },
      instagram: "https://instagram.com/emilydavis",
      linkedin: "https://linkedin.com/in/emilydavis",
      favorite: false,
      age: 26,
    },
    {
      name: "Sophia Williams",
      email: "sophia.williams@email.com",
      phoneNumber: "+33123456789",
      whatsappNumber: "+33123456789",
      created_at: new Date("2022-09-30T17:00:00"),
      tags: ["photography", "travel", "blogger"],
      links: {
        website: "https://sophiawilliams.blog",
      },
      instagram: "https://instagram.com/sophiawilliams",
      linkedin: "https://linkedin.com/in/sophiawilliams",
      favorite: true,
      age: 31,
    }
  ];
  
  export default contacts;

  export const contactNav = [
    {
      label: 'All',
      link: '/appointments/contacts',
    },
    {
      label: 'Favorite',
      link: '/appointments/contacts/favorite',
    },
    {
      label: 'Tags',
      link: '/appointments/contacts/tags',
    },
  ]

  export const contactNavSub = [
    {
      label: 'Contact Info',
      query: 'contact-info',
    },
    {
      label: 'Appointment History',
      query: 'appointment-history',
    },
    {
      label: 'Notes',
      query: 'notes',
    },
    {
      label: 'Media',
      query: 'media',
    },
    {
      label: 'Analytics',
      query: 'analytics',
    },
    
  ]
  