import { EmailIcon, FacebookIcon, TwitterIcon, WhatsappIcon } from '@/constants';
import { AppointmentLink } from '@/types/appointments';
import { Code, XCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface EmbedProps {
  embed: boolean; 
  // setEmbed: React.Dispatch<React.SetStateAction<number|null|bigint>>;
  data?: AppointmentLink;
}

const EmbedLink: React.FC<EmbedProps> = ({data, embed,  }) => {
  return (
    <div
      className={`${
        embed ? 'max-h-screen' : 'max-h-0 overflow-hidden'
      } transform transition-all duration-300 ease-in `}
    >
    <div
      className={`rounded-md bg-[#F9FAFF] p-6 sm:p-10`}
    >
      {
        `<iframe width="560" height="315" src="https://www.zikorospace.com/embed/5grgdbdGrQw?si=iwARvqOnjGESPfPO" title="appointment schedule" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
      }
    </div>
    </div>
  );
};

export default EmbedLink;

