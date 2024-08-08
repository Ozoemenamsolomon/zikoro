import {Loader,  } from 'lucide-react';
import React from 'react';

const PageLoading: React.FC<{isLoading:boolean}> = ({isLoading}) => {
  return (
    <section
      className={`${
        isLoading ? 'z-40' : 'hidden'
      } transform transition-all duration-300 ease-in lg:pl-[252px] bg-slate-300/10 fixed inset-0 p-4 justify-center items-center flex`}
    >
      <Loader className='animate-spin text-zikoroBlue'/>
    </section>
  );
};

export default PageLoading;
