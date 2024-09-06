import Image from 'next/image'
import React from 'react'

const StoreFrontImages = () => {
  return (
    <div className="bg-white border mx-auto min-h-[65vh] flex flex-col gap-6 max-w-6xl w-full p-6">
        <div className="flex items-center flex-wrap justify-center gap-4">
        {
            [...Array(9)].map((_,idx)=>{
                return (
                <div key={idx} className="bg-base w-full sm:w-72 border  p-3 space-y-2 hover:ring-2 hover:ring-gray-300 duration-200 rounded-md">
                    <div className="w-full h-72 overflow-hidden rounded-md">
                        <Image src={'/sampl.png'} alt='service-img' width={500} height={500} className='w-full h-full object-cover'/>
                    </div>
                    <p className="text-sm">{`Fade on a client`}</p>
                </div>
            )})
        }
        </div>
    </div>
  )
}

export default StoreFrontImages

// Fade on a client