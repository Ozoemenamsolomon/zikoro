import { EmailIcon, FacebookIcon, TwitterIcon, WhatsappIcon } from '@/constants';
import { AppointmentLink } from '@/types/appointments';
import { Code, Copy, XCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import EmbedLink from './EmbedLink';
import CopyLinkButton from '../ui/CopyLinkButton';

interface ShareProps {
  isShare: number|null|bigint; 
  setIsShare: React.Dispatch<React.SetStateAction<number|null|bigint>>;
  idx:number|bigint;
  data: AppointmentLink;
}

const Share: React.FC<ShareProps> = ({data, idx, isShare, setIsShare }) => {
  const [embed, setEmbed] = useState(false)
  const list = [
    {
      icon: <WhatsappIcon />,
      label: 'Whatsapp',
      link: `https://api.whatsapp.com/send?text=https://zikoro.com/booking/${data?.appointmentAlias}`,
    },
    {
      icon: <TwitterIcon />,
      label: 'X',
      link: `https://x.com/intent/tweet?url=https://zikoro.com/booking/${data?.appointmentAlias}`,
    },
    {
      icon: <FacebookIcon />,
      label: 'Facebook',
      link: `https://www.facebook.com/sharer/sharer.php?u=https://zikoro.com/booking/${data?.appointmentAlias}`,
    },
    {
      icon: <EmailIcon />,
      label: 'Email',
      link: `mailto:?subject=Check%20this%20out&body=https://zikoro.com/booking/${data?.appointmentAlias}`,
    },
    {
      icon: <Code />,
      label: 'Embed',
    },
    {
      icon: <Copy />,
      label: 'Copy Link',
    },
  ];

  return (
    <section
        onClick={()=>setIsShare( null)} 
      className={`${
        isShare===idx ? 'scale-100 z-10' : 'scale-0 -z-10'
      } transform transition-all duration-300 ease-in bg-slate-500/5 fixed inset-0 p-4 justify-center items-center flex overflow-auto`}
    >
      <div onClick={e=>e.stopPropagation()} className="py-28  w-full max-w-4xl max-h-[90vh] overflow-auto px-6  rounded-lg bg-white relative shadow-lg ">
           <div className="pb-16 text-center text-xl font-semibold w-full ">
            Share your schedule across various platforms
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 w-full gap-4 pb-6 px-6"
            >
            {list.map(({ icon, label, link }, idx) => {
              if(label==='Embed') {
                return (
                  <div key={idx}
                  onClick={()=>setEmbed(curr=>!curr)}
                  className={` bg-[#F2F2F2] w-full py-6 px-4 flex justify-center rounded-md items-center flex-col gap-4 shadow hover:shadow-md cursor-pointer  ${embed ? 'ring-2 ring-zikoroBlue' : ''}`}
                  >
                    {icon} 
                    <p>{label}</p>
                  </div>
              )}
              if(label==='Copy Link') {
                return (
                  <CopyLinkButton link={`https://zikoro.com/booking/${data?.appointmentAlias}`}>
                    <div key={idx}
                    className="bg-[#F2F2F2] w-full py-6 px-4 flex justify-center items-center flex-col gap-4 shadow-md hover:shadow-xl cursor-pointer rounded-md  "
                    >
                      {icon}
                      <p>{label}</p>
                    </div>
                  </CopyLinkButton>
              )}
              return (
              <Link target='_blank' href={link!}
                className="bg-[#F2F2F2] w-full py-6 px-4 flex justify-center items-center flex-col gap-4 shadow-md hover:shadow-xl cursor-pointer rounded-md "
                key={idx}
              >
                {icon}
                <p>{label}</p>
              </Link >
            )}
            )}
            <XCircle size={20} onClick={()=>setIsShare( null)} className='text-gray-500 absolute top-6 right-6'/>
          </div>

          <EmbedLink embed={embed}/>
      </div>

    </section>
  );
};

export default Share;
